"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchHighlight, MatchHighlightSkeleton } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { MatchTimeline, MatchTimelineSkeleton } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { StatsList, StatsListSkeleton } from "@/registry/mrdoge-ui/stats-list/stats-list"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton, OddsLinesSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { matchToMatchTimelineProps } from "@/lib/mrdoge-adapters/match-timeline"
import { statsToStatsListEntries } from "@/lib/mrdoge-adapters/stats-list"
import { toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { toOddsLines } from "@/lib/mrdoge-adapters/odds-lines"

const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]
const BTTS_BET_TYPES = ["SOCCER_BOTH_TEAMS_TO_SCORE", "SOCCER_BOTH_TEAMS_TO_SCORE_PRELIVE"]
const TOTAL_GOALS_BET_TYPES = ["SOCCER_UNDER_OVER", "SOCCER_UNDER_OVER_PRELIVE"]

export interface MatchDetailProps {
  matchId: string
  className?: string
}

/**
 * Match Highlight header plus a Timeline/Odds/Stats tab strip below it.
 * Owns its own data-fetching via the Mr. Doge SDK (`useLiveMatch`/
 * `useOdds`), unlike the rest of mrdoge-ui's plain-props components.
 * Soccer-specific for the Odds tab's three markets — other sports show an
 * empty state there, same as Match Timeline elsewhere.
 */
export function MatchDetail({ matchId, className }: MatchDetailProps) {
  const match = useLiveMatch({ matchId })

  const matchResultMarkets = useOdds({ matchId, betTypes: MATCH_RESULT_BET_TYPES })
  const matchResult = matchResultMarkets?.[0]
  const [matchResultSelectedId, setMatchResultSelectedId] = useState<string | undefined>()

  const bttsMarkets = useOdds({ matchId, betTypes: BTTS_BET_TYPES })
  const btts = bttsMarkets?.[0]
  const [bttsSelectedId, setBttsSelectedId] = useState<string | undefined>()

  const totalGoalsMarkets = useOdds({ matchId, betTypes: TOTAL_GOALS_BET_TYPES })
  const totalGoalsLines = totalGoalsMarkets ? toOddsLines(totalGoalsMarkets) : undefined
  const [totalGoalsSelectedIds, setTotalGoalsSelectedIds] = useState<string[]>([])

  if (match === null) {
    return <p className={className}>Couldn&apos;t load this match right now.</p>
  }

  return (
    <div className={className}>
      {match === undefined ? <MatchHighlightSkeleton /> : <MatchHighlight {...matchToMatchHighlightProps(match)} />}

      <Tabs defaultValue="timeline" className="mt-4">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="odds">Odds</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          {match === undefined ? (
            <MatchTimelineSkeleton />
          ) : (
            <MatchTimeline entries={matchToMatchTimelineProps(match).entries} />
          )}
        </TabsContent>

        <TabsContent value="odds">
          <div className="flex flex-col gap-3">
            {matchResult === undefined ? (
              <OddsSelectorSkeleton optionCount={3} label className="w-full" />
            ) : (
              <OddsSelector
                label={matchResult.displayName}
                options={toOddsOptions(matchResult, { labelFrom: "code" })}
                selectedId={matchResultSelectedId}
                onSelect={setMatchResultSelectedId}
                className="w-full"
              />
            )}
            {btts === undefined ? (
              <OddsSelectorSkeleton optionCount={2} label className="w-full" />
            ) : (
              <OddsSelector
                label={btts.displayName}
                options={toOddsOptions(btts)}
                selectedId={bttsSelectedId}
                onSelect={setBttsSelectedId}
                className="w-full"
              />
            )}
            {totalGoalsLines === undefined ? (
              <OddsLinesSkeleton rowCount={4} className="w-full" />
            ) : (
              <OddsSelector
                label="Total Goals"
                lines={totalGoalsLines}
                selectedLineIds={totalGoalsSelectedIds}
                onSelectLine={(id, selected) =>
                  setTotalGoalsSelectedIds((ids) => (selected ? [...ids, id] : ids.filter((i) => i !== id)))
                }
                enableSliderView
                collapsible
                className="w-full"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          {match === undefined ? (
            <StatsListSkeleton />
          ) : (
            <StatsList entries={statsToStatsListEntries(match.stats)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
