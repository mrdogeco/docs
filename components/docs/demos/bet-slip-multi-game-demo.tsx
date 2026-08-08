"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { BetSlip, type BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { matchToMatchCardProps } from "@/lib/mrdoge-adapters/match-card"
import { toBetSlipPick } from "@/lib/mrdoge-adapters/bet-slip"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useMatch } from "@/registry/mrdoge-ui/use-match/use-match"
import { useOdds } from "@/registry/mrdoge-ui/use-odds/use-odds"
import { useOddsMovement } from "@/registry/mrdoge-ui/use-odds-movement/use-odds-movement"
import { useMatches } from "@/registry/mrdoge-ui/use-matches/use-matches"
import { MATCH_RESULT_BET_TYPES } from "@/components/docs/demos/use-shared-demo-matches"

const GAME_COUNT = 3

// Resolves the first `count` distinct upcoming matches that have a Match
// Result market posted, checked in parallel.
function useMultiMatchIds(candidates: Match[] | null | undefined, count: number) {
  const [resolvedIds, setResolvedIds] = useState<string[] | null | undefined>(undefined)

  useEffect(() => {
    if (!candidates || candidates.length === 0) return

    let cancelled = false
    Promise.all(
      candidates.map((candidate) =>
        getMrDogeClient()
          .odds.list({ matchId: candidate.id, betTypes: MATCH_RESULT_BET_TYPES })
          .then((markets) => (markets.length > 0 ? candidate.id : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return
      const ids = results.filter((id): id is string => id !== null).slice(0, count)
      setResolvedIds(ids.length > 0 ? ids : null)
    })

    return () => {
      cancelled = true
    }
  }, [candidates, count])

  if (candidates === undefined) return undefined
  if (candidates === null || candidates.length === 0) return null
  return resolvedIds
}

// Fetches one match's own data and reports its current pick up to the
// parent, which owns the combined BetSlip.
function MultiGameSelector({
  matchId,
  onPickChange,
}: {
  matchId: string
  onPickChange: (matchId: string, pick: BetSlipPick | undefined, clear: () => void) => void
}) {
  const match = useMatch({ matchId })
  const markets = useOdds({ matchId, betTypes: MATCH_RESULT_BET_TYPES })
  const market = markets?.[0]
  const movement = useOddsMovement(market)
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const pick = match && market && selectedId ? toBetSlipPick(match, market, selectedId, movement) : undefined

  useEffect(() => {
    onPickChange(matchId, pick, () => setSelectedId(undefined))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the derived pick's own fields should retrigger this; onPickChange closes over a stable setState setter
  }, [matchId, pick?.id, pick?.price, pick?.unavailable, pick?.movement])

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }
  if (match === undefined) {
    return <MatchCard loading oddsLoading oddsPosition="right" className="w-full" />
  }

  return (
    <MatchCard
      {...matchToMatchCardProps(match, market, movement)}
      oddsLoading={market === undefined}
      oddsPosition="right"
      selectedOddsId={selectedId}
      onSelectOdds={setSelectedId}
      className="w-full"
    />
  )
}

export function BetSlipMultiGameDemo() {
  // Bounded to today/tomorrow: "upcoming" alone can include matches
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
  const matchIds = useMultiMatchIds(upcomingMatches, GAME_COUNT)

  const [entries, setEntries] = useState<Record<string, { pick?: BetSlipPick; clear: () => void }>>({})
  const [mode, setMode] = useState<"single" | "parlay">("parlay")
  const [stake, setStake] = useState("")
  const [pickStakes, setPickStakes] = useState<Record<string, string>>({})
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle")

  if (matchIds === null) {
    return <p className="text-sm text-fd-muted-foreground">No upcoming matches to show right now.</p>
  }

  const picks = matchIds
    ? matchIds.map((id) => entries[id]?.pick).filter((pick): pick is BetSlipPick => pick !== undefined)
    : []

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      {matchIds === undefined
        ? Array.from({ length: GAME_COUNT }).map((_, index) => (
            <MatchCard key={index} loading oddsLoading oddsPosition="right" className="w-full" />
          ))
        : matchIds.map((id) => (
            <MultiGameSelector
              key={id}
              matchId={id}
              onPickChange={(pickMatchId, pick, clear) =>
                setEntries((prev) => ({ ...prev, [pickMatchId]: { pick, clear } }))
              }
            />
          ))}
      <BetSlip
        picks={picks}
        onRemovePick={(id) => {
          const entry = Object.values(entries).find((e) => e.pick?.id === id)
          entry?.clear()
          setPickStakes(({ [id]: _removed, ...rest }) => rest)
        }}
        mode={mode}
        onModeChange={setMode}
        stake={stake}
        onStakeChange={setStake}
        pickStakes={pickStakes}
        onPickStakeChange={(id, value) => setPickStakes((prev) => ({ ...prev, [id]: value }))}
        onSubmit={() => {
          // Fake submit: no real endpoint here, just enough to show the states.
          setSubmitState("loading")
          setTimeout(() => {
            setSubmitState("success")
            setTimeout(() => {
              Object.values(entries).forEach((entry) => entry.clear())
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
