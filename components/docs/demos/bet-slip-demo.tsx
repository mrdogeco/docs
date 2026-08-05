"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { OddsSelectorSkeleton, OddsLinesSkeleton } from "@/registry/mrdoge-ui/odds-selector/odds-selector-skeleton"
import { BetSlip } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { matchToMatchCardProps, toOddsOptions } from "@/lib/mrdoge-adapters/match-card"
import { toOddsLines } from "@/lib/mrdoge-adapters/odds-lines"
import { toBetSlipPick } from "@/lib/mrdoge-adapters/bet-slip"
import { toConflictCandidates, getConflictingIds } from "@/lib/mrdoge-adapters/conflicts"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useMatch } from "@/registry/mrdoge-ui/use-match/use-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import { useMatches } from "@/registry/mrdoge-ui/use-matches/use-matches"

const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]
const DOUBLE_CHANCE_BET_TYPES = ["SOCCER_DOUBLE_CHANCE"]
const TOTAL_GOALS_BET_TYPES = ["SOCCER_UNDER_OVER", "SOCCER_UNDER_OVER_PRELIVE"]

// Resolves the upcoming candidate with both other markets posted and the
// most Total Goals thresholds available, checked in parallel — prefers a
// richer board over a fixed minimum, so this doesn't fall back to "no
// match" on days when few matches have many thresholds posted yet.
function useBetSlipMatchId(candidates: Match[] | null | undefined) {
  const [resolvedId, setResolvedId] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    if (!candidates || candidates.length === 0) return

    let cancelled = false
    Promise.all(
      candidates.map((candidate) =>
        Promise.all([
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: MATCH_RESULT_BET_TYPES }),
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: DOUBLE_CHANCE_BET_TYPES }),
          getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: TOTAL_GOALS_BET_TYPES }),
        ])
          .then(([matchResult, doubleChance, totalGoals]) =>
            matchResult.length > 0 && doubleChance.length > 0 && totalGoals.length > 0
              ? { id: candidate.id, lineCount: totalGoals.length }
              : null
          )
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return
      const qualifying = results.filter((r): r is { id: string; lineCount: number } => r !== null)
      const best = qualifying.length > 0 ? qualifying.reduce((a, b) => (b.lineCount > a.lineCount ? b : a)) : null
      setResolvedId(best?.id ?? null)
    })

    return () => {
      cancelled = true
    }
  }, [candidates])

  if (candidates === undefined) return undefined
  if (candidates === null || candidates.length === 0) return null
  return resolvedId
}

export function BetSlipDemo() {
  // Bounded to today/tomorrow — "upcoming" alone can include matches
  // stuck on that status well past their real kickoff.
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const upcomingMatches = useMatches({
    sports: ["soccer"],
    status: ["upcoming"],
    startDate: today.toISOString().slice(0, 10),
    endDate: tomorrow.toISOString().slice(0, 10),
    limit: 20,
  })
  const matchId = useBetSlipMatchId(upcomingMatches)

  const match = useMatch({ matchId: matchId ?? undefined })

  const matchResultMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  const matchResult = matchResultMarkets?.[0]
  const matchResultMovement = useOddsMovement(matchResult)
  const [matchResultSelectedId, setMatchResultSelectedId] = useState<string | undefined>()

  const doubleChanceMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
  const doubleChance = doubleChanceMarkets?.[0]
  const doubleChanceMovement = useOddsMovement(doubleChance)
  const [doubleChanceSelectedId, setDoubleChanceSelectedId] = useState<string | undefined>()

  const totalGoalsMarkets = useLiveOdds({ matchId: matchId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })
  const totalGoalsLines = totalGoalsMarkets ? toOddsLines(totalGoalsMarkets) : undefined
  const [totalGoalsSelectedIds, setTotalGoalsSelectedIds] = useState<string[]>([])

  const [stake, setStake] = useState("")
  const [pickStakes, setPickStakes] = useState<Record<string, string>>({})
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Picks are derived directly from each panel's current selection rather
  // than tracked separately, so removing one here clears the matching
  // selection above.
  const picks =
    match && matchId
      ? [
          matchResult && matchResultSelectedId
            ? toBetSlipPick(match, matchResult, matchResultSelectedId, matchResultMovement)
            : undefined,
          doubleChance && doubleChanceSelectedId
            ? toBetSlipPick(match, doubleChance, doubleChanceSelectedId, doubleChanceMovement)
            : undefined,
          ...totalGoalsSelectedIds.map((lineId) => {
            const market = totalGoalsMarkets?.find((m) => m.lines.some((line) => line.id === lineId))
            return market ? toBetSlipPick(match, market, lineId) : undefined
          }),
        ].filter((pick): pick is NonNullable<typeof pick> => pick !== undefined)
      : []

  // Adding a 2nd pick defaults to parlay; dropping below 2 forces back to
  // single. Freely switchable in between. BetSlip holds no state of its
  // own, so this lives here. useLayoutEffect (not useEffect) so this
  // resolves before the browser paints — otherwise the new pick would
  // briefly render in single mode for one frame before flipping to
  // parlay.
  const [mode, setMode] = useState<"single" | "parlay">("single")
  const prevPicksLength = useRef(picks.length)
  useLayoutEffect(() => {
    const prev = prevPicksLength.current
    const curr = picks.length
    if (prev < 2 && curr >= 2) setMode("parlay")
    else if (curr < 2 && mode === "parlay") setMode("single")
    prevPicksLength.current = curr
  }, [picks.length, mode])

  if (
    matchId === null ||
    match === null ||
    matchResultMarkets === null ||
    doubleChanceMarkets === null ||
    totalGoalsMarkets === null
  ) {
    return <p className="text-sm text-fd-muted-foreground">No upcoming match to show right now.</p>
  }

  // Any Match Result selection blocks the entire Double Chance market;
  // Total Goals lines can also conflict with each other across
  // thresholds. One shared candidate pool covers all three panels.
  const conflictCandidates =
    matchId && matchResultMarkets && doubleChanceMarkets && totalGoalsMarkets
      ? toConflictCandidates(matchId, [...matchResultMarkets, ...doubleChanceMarkets, ...totalGoalsMarkets])
      : []
  const matchResultDisabledIds = Array.from(
    getConflictingIds(doubleChanceSelectedId ? [doubleChanceSelectedId] : [], conflictCandidates)
  )
  const doubleChanceDisabledIds = Array.from(
    getConflictingIds(matchResultSelectedId ? [matchResultSelectedId] : [], conflictCandidates)
  )
  const totalGoalsDisabledIds = Array.from(getConflictingIds(totalGoalsSelectedIds, conflictCandidates))

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {match === undefined ? <MatchCard loading /> : <MatchCard {...matchToMatchCardProps(match)} />}
      {matchResult === undefined ? (
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
      )}
      {doubleChance === undefined ? (
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
          disabledIds={totalGoalsDisabledIds}
          enableSliderView
          collapsible
          className="w-full"
        />
      )}
      <BetSlip
        picks={picks}
        onRemovePick={(id) => {
          if (id === matchResultSelectedId) setMatchResultSelectedId(undefined)
          if (id === doubleChanceSelectedId) setDoubleChanceSelectedId(undefined)
          setTotalGoalsSelectedIds((ids) => ids.filter((i) => i !== id))
          setPickStakes(({ [id]: _removed, ...rest }) => rest)
        }}
        mode={mode}
        onModeChange={setMode}
        stake={stake}
        onStakeChange={setStake}
        pickStakes={pickStakes}
        onPickStakeChange={(id, value) => setPickStakes((prev) => ({ ...prev, [id]: value }))}
        onSubmit={() => {
          // Fake submit — no real endpoint here, just enough to show the states.
          setSubmitState("loading")
          setTimeout(() => {
            setSubmitState("success")
            setTimeout(() => {
              setMatchResultSelectedId(undefined)
              setDoubleChanceSelectedId(undefined)
              setTotalGoalsSelectedIds([])
              setPickStakes({})
              setStake("")
              setSubmitState("idle")
            }, 1500)
          }, 1000)
        }}
        submitState={submitState}
        className="w-full"
      />
    </div>
  )
}
