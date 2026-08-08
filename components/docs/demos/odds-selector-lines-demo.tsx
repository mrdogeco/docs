"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsLinesSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps } from "@/lib/mrdoge-adapters/match-card"
import { toOddsLines } from "@/lib/mrdoge-adapters/odds-lines"
import { toConflictCandidates, getConflictingIds } from "@/lib/mrdoge-adapters/conflicts"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { useSharedOddsMatchId, TOTAL_GOALS_BET_TYPES } from "@/components/docs/demos/use-shared-demo-matches"

export function OddsSelectorLinesDemo() {
  const matchId = useSharedOddsMatchId()
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const markets = useOdds({ matchId: matchId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })
  const [selectedLineIds, setSelectedLineIds] = useState<string[]>([])

  if (matchId === null || match === null || markets === null) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }

  const lines = markets ? toOddsLines(markets) : undefined
  // Odds close once the match ends, same as matchToMatchCardProps: drop
  // them rather than freeze on the last live value.
  const showOdds = match?.status !== "completed"

  const conflictCandidates = matchId && markets ? toConflictCandidates(matchId, markets) : []
  const disabledIds = Array.from(getConflictingIds(selectedLineIds, conflictCandidates))

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
            selectedLineIds={selectedLineIds}
            onSelectLine={(id, selected) =>
              setSelectedLineIds((ids) => (selected ? [...ids, id] : ids.filter((i) => i !== id)))
            }
            disabledIds={disabledIds}
            enableSliderView
            collapsible
            className="w-full"
          />
        ))}
    </div>
  )
}
