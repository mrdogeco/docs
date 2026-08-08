"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/mrdoge-adapters/match-card"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import {
  useSharedLiveMatchId,
  useSharedUpcomingMatchId,
  MATCH_RESULT_BET_TYPES,
} from "@/components/docs/demos/use-shared-demo-matches"

function MatchCardOddsSlot({
  matchId,
  oddsPosition,
}: {
  matchId: string | null | undefined
  oddsPosition?: "bottom" | "right"
}) {
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useOdds({ matchId: match?.id, betTypes: MATCH_RESULT_BET_TYPES })
  // markets is null when no market matched (not loading); preserve that
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
  const upcomingMatchId = useSharedUpcomingMatchId()
  const liveMatchId = useSharedLiveMatchId()

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {/* Stacked variant only needs the same width as the Basic example.
          The row variant below is the one that actually needs max-w-xl, for
          its w-64 side-by-side odds column. */}
      <div className="mx-auto w-full max-w-sm">
        <MatchCardOddsSlot matchId={upcomingMatchId} />
      </div>
      <MatchCardOddsSlot matchId={liveMatchId} oddsPosition="right" />
    </div>
  )
}
