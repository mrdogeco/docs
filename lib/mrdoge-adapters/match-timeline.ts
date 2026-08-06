import type { MatchDetail, TimelineEvent } from "@mrdoge/protocol"
import type { MatchTimelineEntry, MatchTimelineProps } from "@/registry/mrdoge-ui/match-timeline/match-timeline"

// Soccer only — classify() and the phase labels below use soccer's own
// event/phase sysnames. Other sports just get zero entries for now.

// Matched by prefix — lower-tier competitions report goals/cards without
// a named player ("GoalWithoutScorer" vs "GoalWithScorer"). "GoalWith"
// specifically, not "GoalKick" (a real, different event).
function classify(type: string): "goal" | "own-goal" | "yellow-card" | "red-card" | "penalty" | null {
  if (type === "OwnGoal") return "own-goal"
  if (type.startsWith("GoalWith")) return "goal"
  if (type.startsWith("YellowCard")) return "yellow-card"
  if (type.startsWith("RedCard")) return "red-card"
  if (type === "PenaltyKick") return "penalty"
  return null
}

function toTimeLabel(event: TimelineEvent): string | undefined {
  return event.captions[0] ? `${event.captions[0]}'` : undefined
}

// clock.phase/minute/display/displayLong only update on backend event
// triggers — confirmed live against an eventless match stuck on "1st
// Half" at 100+ real minutes elapsed. clock.elapsedSeconds is the one
// field that's actually continuous, so it drives the 1st/2nd half split
// below (generous buffer either side of 45 for stoppage). Extra
// time/penalties aren't guessed from it — real observed sysnames per
// mrdoge-odds-api's data/phases.csv: SOCCER_MATCH_EXTRA_FIRST_HALF,
// SOCCER_MATCH_EXTRA_SECOND_HALF, SOCCER_MATCH_PENALTIES.
const SOCCER_PHASE_LABEL: Record<string, string> = {
  SOCCER_MATCH_FIRST_HALF: "1st Half",
  SOCCER_MATCH_SECOND_HALF: "2nd Half",
  SOCCER_MATCH_EXTRA_FIRST_HALF: "Extra Time — 1st Half",
  SOCCER_MATCH_EXTRA_SECOND_HALF: "Extra Time — 2nd Half",
  SOCCER_MATCH_PENALTIES: "Penalties",
}
const FIRST_HALF_ELAPSED_CUTOFF_SECONDS = 50 * 60
const SECOND_HALF_ELAPSED_CEILING_SECONDS = 115 * 60

function phaseLabelFromElapsedSeconds(elapsedSeconds: number | null | undefined): string | undefined {
  if (elapsedSeconds == null) return undefined
  if (elapsedSeconds <= FIRST_HALF_ELAPSED_CUTOFF_SECONDS) return "1st Half"
  if (elapsedSeconds <= SECOND_HALF_ELAPSED_CEILING_SECONDS) return "2nd Half"
  return undefined
}

function toLivePhaseLabel(clock: { phase: string | null; display: string | null; displayLong: string | null; elapsedSeconds?: number | null } | null | undefined): string {
  return (
    phaseLabelFromElapsedSeconds(clock?.elapsedSeconds) ??
    SOCCER_PHASE_LABEL[clock?.phase ?? ""] ??
    clock?.displayLong ??
    clock?.display ??
    "Live"
  )
}

function isLivePastFirstHalf(elapsedSeconds: number | null | undefined): boolean {
  return elapsedSeconds != null && elapsedSeconds > FIRST_HALF_ELAPSED_CUTOFF_SECONDS
}

// Per-event minute, parsed from captions[0] ("41", "45+3") — a fixed
// value recorded at the time, not subject to the clock staleness above.
function parseEventMinute(caption: string | undefined): number | null {
  if (!caption) return null
  const parsed = parseInt(caption, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function isEventPastFirstHalf(minute: number | null): boolean {
  return minute != null && minute > 45
}

/**
 * Maps a real `matches.get()`/`matches.subscribe()` response to Match
 * Timeline's props — filtered to goals, cards, penalties, and
 * half/full-time, most-recent-first. If the SDK's shape changes, this
 * fails to compile.
 */
export function matchToMatchTimelineProps(match: MatchDetail): MatchTimelineProps {
  const entries: MatchTimelineEntry[] = []
  let homeScore = 0
  let awayScore = 0
  // Fallback HT score for when no EndOfFirstHalf event arrives.
  let htHomeScore = 0
  let htAwayScore = 0
  let halftimeMarked = false

  for (const event of match.timeline ?? []) {
    const kind = classify(event.type)

    if (kind === "goal" || kind === "own-goal") {
      // An own goal credited to `side` benefits the opposite side's score.
      const scoringSide = kind === "own-goal" ? (event.side === "home" ? "away" : "home") : event.side
      if (scoringSide === "home") homeScore++
      else if (scoringSide === "away") awayScore++
    }

    if (event.type === "EndOfFirstHalf") {
      const [htHome, htAway] = event.captions
      entries.push({
        id: `${entries.length}`,
        side: "match",
        type: "divider",
        description: `HT ${htHome} - ${htAway}`,
      })
      halftimeMarked = true
      continue
    }

    if (!isEventPastFirstHalf(parseEventMinute(event.captions[0]))) {
      htHomeScore = homeScore
      htAwayScore = awayScore
    }

    if (!kind) continue

    const [, team, player] = event.captions
    const base = {
      id: `${entries.length}`,
      time: toTimeLabel(event),
      type: kind,
      side: event.side as "home" | "away",
    }

    if (kind === "goal" || kind === "own-goal") {
      entries.push({ ...base, description: player ?? team, score: { home: homeScore, away: awayScore } })
    } else if (kind === "penalty") {
      entries.push({ ...base, description: team })
    } else {
      entries.push({ ...base, description: player ?? team })
    }
  }

  // Fallback HT marker once the match is clearly past the first half.
  if (
    !halftimeMarked &&
    (isLivePastFirstHalf(match.stats?.clock?.elapsedSeconds) || match.status === "completed")
  ) {
    entries.push({
      id: `${entries.length}`,
      side: "match",
      type: "divider",
      description: `HT ${htHomeScore} - ${htAwayScore}`,
    })
  }

  entries.reverse()

  if (match.status === "live") {
    entries.unshift({
      id: "live",
      side: "match",
      type: "divider",
      live: true,
      description: `${toLivePhaseLabel(match.stats?.clock)} ${match.stats?.homeScore ?? 0} - ${match.stats?.awayScore ?? 0}`,
    })
  } else if (match.status === "completed") {
    entries.unshift({
      id: "ft",
      side: "match",
      type: "divider",
      description: `FT ${match.stats?.homeScore ?? 0} - ${match.stats?.awayScore ?? 0}`,
    })
  }

  return { entries }
}
