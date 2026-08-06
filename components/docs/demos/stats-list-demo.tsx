"use client"

import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { StatsList, StatsListSkeleton } from "@/registry/mrdoge-ui/stats-list/stats-list"
import { statsToStatsListEntries, matchToPlayerStatsListEntries } from "@/lib/mrdoge-adapters/stats-list"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useSharedLiveOrCompletedMatchId } from "@/components/docs/demos/use-shared-demo-matches"

export function StatsListDemo() {
  // Prefers a genuinely live match; falls back to a fixed completed match
  // if nothing's live right now (e.g. quiet hours) — an upcoming match
  // would just trade one empty stats view for another.
  const matchId = useSharedLiveOrCompletedMatchId()
  const match = useLiveMatch({ matchId })

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
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
