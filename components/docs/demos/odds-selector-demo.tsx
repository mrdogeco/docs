"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"

// The standard 1X2 line is two different sysnames depending on match state
// — "_PRELIVE" up until kickoff, then "SOCCER_MATCH_RESULT" once live. A
// given match only ever has one of the two at a time, so filtering on both
// keeps this working if the match goes live while the page is open.
const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]

// Resolves the first candidate that actually has odds for betTypes,
// checked in list order, in parallel.
function useMatchIdWithOdds(candidates: Match[] | null | undefined, betTypes: string[]) {
  const [resolvedId, setResolvedId] = useState<string | null | undefined>(undefined)
  const betTypesKey = betTypes.join(",")

  useEffect(() => {
    if (!candidates || candidates.length === 0) return

    let cancelled = false
    Promise.all(
      candidates.map((candidate) =>
        getMrDogeClient()
          .odds.list({ matchId: candidate.id, betTypes })
          .then((markets) => (markets.length > 0 ? candidate.id : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setResolvedId(results.find((id) => id !== null) ?? null)
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

export function OddsSelectorDemo() {
  const trending = useTrendingMatches({
    sports: ["soccer"],
    status: ["upcoming", "live"],
    limit: 20,
  })
  const candidates =
    trending === null || trending === undefined
      ? trending
      : [...trending.filter((m) => m.status !== "live"), ...trending.filter((m) => m.status === "live")]
  const matchId = useMatchIdWithOdds(candidates, MATCH_RESULT_BET_TYPES)
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  const [selectedId, setSelectedId] = useState<string | undefined>()

  if (matchId === null || match === null || markets === null) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }

  const market = markets?.[0]
  // Odds close once the match ends — same as matchToMatchCardProps, drop
  // them rather than freeze on the last live value.
  const showOdds = match?.status !== "completed"

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {match === undefined ? <MatchCard loading /> : <MatchCard {...matchToMatchCardProps(match)} />}
      {showOdds &&
        (market === undefined ? (
          <OddsSelectorSkeleton optionCount={3} className="w-full" />
        ) : (
          <OddsSelector
            options={toOddsOptions(market)}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="w-full"
          />
        ))}
    </div>
  )
}
