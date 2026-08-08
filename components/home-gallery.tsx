"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BetSlip } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { MatchCard, type MatchCardDataProps } from "@/registry/mrdoge-ui/match-card/match-card"
import { MatchTimeline, type MatchTimelineEntry } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { OddsSelector, type OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { sampleOdds, sampleTimeline, samplePicks } from "@/components/docs/sample-data"
import { matchToMatchCardPropsWithOdds, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { matchToMatchTimelineProps } from "@/lib/mrdoge-adapters/match-timeline"
import type { ShowcaseMatch } from "@/lib/mrdoge-server"

const REGISTRY_URL = "https://mrdoge.co"

function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const command = `npx shadcn@latest add ${REGISTRY_URL}/r/${name}.json`

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/70"
    >
      <span className="truncate">{command}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0" />
      ) : (
        <Copy className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
      )}
    </button>
  )
}

function ShowcaseItem({
  name,
  title,
  description,
  children,
}: {
  name: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl ring-1 ring-foreground/10 p-6">
      <div className="flex flex-col gap-1">
        <Link href={`/docs/ui/components/${name}`} className="w-fit">
          <h2 className="text-base font-medium underline-offset-4 hover:underline">
            {title}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg bg-zinc-50 p-8 dark:bg-zinc-900/40">
        {children}
      </div>
      <InstallCommand name={name} />
    </section>
  )
}

export function HomeGallery({ showcase }: { showcase: ShowcaseMatch | null }) {
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>("home")
  const [picks, setPicks] = useState(samplePicks)
  const [stake, setStake] = useState("")

  // Real match — the 2026 World Cup Final — fetched server-side at build
  // time (lib/mrdoge-server.ts). Falls back to hand-picked sample data
  // below if that fetch failed (missing key, build-time network hiccup).
  const market = showcase?.markets.find((m) => m.betType === "SOCCER_MATCH_RESULT") ?? showcase?.markets[0]

  const matchCardProps: MatchCardDataProps = showcase
    ? {
        ...matchToMatchCardPropsWithOdds(showcase.match, market),
        selectedOddsId,
        onSelectOdds: setSelectedOddsId,
      }
    : {
        status: "live",
        elapsed: "63'",
        home: { name: "Palmeiras" },
        away: { name: "Flamengo" },
        homeScore: 2,
        awayScore: 1,
        odds: { market: "Match Result", options: sampleOdds },
        selectedOddsId,
        onSelectOdds: setSelectedOddsId,
      }

  const timelineEntries: MatchTimelineEntry[] = showcase
    ? matchToMatchTimelineProps(showcase.match).entries
    : sampleTimeline

  const oddsSelectorOptions: OddsOption[] = market ? toOddsOptions(market, { labelFrom: "caption" }) : sampleOdds

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-medium text-muted-foreground">mrdoge-ui</span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Open-source components for sports betting apps
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Copy-paste React components for event cards, odds, bet slips, and
          match data. Built with Tailwind CSS and shadcn/ui. MIT licensed,
          no dependency on any particular data provider.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/mrdogeco/ui">GitHub</a>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ShowcaseItem
          name="match-card"
          title="Match Card"
          description="Compact match row with teams, live status, and an optional odds row."
        >
          <MatchCard {...matchCardProps} />
        </ShowcaseItem>

        <ShowcaseItem
          name="bet-slip"
          title="Bet Slip"
          description="Selected picks, stake input, and computed potential payout."
        >
          <BetSlip
            picks={picks}
            onRemovePick={(id) => setPicks((prev) => prev.filter((p) => p.id !== id))}
            stake={stake}
            onStakeChange={setStake}
          />
        </ShowcaseItem>

        <ShowcaseItem
          name="odds-selector"
          title="Odds Selector"
          description="Selectable price buttons with movement and suspended states."
        >
          <OddsSelector
            options={oddsSelectorOptions}
            selectedId={selectedOddsId}
            onSelect={setSelectedOddsId}
            className="w-full max-w-xs"
          />
        </ShowcaseItem>

        <ShowcaseItem
          name="match-timeline"
          title="Match Timeline"
          description="Chronological feed of match events."
        >
          <MatchTimeline entries={timelineEntries} className="w-full max-w-sm" />
        </ShowcaseItem>
      </div>
    </div>
  )
}
