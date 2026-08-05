"use client"

import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { StatsList, StatsListSkeleton } from "@/registry/mrdoge-ui/stats-list/stats-list"
import { statsToStatsListEntries, matchToPlayerStatsListEntries } from "@/lib/mrdoge-adapters/stats-list"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useHighlightMatchId } from "@/components/docs/demos/use-highlight-match-id"

export function StatsListDemo() {
  const matchId = useHighlightMatchId("live")
  const match = useLiveMatch({ matchId: matchId ?? undefined })

  if (matchId === null || match === null) {
    return <p className="text-sm text-fd-muted-foreground">No live match to show right now.</p>
  }

  const entries = match ? statsToStatsListEntries(match.stats) : []
  const playerEntries = match ? matchToPlayerStatsListEntries(match) : []

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
      {playerEntries.length > 0 ? (
        <div className="flex flex-col gap-2 border-t pt-3">
          <span className="text-xs font-medium text-muted-foreground">Player Stats</span>
          <StatsList entries={playerEntries} showBars={false} />
        </div>
      ) : null}
    </div>
  )
}
