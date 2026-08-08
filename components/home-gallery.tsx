"use client"

import { useState } from "react"
import Link from "next/link"
import type { Market } from "@mrdoge/protocol"

import { Button } from "@/components/ui/button"
import { BetSlip, type BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { MatchCardCompact } from "@/registry/mrdoge-ui/match-card-compact/match-card-compact"
import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { MatchTimeline } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { StatsList } from "@/registry/mrdoge-ui/stats-list/stats-list"
import { matchToMatchCardPropsWithOdds, teamLogoUrl, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { matchToMatchTimelineProps } from "@/lib/mrdoge-adapters/match-timeline"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { statsToStatsListEntries } from "@/lib/mrdoge-adapters/stats-list"
import { toBetSlipPick } from "@/lib/mrdoge-adapters/bet-slip"
import type { ShowcaseMatch } from "@/lib/mrdoge-server"

// Purely a masonry-spacing wrapper, no visual chrome of its own — the
// components themselves carry whatever card look they already have
// (Match Card, Match Highlight, Bet Slip, and Odds Selector all self-style;
// Match Timeline and Stats List are bare lists by design, meant to be
// dropped into whatever container the consumer wants — here, none).
function Scattered({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 break-inside-avoid">{children}</div>
}

// Preferred first, in this order, when present — the API doesn't
// guarantee a stable market order (confirmed: repeat calls for the same
// match returned markets in different orders), so picking "first N
// distinct betTypes encountered" made this section non-deterministic
// between builds. Double Chance especially would come and go depending
// on where it happened to land that request. Anything beyond these 3
// falls back to first-seen order, so `count` > 3 still fills out.
const PREFERRED_BET_TYPES = ["SOCCER_DOUBLE_CHANCE", "SOCCER_BOTH_TEAMS_TO_SCORE", "SOCCER_UNDER_OVER"]

function distinctMarkets(markets: Market[], count: number): Market[] {
  const seen = new Set<string>()
  const picked: Market[] = []

  for (const betType of PREFERRED_BET_TYPES) {
    if (picked.length >= count) break
    const market = markets.find((m) => m.betType === betType)
    if (!market) continue
    seen.add(betType)
    picked.push(market)
  }

  for (const market of markets) {
    if (picked.length >= count) break
    if (seen.has(market.betType)) continue
    seen.add(market.betType)
    picked.push(market)
  }

  return picked
}

function pickMainMarket(markets: Market[]): Market | undefined {
  return markets.find((m) => m.betType === "SOCCER_MATCH_RESULT") ?? markets[0]
}

// "Grouped" odds: several of a match's markets stacked together, same
// pattern as the live Odds Selector Board demo (components/docs/demos/
// odds-selector-board-demo.tsx), minus the live hooks and cross-market
// conflict-blocking — this is a static showcase, not a full booking flow.
// Match Card Compact identifies which match the stack belongs to, same
// role it plays in Bet Slip's own match-group header. Selection state is
// local to this card (keyed by marketId, one selected line per market) —
// nothing downstream reads it, this just makes clicking an option
// actually highlight it instead of being a dead click.
function GroupedOdds({ showcase }: { showcase: ShowcaseMatch }) {
  const markets = distinctMarkets(showcase.markets, 3)
  const [selected, setSelected] = useState<Record<string, string | undefined>>({})
  if (markets.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-3">
      <MatchCardCompact
        home={{ name: showcase.match.homeTeam.name, logoUrl: teamLogoUrl(showcase.match.homeTeam.id) }}
        away={{ name: showcase.match.awayTeam.name, logoUrl: teamLogoUrl(showcase.match.awayTeam.id) }}
        kickoff={showcase.match.startTime}
        className="px-1"
      />
      {markets.map((market) => (
        <OddsSelector
          key={market.id}
          label={market.displayName}
          // Double Chance captions spell out both team names ("França or
          // Draw") — fine in a narrow single-market widget, but wide/
          // wraps awkwardly once real team names are involved here. 1X/X2/12
          // are the standard shorthand for this market, so use codes just
          // for this one betType; every other market keeps real text.
          options={toOddsOptions(market, market.betType === "SOCCER_DOUBLE_CHANCE" ? { labelFrom: "code" } : undefined)}
          selectedId={selected[market.id]}
          onSelect={(id) => setSelected((prev) => ({ ...prev, [market.id]: id }))}
          className="w-full"
        />
      ))}
    </div>
  )
}

// Builds one real BetSlipPick from a showcase match: prefers a market by
// betType and a line by code when given, falls back to the match's main
// market / that market's first line otherwise. Real (suspended) prices —
// same "we have this data even after the match ends" stance as the rest
// of the gallery.
function buildPick(showcase: ShowcaseMatch, prefer: { betType?: string; code?: string } = {}): BetSlipPick | undefined {
  const market = (prefer.betType ? showcase.markets.find((m) => m.betType === prefer.betType) : undefined) ?? pickMainMarket(showcase.markets)
  if (!market) return undefined
  const line = (prefer.code ? market.lines.find((l) => l.code === prefer.code) : undefined) ?? market.lines[0]
  if (!line) return undefined
  return toBetSlipPick(showcase.match, market, line.id)
}

function definedOnly<T>(values: (T | undefined)[]): T[] {
  return values.filter((v): v is T => v !== undefined)
}

export function HomeGallery({
  showcases,
  highlightMatches,
  githubButton,
}: {
  showcases: (ShowcaseMatch | null)[]
  highlightMatches: (ShowcaseMatch | null)[]
  /** Rendered server-side (GithubStarButton is an async Server Component,
   * so it's passed in as an element rather than imported here — this file
   * is a Client Component). */
  githubButton: React.ReactNode
}) {
  const real = showcases.filter((s): s is ShowcaseMatch => s !== null)
  const highlights = highlightMatches.filter((s): s is ShowcaseMatch => s !== null)

  // Slip A: single mode, per-pick stakes — one pick each from two
  // different matches' Match Result markets.
  const [picksA, setPicksA] = useState<BetSlipPick[]>(() =>
    definedOnly([real[0] && buildPick(real[0], { code: "1" }), real[1] && buildPick(real[1], { code: "2" })])
  )
  const [pickStakesA, setPickStakesA] = useState<Record<string, string>>({})
  const [modeA, setModeA] = useState<"single" | "parlay">("single")

  // Slip B: parlay mode, one combined stake — a different match/market
  // combo so the two slips don't just repeat each other.
  const [picksB, setPicksB] = useState<BetSlipPick[]>(() =>
    definedOnly([real[2] && buildPick(real[2]), real[0] && buildPick(real[0], { betType: "SOCCER_BOTH_TEAMS_TO_SCORE" })])
  )
  const [stakeB, setStakeB] = useState("")
  const [modeB, setModeB] = useState<"single" | "parlay">("parlay")

  // Selected line per match's inline Match Card odds row, keyed by
  // matchId — same "just make clicking do something" purpose as
  // GroupedOdds's own local selection state.
  const [selectedOddsByMatch, setSelectedOddsByMatch] = useState<Record<string, string | undefined>>({})
  const selectOdds = (matchId: string, lineId: string | undefined) =>
    setSelectedOddsByMatch((prev) => ({ ...prev, [matchId]: lineId }))

  const statsEntries0 = real[0] ? statsToStatsListEntries(real[0].match.stats) : []

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-32">
      <header className="flex flex-col gap-4">
        <span className="text-sm font-medium text-muted-foreground">mrdoge-ui</span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Open-source components for sports apps
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Copy-paste React components for event cards, odds, bet slips, and
          match data. Built with Tailwind CSS and shadcn/ui. MIT licensed,
          no dependency on any particular data provider.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button asChild>
            <Link href="/docs/ui">Documentation</Link>
          </Button>
          {githubButton}
        </div>
      </header>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {real[0] && (
          <Scattered key={`match-card-${real[0].match.id}`}>
            <MatchCard
              {...matchToMatchCardPropsWithOdds(real[0].match, pickMainMarket(real[0].markets))}
              selectedOddsId={selectedOddsByMatch[real[0].match.id]}
              onSelectOdds={(id) => selectOdds(real[0]!.match.id, id)}
            />
          </Scattered>
        )}

        {picksA.length > 0 && (
          <Scattered>
            <BetSlip
              picks={picksA}
              onRemovePick={(id) => setPicksA((prev) => prev.filter((p) => p.id !== id))}
              pickStakes={pickStakesA}
              onPickStakeChange={(id, value) => setPickStakesA((prev) => ({ ...prev, [id]: value }))}
              mode={modeA}
              onModeChange={setModeA}
            />
          </Scattered>
        )}

        {real[1] && (
          <Scattered key={`odds-selector-${real[1].match.id}`}>
            <GroupedOdds showcase={real[1]} />
          </Scattered>
        )}

        {real[1] && (
          <Scattered key={`match-card-${real[1].match.id}`}>
            <MatchCard {...matchToMatchCardPropsWithOdds(real[1].match)} />
          </Scattered>
        )}

        {real[0] && statsEntries0.length > 0 && (
          <Scattered key={`stats-list-${real[0].match.id}`}>
            <MatchCardCompact
              home={{ name: real[0].match.homeTeam.name, logoUrl: teamLogoUrl(real[0].match.homeTeam.id) }}
              away={{ name: real[0].match.awayTeam.name, logoUrl: teamLogoUrl(real[0].match.awayTeam.id) }}
              kickoff={real[0].match.startTime}
              className="mb-3"
            />
            <StatsList entries={statsEntries0} className="w-full" />
          </Scattered>
        )}

        {picksB.length > 0 && (
          <Scattered>
            <BetSlip
              picks={picksB}
              onRemovePick={(id) => setPicksB((prev) => prev.filter((p) => p.id !== id))}
              mode={modeB}
              onModeChange={setModeB}
              stake={stakeB}
              onStakeChange={setStakeB}
            />
          </Scattered>
        )}

        {highlights[1] && (
          <Scattered key={`match-highlight-${highlights[1].match.id}`}>
            <MatchHighlight {...matchToMatchHighlightProps(highlights[1].match)} />
          </Scattered>
        )}

        {real[2] && (
          <Scattered key={`match-card-${real[2].match.id}`}>
            <MatchCard
              {...matchToMatchCardPropsWithOdds(real[2].match, pickMainMarket(real[2].markets))}
              selectedOddsId={selectedOddsByMatch[real[2].match.id]}
              onSelectOdds={(id) => selectOdds(real[2]!.match.id, id)}
            />
          </Scattered>
        )}

        {real[0] && (
          <Scattered key={`match-timeline-${real[0].match.id}`}>
            <MatchHighlight {...matchToMatchHighlightProps(real[0].match)} />
            <MatchTimeline entries={matchToMatchTimelineProps(real[0].match).entries} className="w-full" />
          </Scattered>
        )}

        {real[0] && (
          <Scattered key={`odds-selector-${real[0].match.id}`}>
            <GroupedOdds showcase={real[0]} />
          </Scattered>
        )}
      </div>
    </div>
  )
}
