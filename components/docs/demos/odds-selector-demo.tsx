"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { useSharedOddsMatchId, MATCH_RESULT_BET_TYPES } from "@/components/docs/demos/use-shared-demo-matches"

export function OddsSelectorDemo() {
  const matchId = useSharedOddsMatchId()
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useOdds({ matchId: matchId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  const [selectedId, setSelectedId] = useState<string | undefined>()

  if (matchId === null || match === null || markets === null) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }

  const market = markets?.[0]
  // Odds close once the match ends, same as matchToMatchCardProps: drop
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
