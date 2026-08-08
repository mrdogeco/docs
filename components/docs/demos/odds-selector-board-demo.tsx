"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { pickMostBalancedMarket } from "@/lib/mrdoge-adapters/odds-lines"
import { toConflictCandidates, getConflictingIds } from "@/lib/mrdoge-adapters/conflicts"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import {
  useSharedOddsMatchId,
  MATCH_RESULT_BET_TYPES,
  TOTAL_GOALS_BET_TYPES,
  DOUBLE_CHANCE_BET_TYPES,
} from "@/components/docs/demos/use-shared-demo-matches"

export function OddsSelectorBoardDemo() {
  const matchId = useSharedOddsMatchId()
  const match = useLiveMatch({ matchId: matchId ?? undefined })

  const matchResultMarkets = useOdds({ matchId: matchId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  const matchResult = matchResultMarkets?.[0]
  const matchResultMovement = useOddsMovement(matchResult)
  const [matchResultSelectedId, setMatchResultSelectedId] = useState<string | undefined>()

  const totalGoalsMarkets = useOdds({ matchId: matchId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })
  const totalGoals = totalGoalsMarkets ? pickMostBalancedMarket(totalGoalsMarkets) : undefined
  const totalGoalsMovement = useOddsMovement(totalGoals)
  const [totalGoalsSelectedId, setTotalGoalsSelectedId] = useState<string | undefined>()

  const doubleChanceMarkets = useOdds({ matchId: matchId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
  const doubleChance = doubleChanceMarkets?.[0]
  const doubleChanceMovement = useOddsMovement(doubleChance)
  const [doubleChanceSelectedId, setDoubleChanceSelectedId] = useState<string | undefined>()

  if (
    matchId === null ||
    match === null ||
    matchResultMarkets === null ||
    totalGoalsMarkets === null ||
    doubleChanceMarkets === null
  ) {
    return <p className="text-sm text-fd-muted-foreground">No trending match to show right now.</p>
  }

  // Odds close once the match ends, same as matchToMatchCardProps: drop
  // them rather than freeze on the last live value.
  const showOdds = match?.status !== "completed"

  // Match Result and Double Chance describe overlapping information
  // about the same result, so any selection in one blocks the entire
  // other market rather than just a specific contradicting option.
  const mrDcCandidates =
    matchId && matchResultMarkets && doubleChanceMarkets
      ? toConflictCandidates(matchId, [...matchResultMarkets, ...doubleChanceMarkets])
      : []
  const matchResultDisabledIds = Array.from(
    getConflictingIds(doubleChanceSelectedId ? [doubleChanceSelectedId] : [], mrDcCandidates)
  )
  const doubleChanceDisabledIds = Array.from(
    getConflictingIds(matchResultSelectedId ? [matchResultSelectedId] : [], mrDcCandidates)
  )

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {match === undefined ? <MatchCard loading /> : <MatchCard {...matchToMatchCardProps(match)} />}
      {showOdds &&
        (matchResult === undefined ? (
          <OddsSelectorSkeleton optionCount={3} label className="w-full" />
        ) : (
          <OddsSelector
            label={matchResult.displayName}
            options={toOddsOptions(matchResult, { labelFrom: "code", movementById: matchResultMovement })}
            selectedId={matchResultSelectedId}
            onSelect={setMatchResultSelectedId}
            disabledIds={matchResultDisabledIds}
            className="w-full"
          />
        ))}
      {showOdds &&
        (doubleChance === undefined ? (
          <OddsSelectorSkeleton optionCount={3} label className="w-full" />
        ) : (
          <OddsSelector
            label={doubleChance.displayName}
            options={toOddsOptions(doubleChance, { labelFrom: "code", movementById: doubleChanceMovement })}
            selectedId={doubleChanceSelectedId}
            onSelect={setDoubleChanceSelectedId}
            disabledIds={doubleChanceDisabledIds}
            className="w-full"
          />
        ))}
      {showOdds &&
        (totalGoals === undefined ? (
          <OddsSelectorSkeleton optionCount={2} label className="w-full" />
        ) : (
          <OddsSelector
            label={totalGoals.displayName}
            options={toOddsOptions(totalGoals, { movementById: totalGoalsMovement })}
            selectedId={totalGoalsSelectedId}
            onSelect={setTotalGoalsSelectedId}
            className="w-full"
          />
        ))}
    </div>
  )
}
