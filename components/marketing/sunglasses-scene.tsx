"use client"

import { useEffect, useRef } from "react"
import { Camera, GLTFLoader, Mesh, Program, Renderer, Transform, Vec3 } from "ogl"
import type { Mat4, OGLRenderingContext } from "ogl"
import { cn } from "@/lib/utils"

const MODEL_URL = "/models/sunglasses/scene.gltf"

// OGL's GLTFLoader intentionally leaves shading up to the consumer: every
// primitive comes back wired to a debug NormalProgram (rainbow-by-normal),
// with the real glTF material stashed at `program.gltfMaterial` for us to
// use ourselves. This is that "ourselves" — a plain Lambert + Blinn-Phong
// shader driven by each material's baseColorFactor/roughnessFactor, which
// is all this model actually needs (solid black frame + glossy lens, no
// textures).
const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;

  uniform mat3 normalMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragment = /* glsl */ `
  precision highp float;

  uniform vec4 uBaseColor;
  uniform float uRoughness;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(gl_FrontFacing ? vNormal : -vNormal);
    vec3 viewDir = normalize(vViewPosition);
    // Fixed key light in view space, so it stays put relative to the
    // camera as the object rotates to follow the cursor (stylized product
    // shot look, not a physical world-space light).
    vec3 lightDir = normalize(vec3(0.5, 0.8, 0.6));

    float diffuse = max(dot(normal, lightDir), 0.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float shininess = mix(72.0, 8.0, uRoughness);
    float specular = pow(max(dot(normal, halfDir), 0.0), shininess) * (1.0 - uRoughness);

    vec3 color = uBaseColor.rgb * (0.35 + diffuse * 0.65) + vec3(1.0) * specular * 0.7;
    gl_FragColor = vec4(color, uBaseColor.a);
  }
`

interface GltfMaterial {
  baseColorFactor?: number[]
  roughnessFactor?: number
  alphaMode?: string
  doubleSided?: boolean
}

function litProgram(gl: OGLRenderingContext, material?: GltfMaterial) {
  const baseColor = material?.baseColorFactor ?? [0.04, 0.04, 0.04, 1]
  const roughness = material?.roughnessFactor ?? 0.4
  const transparent = material?.alphaMode === "BLEND"

  return new Program(gl, {
    vertex,
    fragment,
    transparent,
    depthWrite: !transparent,
    cullFace: material?.doubleSided ? false : gl.BACK,
    uniforms: {
      uBaseColor: { value: new Float32Array(baseColor) },
      uRoughness: { value: roughness },
    },
  })
}

// World-space AABB across every mesh under `root`, after `root`'s own
// matrix has been updated. Needed because the model's authored scale/units
// aren't something we control (or want to hardcode a guess for) — this
// lets the camera frame it correctly regardless.
function computeWorldBounds(root: Transform) {
  const min = new Vec3(Infinity, Infinity, Infinity)
  const max = new Vec3(-Infinity, -Infinity, -Infinity)
  const corner = new Vec3()

  const visit = (node: Transform) => {
    if (node instanceof Mesh) {
      node.geometry.computeBoundingBox()
      const bounds = node.geometry.bounds
      for (let i = 0; i < 8; i++) {
        corner.set(
          i & 1 ? bounds.max[0] : bounds.min[0],
          i & 2 ? bounds.max[1] : bounds.min[1],
          i & 4 ? bounds.max[2] : bounds.min[2]
        )
        corner.applyMatrix4(node.worldMatrix as Mat4)
        min.set(Math.min(min.x, corner.x), Math.min(min.y, corner.y), Math.min(min.z, corner.z))
        max.set(Math.max(max.x, corner.x), Math.max(max.y, corner.y), Math.max(max.z, corner.z))
      }
    }
    node.children.forEach((child) => visit(child as Transform))
  }
  visit(root)
  return { min, max }
}

export interface SunglassesSceneProps {
  className?: string
  /** >1 grows the model within its canvas, <1 shrinks it. Tune this rather than the container size to make the sunglasses fill more of the frame. */
  zoom?: number
  /**
   * Nudges the render horizontally, as a percent of canvas width (positive
   * = right). Applied as a CSS transform on the canvas itself rather than
   * a 3D-space offset — which axis is "right" on screen depends on the
   * camera/handedness convention, easy to get backwards; a CSS translateX
   * is unambiguous and doesn't affect the pointer-tracking math below
   * (that still reads the container's own untransformed bounding rect).
   */
  offsetXPercent?: number
}

export function SunglassesScene({
  className,
  zoom = 1,
  offsetXPercent = 3.6,
}: SunglassesSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let destroyed = false
    let raf = 0
    let modelReady = false
    let isVisible = true
    let isPageVisible = !document.hidden

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    const gl = renderer.gl
    const canvas = gl.canvas as HTMLCanvasElement
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    canvas.style.transform = `translateX(${offsetXPercent}%)`
    // Starts invisible, faded in via CSS the moment the model's ready
    // (below) — otherwise there's a beat where the canvas exists but has
    // nothing rendered into it yet, and the arrival animation's opening
    // frame (camera very far out) would just pop straight in. Fading the
    // canvas in right as that animation starts plays them together.
    canvas.style.opacity = "0"
    canvas.style.transition = "opacity 0.6s ease-out"
    container.appendChild(canvas)

    const camera = new Camera(gl, { fov: 35, near: 0.1, far: 1000 })
    const root = new Transform()

    // Target angles come from the pointer; current angles ease toward them
    // each frame (plus a small idle sway) for a soft, slightly springy
    // follow instead of snapping straight to the cursor.
    const MAX_YAW = 0.5
    const MAX_PITCH = 0.26
    let targetYaw = 0
    let targetPitch = 0
    let currentYaw = 0
    let currentPitch = 0

    // Touch devices have no persistent pointer position to track — the
    // model would just sit there inert (idle sway aside). Swap the
    // pointer target for a slow auto-sweep instead, computed per frame in
    // the render loop below. matchMedia over touch-event detection since
    // it reflects the device's *primary* input, not just touch capability
    // (rules out touchscreen laptops that are still mouse-first).
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    const SWEEP_SPEED = 0.3

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(-1, Math.min(1, (event.clientX - cx) / (window.innerWidth / 2)))
      const dy = Math.max(-1, Math.min(1, (event.clientY - cy) / (window.innerHeight / 2)))
      targetYaw = dx * MAX_YAW
      targetPitch = dy * MAX_PITCH
    }
    if (!isCoarsePointer) window.addEventListener("pointermove", onPointerMove)

    // Click reaction: a quick tilt-back-and-lift, like glancing up at the
    // sky, then settling back down — a transient reaction, not a new
    // resting state. sin(π·progress) gives a smooth 0→1→0 hump for free.
    // liftAmount is proportional to the model's own size (set once it's
    // loaded, below), so it scales sensibly regardless of the model's units.
    const CLICK_LOOK_UP_DURATION = 1
    const CLICK_PITCH_BOOST = 0.55
    let liftAmount = 0
    let baseY = 0
    let clickStart: number | null = null
    const onClick = () => {
      clickStart = performance.now()
    }
    container.addEventListener("click", onClick)
    canvas.style.cursor = "pointer"

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      renderer.setSize(w, h)
      camera.perspective({ aspect: w / h })
    }
    const ro = new ResizeObserver(setSize)
    ro.observe(container)
    setSize()

    // "Arrives from far away": once the model's loaded, the camera starts
    // way back (and the frame spins a few extra turns) and eases in to
    // its normal resting distance/orientation, instead of just popping
    // in at full size the instant it's ready. finalDistance/arrivalStart
    // are set once loading completes, below.
    const ARRIVAL_DURATION = 1
    const ARRIVAL_DISTANCE_MULTIPLIER = 10
    const ARRIVAL_SPIN_TURNS = 1
    let finalDistance = 0
    let arrivalStart: number | null = null

    const t0 = performance.now()
    const loop = (t: number) => {
      const elapsed = (t - t0) * 0.001
      // Smooth ping-pong sweep between -MAX_YAW and +MAX_YAW — sin() gives
      // a naturally eased turnaround at each end for free, no easing
      // function needed.
      if (isCoarsePointer) targetYaw = Math.sin(elapsed * SWEEP_SPEED) * MAX_YAW
      currentYaw += (targetYaw - currentYaw) * 0.06
      currentPitch += (targetPitch - currentPitch) * 0.06

      let distance = finalDistance
      let arrivalSpin = 0
      if (arrivalStart !== null) {
        const progress = Math.min((t - arrivalStart) / 1000 / ARRIVAL_DURATION, 1)
        // Ease-out cubic: fast at first, settles gently rather than
        // snapping to a stop.
        const eased = 1 - Math.pow(1 - progress, 3)
        distance = finalDistance * ARRIVAL_DISTANCE_MULTIPLIER * (1 - eased) + finalDistance * eased
        arrivalSpin = ARRIVAL_SPIN_TURNS * Math.PI * 2 * (1 - eased)
        if (progress >= 1) arrivalStart = null
      }
      camera.position.set(0, 0, distance)

      let lookUp = 0
      let lift = 0
      if (clickStart !== null) {
        const clickProgress = Math.min((t - clickStart) / 1000 / CLICK_LOOK_UP_DURATION, 1)
        const hump = Math.sin(Math.PI * clickProgress)
        lookUp = hump * CLICK_PITCH_BOOST
        lift = hump * liftAmount
        if (clickProgress >= 1) clickStart = null
      }

      root.rotation.y = currentYaw + Math.sin(elapsed * 0.6) * 0.03 + arrivalSpin
      // Negative pitch tilts up: pointer-tracking already maps "cursor
      // above center" to a negative targetPitch (see onPointerMove), so
      // this stays consistent with that same convention.
      root.rotation.x = currentPitch + Math.sin(elapsed * 0.5) * 0.015 - lookUp
      root.position.y = baseY + lift
      renderer.render({ scene: root, camera })
      raf = requestAnimationFrame(loop)
    }
    const tryStart = () => {
      if (modelReady && isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop)
    }
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) tryStart()
        else tryStop()
      },
      { threshold: 0 }
    )
    io.observe(container)

    const onVisibility = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) tryStart()
      else tryStop()
    }
    document.addEventListener("visibilitychange", onVisibility)

    GLTFLoader.load(gl, MODEL_URL).then((gltf) => {
      if (destroyed) return

      gltf.scene?.forEach((node) => node.setParent(root))

      gltf.meshes?.forEach((mesh) => {
        mesh.primitives.forEach((primitive) => {
          if (primitive instanceof Mesh) {
            const material = (primitive.program as Program & { gltfMaterial?: GltfMaterial }).gltfMaterial
            primitive.program = litProgram(gl, material)
          }
        })
      })

      root.updateMatrixWorld(true)
      const { min, max } = computeWorldBounds(root)
      const center = new Vec3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
      // Only X/Y (what the camera actually sees as width/height) decide
      // the framing size — the temple arms run deep in Z, and including
      // that depth in the radius was pushing the camera back far enough
      // that the frame's front looked tiny in a large canvas.
      const radius = Math.max(max.x - min.x, max.y - min.y) / 2 || 1

      root.position.set(-center.x, -center.y, -center.z)
      baseY = root.position.y
      liftAmount = radius * 0.18

      // Distance/spin are driven per-frame by the arrival animation in
      // the render loop above once arrivalStart is set; lookAt only needs
      // setting once since the camera only ever moves along its own view
      // axis (distance changes, orientation doesn't).
      finalDistance = (radius / Math.sin((camera.fov * Math.PI) / 360) / Math.max(zoom, 0.01)) * 1.1
      camera.position.set(0, 0, finalDistance * ARRIVAL_DISTANCE_MULTIPLIER)
      camera.lookAt(new Vec3(0, 0, 0))
      arrivalStart = performance.now()
      canvas.style.opacity = "1"

      modelReady = true
      tryStart()
    }).catch((error) => {
      console.error("Failed to load sunglasses model:", error)
    })

    return () => {
      destroyed = true
      tryStop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("visibilitychange", onVisibility)
      container.removeEventListener("click", onClick)
      try {
        container.removeChild(canvas)
      } catch {
        // already gone
      }
    }
  }, [zoom, offsetXPercent])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Sunglasses that tilt to follow your cursor"
      className={cn("h-full w-full", className)}
    />
  )
}
