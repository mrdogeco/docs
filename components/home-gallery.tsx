"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BetSlip } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { CompetitionHeader } from "@/registry/mrdoge-ui/competition-header/competition-header"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { LiveIndicator } from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import { MatchTimeline } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { TeamFormIndicator } from "@/registry/mrdoge-ui/team-form-indicator/team-form-indicator"
import {
  sampleOdds,
  sampleTimeline,
  samplePicks,
  sampleForm,
} from "@/components/docs/sample-data"

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

export function HomeGallery() {
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>("home")
  const [picks, setPicks] = useState(samplePicks)

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
          <MatchCard
            status="live"
            elapsed="63'"
            home={{ name: "Palmeiras" }}
            away={{ name: "Flamengo" }}
            homeScore={2}
            awayScore={1}
            odds={sampleOdds}
            selectedOddsId={selectedOddsId}
            onSelectOdds={setSelectedOddsId}
          />
        </ShowcaseItem>

        <ShowcaseItem
          name="bet-slip"
          title="Bet Slip"
          description="Selected picks, stake input, and computed potential payout."
        >
          <BetSlip
            picks={picks}
            onRemovePick={(id) => setPicks((prev) => prev.filter((p) => p.id !== id))}
          />
        </ShowcaseItem>

        <ShowcaseItem
          name="odds-selector"
          title="Odds Selector"
          description="Selectable price buttons with movement and suspended states."
        >
          <OddsSelector
            options={sampleOdds}
            selectedId={selectedOddsId}
            onSelect={setSelectedOddsId}
            className="w-full max-w-xs"
          />
        </ShowcaseItem>

        <ShowcaseItem
          name="live-indicator"
          title="Live Indicator"
          description="Status pill: scheduled, live, or finished."
        >
          <div className="flex flex-wrap items-center gap-3">
            <LiveIndicator status="scheduled" kickoff={new Date()} />
            <LiveIndicator status="live" elapsed="63'" />
            <LiveIndicator status="finished" />
          </div>
        </ShowcaseItem>

        <ShowcaseItem
          name="match-timeline"
          title="Match Timeline"
          description="Chronological feed of match events."
        >
          <MatchTimeline entries={sampleTimeline} className="w-full max-w-sm" />
        </ShowcaseItem>

        <ShowcaseItem
          name="team-form-indicator"
          title="Team Form Indicator"
          description="Recent match results for a team."
        >
          <TeamFormIndicator results={sampleForm} />
        </ShowcaseItem>

        <ShowcaseItem
          name="competition-header"
          title="Competition Header"
          description="Banner for a competition: name, region, and stage."
        >
          <CompetitionHeader
            name="Brasileirão Série A"
            region="Brazil"
            stage="Round 22"
            className="w-full max-w-sm"
          />
        </ShowcaseItem>
      </div>
    </div>
  )
}
