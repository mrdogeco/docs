import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PhoneMockup } from "./phone-mockup"

// Same screenshot + phone-mockup treatment as mrdoge-ai's own landing page
// (components/marketing/app-showcase.tsx) — proof that this is a real,
// shipping app running on the SDK, not a mockup. Copy is reframed for a
// developer audience (no App/Play Store buttons — those belong on
// mrdoge.ai, not here) and links out to the app itself instead.
export function SdkAppShowcase() {
  return (
    <section className="relative mx-auto w-full max-w-5xl overflow-hidden px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          A live showcase
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          The official Mr. Doge App
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Mr. Doge — live scores, odds, and AI picks for millions of matches —
          runs on the exact same SDK you&apos;d install today.
        </p>
      </div>

      <div className="relative mx-auto mt-14 w-[min(460px,86vw)]">
        <div aria-hidden className="absolute -inset-x-12 inset-y-6 rounded-full bg-[#EC4899]/25 blur-3xl" />
        <div
          className="relative aspect-[9/15] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          <PhoneMockup className="absolute inset-x-0 top-0 w-full">
            <Image
              src="/assets/mrdoge-app-screenshot.png"
              alt="Mr. Doge app — live match discovery screen"
              fill
              sizes="(max-width: 768px) 86vw, 460px"
              className="object-contain object-top"
            />
          </PhoneMockup>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="https://mrdoge.ai" target="_blank" rel="noopener noreferrer">
            Try the app
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}
