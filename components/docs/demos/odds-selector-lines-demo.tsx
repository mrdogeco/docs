"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsLinesSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps } from "@/lib/sdk-adapters/match-card"
import { toOddsLines } from "@/lib/sdk-adapters/odds-lines"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"

// Posts one market per line (Over/Under 0.5, 1.5, 2.5, ...) rather than one
// market total, so useLiveOdds returns all of them, not just one.
const TOTAL_GOALS_BET_TYPES = ["SOCCER_UNDER_OVER_PRELIVE", "SOCCER_UNDER_OVER"]

// Picks the candidate with the most Total Goals lines, checked in
// parallel.
function useMatchIdWithMostLines(candidates: Match[] | null | undefined, betTypes: string[]) {
  const [resolvedId, setResolvedId] = useState<string | null | undefined>(undefined)
  const betTypesKey = betTypes.join(",")

  useEffect(() => {
    if (!candidates || candidates.length === 0) return

    let cancelled = false
    Promise.all(
      candidates.map((candidate) =>
        getMrDogeClient()
          .odds.list({ matchId: candidate.id, betTypes })
          .then((markets) => ({ id: candidate.id, lineCount: markets.length }))
          .catch(() => ({ id: candidate.id, lineCount: 0 }))
      )
    ).then((results) => {
      if (cancelled) return
      const best = results.reduce((a, b) => (b.lineCount > a.lineCount ? b : a))
      setResolvedId(best.lineCount > 0 ? best.id : null)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- betTypesKey is the stable form of betTypes
  }, [candidates, betTypesKey])

  if (candidates === undefined) return undefined
  if (candidates === null || candidates.length === 0) return null
  return resolvedId
}

export function OddsSelectorLinesDemo() {
  const trending = useTrendingMatches({
    sports: ["soccer"],
    status: ["upcoming", "live"],
    limit: 30,
  })
  const candidates =
    trending === null || trending === undefined
      ? trending
      : [...trending.filter((m) => m.status !== "live"), ...trending.filter((m) => m.status === "live")]
  const matchId = useMatchIdWithMostLines(candidates, TOTAL_GOALS_BET_TYPES)

  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })
  const [selectedId, setSelectedId] = useState<string | undefined>()

  if (matchId === null || match === null || markets === null) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }

  const lines = markets ? toOddsLines(markets) : undefined
  // Odds close once the match ends — same as matchToMatchCardProps, drop
  // them rather than freeze on the last live value.
  const showOdds = match?.status !== "completed"

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {match === undefined ? <MatchCard loading /> : <MatchCard {...matchToMatchCardProps(match)} />}
      {showOdds &&
        (lines === undefined ? (
          <OddsLinesSkeleton rowCount={4} className="w-full" />
        ) : (
          <OddsSelector
            label="Total Goals"
            lines={lines}
            selectedId={selectedId}
            onSelect={setSelectedId}
            enableSliderView
            collapsible
            className="w-full"
          />
        ))}
    </div>
  )
}
