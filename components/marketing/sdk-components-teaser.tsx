import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardPropsWithOdds } from "@/lib/mrdoge-adapters/match-card"
import type { ShowcaseMatch } from "@/lib/mrdoge-server"

// Quick teaser for mrdoge-ui, the companion component library — same
// MatchCard rendered on the /ui gallery itself (components/home-gallery.tsx),
// same real matches + odds when the build-time fetch succeeded, static
// here (no odds-selection state wired up) since this is just proof, not a
// full demo. Any match whose fetch failed is skipped rather than falling
// back to sample data — a stack of real matches with one fake one mixed in
// would be worse than just showing fewer real cards.
export function SdkComponentsTeaser({ showcases }: { showcases: (ShowcaseMatch | null)[] }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          React Components
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          Build the UI too.
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Open-source, copy-paste React components — match cards, odds
          selectors, bet slips — built for this SDK&apos;s data shape.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-xl flex-col gap-4">
        {showcases
          .filter((showcase): showcase is ShowcaseMatch => showcase !== null)
          .map((showcase) => {
            const market = showcase.markets.find((m) => m.betType === "SOCCER_MATCH_RESULT") ?? showcase.markets[0]
            return (
              <MatchCard
                key={showcase.match.id}
                {...matchToMatchCardPropsWithOdds(showcase.match, market)}
                oddsPosition="right"
              />
            )
          })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/ui">
            Browse components
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}
