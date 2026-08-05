"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { matchToMatchCardProps, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { pickMostBalancedMarket } from "@/lib/mrdoge-adapters/odds-lines"
import { toConflictCandidates, getConflictingIds } from "@/lib/mrdoge-adapters/conflicts"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"

// Two markets posted for the full length of any match. Each has a
// separate sysname before kickoff, so both forms are included.
const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]
const TOTAL_GOALS_BET_TYPES = ["SOCCER_UNDER_OVER", "SOCCER_UNDER_OVER_PRELIVE"]
const DOUBLE_CHANCE_BET_TYPES = ["SOCCER_DOUBLE_CHANCE"]

// Resolves the first candidate that has all three markets posted, checked
// in parallel.
function useBoardMatchId(candidates: Match[] | null | undefined) {
  const [resolvedId, setResolvedId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    if (!candidates || candidates.length === 0) return

    let cancelled = false
    Promise.all(
      candidates.map((candidate) =>
        Promise.all([
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: MATCH_RESULT_BET_TYPES }),
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: TOTAL_GOALS_BET_TYPES }),
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: DOUBLE_CHANCE_BET_TYPES }),
        ])
          .then(([matchResult, totalGoals, doubleChance]) =>
            matchResult.length > 0 && totalGoals.length > 0 && doubleChance.length > 0 ? candidate.id : null
          )
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setResolvedId(results.find((id) => id !== null) ?? null)
    })

    return () => {
      cancelled = true
    }
  }, [candidates])

  if (candidates === undefined) return undefined
  if (candidates === null || candidates.length === 0) return null
  return resolvedId
}

export function OddsSelectorBoardDemo() {
  const trending = useTrendingMatches({ sports: ["soccer"], status: ["live", "upcoming"], limit: 20 })
  const candidates =
    trending === null || trending === undefined
      ? trending
      : [...trending.filter((m) => m.status === "live"), ...trending.filter((m) => m.status !== "live")]
  const matchId = useBoardMatchId(candidates)

  const match = useLiveMatch({ matchId: matchId ?? undefined })

  const matchResultMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  const matchResult = matchResultMarkets?.[0]
  const matchResultMovement = useOddsMovement(matchResult)
  const [matchResultSelectedId, setMatchResultSelectedId] = useState<string | undefined>()

  const totalGoalsMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })
  const totalGoals = totalGoalsMarkets ? pickMostBalancedMarket(totalGoalsMarkets) : undefined
  const totalGoalsMovement = useOddsMovement(totalGoals)
  const [totalGoalsSelectedId, setTotalGoalsSelectedId] = useState<string | undefined>()

  const doubleChanceMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
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

  // Odds close once the match ends — same as matchToMatchCardProps, drop
  // them rather than freeze on the last live value.
  const showOdds = match?.status !== "completed"

  // Match Result and Double Chance describe overlapping information
  // about the same result — any selection in one blocks the entire
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
