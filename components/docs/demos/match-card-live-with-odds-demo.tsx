"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/sdk-adapters/match-card"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"
import { useTrendingMatchIdWithOdds } from "@/components/docs/use-trending-match-id-with-odds"

// The standard 1X2 line is two different sysnames depending on match state
// — "_PRELIVE" up until kickoff, then "SOCCER_MATCH_RESULT" once live. A
// given match only ever has one of the two at a time, so filtering on both
// gets the right one either way.
const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]

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
    return <MatchCard loading />
  }
  return (
    <MatchCard
      {...matchToMatchCardProps(match, market ?? undefined, movementById)}
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
