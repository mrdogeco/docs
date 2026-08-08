import Grainient from "./grainient"

type Props = {
  title: string
  description: string
  /** Buttons / actions rendered below the description. */
  children: React.ReactNode
}

/**
 * Sunset-gradient CTA section, ported from mrdoge-ai's developer landing
 * (same Grainient background, same card treatment).
 */
export function BrandedCta({ title, description, children }: Props) {
  return (
    <section className="relative overflow-hidden pt-12 sm:py-16">
      {/* Soft pink radial behind the card */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(236,72,153,0.2),transparent_70%)]"
      />

      {/* Full-bleed, flat, no shadow below sm. Only becomes a floating
          card with margins/rounded corners/shadow at sm and up. */}
      <div className="relative mx-auto w-full max-w-5xl px-0 py-0 sm:px-6">
        <div className="relative overflow-hidden rounded-none shadow-none sm:rounded-3xl sm:shadow-2xl sm:shadow-[#EC4899]/30">
          <Grainient
            color1="#FAAF45"
            color2="#EC4899"
            color3="#FADFAD"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />

          <div className="relative z-10 py-24 px-3 text-center sm:p-16">
            <h2 className="text-balance text-4xl font-bold tracking-tight text-black sm:text-6xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-black/80">
              {description}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
