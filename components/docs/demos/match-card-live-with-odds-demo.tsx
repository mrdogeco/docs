"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/sdk-adapters/match-card"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"

// The standard 1X2 line is two different sysnames depending on match state
// — "_PRELIVE" up until kickoff, then "SOCCER_MATCH_RESULT" once live. A
// given match only ever has one of the two at a time, so filtering on both
// gets the right one either way.
const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]

// Docs-only: not every trending match has this market posted yet, so
// picking blind sometimes had nothing to show. Given an already-fetched
// trending list, resolves the first candidate that actually has odds for
// betTypes — not-yet-live candidates first (or live-first with
// preferLive), checked in trending rank order, in parallel.
//
// undefined = loading, null = none of the trending matches have this market.
function useTrendingMatchIdWithOdds({
  trending,
  betTypes,
  preferLive = false,
}: {
  trending: Match[] | null | undefined
  betTypes: string[]
  preferLive?: boolean
}) {
  const [matchId, setMatchId] = useState<string | null | undefined>(undefined)
  const betTypesKey = betTypes.join(",")

  useEffect(() => {
    if (trending === undefined) return
    if (trending === null || trending.length === 0) {
      setMatchId(null)
      return
    }

    let cancelled = false
    const live = trending.filter((m) => m.status === "live")
    const notLive = trending.filter((m) => m.status !== "live")
    const ordered = preferLive ? [...live, ...notLive] : [...notLive, ...live]

    Promise.all(
      ordered.map((candidate) =>
        getMrDogeClient()
          .odds.list({ matchId: candidate.id, betTypes })
          .then((markets) => (markets.length > 0 ? candidate.id : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setMatchId(results.find((id) => id !== null) ?? null)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- betTypesKey is the stable form of betTypes; trending itself is the real trigger
  }, [trending, betTypesKey, preferLive])

  return matchId
}

function MatchCardOddsSlot({
  matchId,
  oddsPosition,
}: {
  matchId: string | null | undefined
  oddsPosition?: "bottom" | "right"
}) {
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const market = useLiveOdds({ matchId: match?.id, betTypes: MATCH_RESULT_BET_TYPES })
  const movementById = useOddsMovement(market)
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>()

  if (matchId === null || match === null) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }
  if (match === undefined) {
    return <MatchCard loading oddsLoading oddsPosition={oddsPosition} />
  }
  return (
    <MatchCard
      {...matchToMatchCardProps(match, market ?? undefined, movementById)}
      oddsLoading={market === undefined}
      oddsPosition={oddsPosition}
      selectedOddsId={selectedOddsId}
      onSelectOdds={setSelectedOddsId}
    />
  )
}

export function MatchCardLiveWithOddsDemo() {
  // One trending fetch, shared by both slots below — each just picks a
  // different candidate out of the same list instead of re-requesting it.
  const trending = useTrendingMatches({ sports: ["soccer"], limit: 10 })
  const notLiveMatchId = useTrendingMatchIdWithOdds({ trending, betTypes: MATCH_RESULT_BET_TYPES })
  const liveMatchId = useTrendingMatchIdWithOdds({
    trending,
    betTypes: MATCH_RESULT_BET_TYPES,
    preferLive: true,
  })

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {/* Stacked variant only needs the same width as the Basic example — the
          row variant below is the one that actually needs max-w-xl, for its
          w-64 side-by-side odds column. */}
      <div className="mx-auto w-full max-w-sm">
        <MatchCardOddsSlot matchId={notLiveMatchId} />
      </div>
      <MatchCardOddsSlot matchId={liveMatchId} oddsPosition="right" />
    </div>
  )
}
