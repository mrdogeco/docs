"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/mrdoge-adapters/match-card"
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

// Tries `preferred` candidates first, then `fallback` ones — not every
// candidate has odds posted (checked downstream by useMatchIdWithOdds), so
// an empty check alone isn't enough: even a non-empty preferred list can
// have nothing that actually qualifies. Optionally excludes a specific id
// so the two slots below don't end up showing the same match twice.
function withFallback(
  preferred: Match[] | null | undefined,
  fallback: Match[] | null | undefined,
  exclude?: string | null
) {
  if (preferred === undefined || fallback === undefined) return undefined
  if (preferred === null || fallback === null) return null
  return [...preferred, ...fallback.filter((m) => m.id !== exclude)]
}

function MatchCardOddsSlot({
  matchId,
  oddsPosition,
}: {
  matchId: string | null | undefined
  oddsPosition?: "bottom" | "right"
}) {
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useLiveOdds({ matchId: match?.id, betTypes: MATCH_RESULT_BET_TYPES })
  // markets is null when no market matched (not loading) — preserve that
  // distinction rather than letting `null?.[0]` collapse it into undefined
  // (which would mean "still loading" and get stuck showing a skeleton).
  const market = markets === null ? null : markets?.[0]
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
  const trending = useTrendingMatches({
    sports: ["soccer"],
    status: ["upcoming", "live"],
    limit: 20,
  })
  // trending?.filter(...) would collapse a failed fetch (null) into
  // undefined (still loading) — propagate null explicitly instead.
  const notLive = trending === null ? null : trending?.filter((m) => m.status !== "live")
  const live = trending === null ? null : trending?.filter((m) => m.status === "live")

  const liveMatchId = useMatchIdWithOdds(withFallback(live, notLive), MATCH_RESULT_BET_TYPES)
  const notLiveMatchId = useMatchIdWithOdds(
    withFallback(notLive, live, liveMatchId),
    MATCH_RESULT_BET_TYPES
  )

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
