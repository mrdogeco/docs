import { cn } from "@/lib/utils"
import { FluidMorphBg } from "./fluid-morph-bg"

type Props = {
  title: React.ReactNode
  description: string
  /** Buttons / actions rendered below the description. */
  children: React.ReactNode
  /** "h1" when this is the page hero — only BrandedCta-style CTA usage should stay "h2". */
  titleAs?: "h1" | "h2"
  /** Extra classes merged onto the title element — e.g. the hero's Bungee/gradient treatment. Base styling (size, weight, color) still applies unless overridden. */
  titleClassName?: string
}

/**
 * Same card treatment as BrandedCta (rounded-3xl, shadow, content over an
 * animated background) — swapped to the morphing-blob SVG background
 * instead of the Grainient shader. Used both as the page hero (titleAs="h1")
 * and as a CTA section.
 */
export function FluidMorphCard({ title, description, children, titleAs: Title = "h2", titleClassName }: Props) {
  return (
    <section className="relative overflow-hidden pt-0 pb-12 sm:py-16">
      {/* Soft blue radial behind the card */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(38,72,230,0.2),transparent_70%)]"
      />

      {/* Full-bleed, flat, no shadow below sm — only becomes a floating
          card with margins/rounded corners/shadow at sm and up. */}
      <div className="relative mx-auto w-full max-w-5xl px-0 sm:py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-none shadow-none sm:rounded-3xl sm:shadow-2xl sm:shadow-[#2648E6]/30">
          <FluidMorphBg className="absolute inset-0" />

          <div className="relative z-10 py-24 px-3 text-center sm:p-16">
            <Title className={cn("text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl", titleClassName)}>
              {title}
            </Title>
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-white/80">
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
