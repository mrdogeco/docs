"use client"

import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { StatsList, StatsListSkeleton } from "@/registry/mrdoge-ui/stats-list/stats-list"
import { statsToStatsListEntries } from "@/lib/mrdoge-adapters/stats-list"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useSharedLiveOrCompletedMatchId } from "@/components/docs/demos/use-shared-demo-matches"

export function StatsListDemo() {
  const matchId = useSharedLiveOrCompletedMatchId()
  const match = useLiveMatch({ matchId })

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

  const entries = match ? statsToStatsListEntries(match.stats) : []

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {match === undefined ? <MatchHighlight loading /> : <MatchHighlight {...matchToMatchHighlightProps(match)} />}
      {match === undefined ? (
        <StatsListSkeleton />
      ) : entries.length === 0 ? (
        <p className="text-sm text-fd-muted-foreground">No stats reported for this match's sport yet.</p>
      ) : (
        <StatsList entries={entries} />
      )}
    </div>
  )
}
