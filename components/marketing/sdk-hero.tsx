import Link from "next/link"

import { Button } from "@/components/ui/button"
import { bungee } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { GithubStarButton } from "./github-star-button"
import { ProductHuntBanner } from "./product-hunt-banner"
import { SunglassesScene } from "./sunglasses-scene"
import Grainient from "./grainient"

// Same font treatment as mrdoge.ai/developers' hero title: Bungee
// display font, uppercase, tight leading.
const TITLE_CLASSNAME = cn(bungee.className, "uppercase leading-[0.88] tracking-tight")

// Full-bleed hero: the fluid blob background fills the whole section
// (not boxed into a card), with the sunglasses, title, and description
// stacked on top — one big hero moment instead of a card floating in a
// section.
export function SdkHero() {
  return (
    <>
      <section className="relative overflow-hidden pt-15.5">
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
          className="hidden dark:block"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-3 pt-8 pb-20 text-center sm:px-6 sm:pt-12 sm:pb-16">
          <ProductHuntBanner />

          <div className="h-40 w-full max-w-2xs sm:h-72 sm:max-w-lg">
            <SunglassesScene zoom={1.6} />
          </div>

          <h1 className={cn("text-balance text-5xl font-bold tracking-tight text-black sm:text-8xl", TITLE_CLASSNAME)}>
            The <span className="text-[#EC4899] dark:text-[#FADFAD] drop-shadow-xs drop-shadow-black/50">odds</span> in
            <br />
            your favor
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-black/80">
            Matches, live odds, stats, AI predictions and insights. Native WebSocket support. Typed end to end.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-black px-6 py-3 text-white shadow-lg hover:bg-black/90"
            >
              <Link href="/docs">Read the docs</Link>
            </Button>

            <GithubStarButton />
          </div>
        </div>
      </section>
    </>
  )
}
