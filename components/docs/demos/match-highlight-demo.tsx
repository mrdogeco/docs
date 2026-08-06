"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps, matchesToCompetitionMatches } from "@/lib/mrdoge-adapters/match-highlight"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useMatch } from "@/registry/mrdoge-ui/use-match/use-match"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import {
  useSharedUpcomingMatchId,
  useSharedLiveOrUpcomingMatchId,
} from "@/components/docs/demos/use-shared-demo-matches"
import { FINISHED_MATCH_ID } from "@/components/docs/sample-data"

// Lazily fetches other matches today in the same competition — only once
// the dropdown is actually opened, not eagerly on every render.
function useCompetitionMatches(competitionId: number | undefined, date: string | undefined) {
  const [matches, setMatches] = useState<Match[] | null | undefined>(undefined)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!enabled || !competitionId || !date) return
    let cancelled = false
    getMrDogeClient()
      .matches.list({ competitionIds: [competitionId], date, status: ["upcoming", "live", "completed"], limit: 100 })
      .then((result) => {
        if (!cancelled) setMatches(result.data)
      })
      .catch(() => {
        if (!cancelled) setMatches(null)
      })
    return () => {
      cancelled = true
    }
  }, [enabled, competitionId, date])

  return { matches, open: () => setEnabled(true) }
}

function FinishedHighlight() {
  // A fixed, hand-picked match rather than a resolver — nothing about a
  // completed match changes, so there's no "current" one to resolve.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const matchId = selectedId ?? FINISHED_MATCH_ID
  const match = useMatch({ matchId })
  const { matches: competitionMatches, open } = useCompetitionMatches(
    match?.competition.id,
    match?.startTime.slice(0, 10)
  )

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

  return (
    <div className="w-full max-w-sm">
      {match === undefined ? (
        <MatchHighlight loading />
      ) : (
        <MatchHighlight
          {...matchToMatchHighlightProps(match)}
          competitionMatches={competitionMatches == null ? competitionMatches : matchesToCompetitionMatches(competitionMatches, match.id)}
          onOpenCompetitionMatches={open}
          onSelectCompetitionMatch={setSelectedId}
        />
      )}
    </div>
  )
}

function UpcomingHighlight() {
  const resolvedId = useSharedUpcomingMatchId()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const matchId = selectedId ?? resolvedId
  // One-shot, not live — nothing about an upcoming match changes before kickoff.
  const match = useMatch({ matchId: matchId ?? undefined })
  const { matches: competitionMatches, open } = useCompetitionMatches(
    match?.competition.id,
    match?.startTime.slice(0, 10)
  )

  if (matchId === null || match === null) {
    return <p className="text-sm text-fd-muted-foreground">No upcoming match to show right now.</p>
  }

  return (
    <div className="w-full max-w-sm">
      {match === undefined ? (
        <MatchHighlight loading />
      ) : (
        <MatchHighlight
          {...matchToMatchHighlightProps(match)}
          competitionMatches={competitionMatches == null ? competitionMatches : matchesToCompetitionMatches(competitionMatches, match.id)}
          onOpenCompetitionMatches={open}
          onSelectCompetitionMatch={setSelectedId}
        />
      )}
    </div>
  )
}

function LiveHighlight() {
  // Prefers a genuinely live match; falls back to the shared upcoming
  // match if nothing's live right now (e.g. quiet hours) rather than
  // showing a blank state.
  const resolvedId = useSharedLiveOrUpcomingMatchId()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const matchId = selectedId ?? resolvedId
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const { matches: competitionMatches, open } = useCompetitionMatches(
    match?.competition.id,
    match?.startTime.slice(0, 10)
  )

  if (matchId === null || match === null) {
    return <p className="text-sm text-fd-muted-foreground">No match to show right now.</p>
  }

  return (
    <div className="w-full max-w-sm">
      {match === undefined ? (
        <MatchHighlight loading />
      ) : (
        <MatchHighlight
          {...matchToMatchHighlightProps(match)}
          competitionMatches={competitionMatches == null ? competitionMatches : matchesToCompetitionMatches(competitionMatches, match.id)}
          onOpenCompetitionMatches={open}
          onSelectCompetitionMatch={setSelectedId}
        />
      )}
    </div>
  )
}

export function MatchHighlightDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <FinishedHighlight />
      <UpcomingHighlight />
      <LiveHighlight />
    </div>
  )
}
