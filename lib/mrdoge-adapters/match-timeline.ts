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

// clock.phase/display/displayLong only update on backend event triggers
// and can go stale. StartOfSecondHalf (tracked below) is the reliable
// "2nd half started" signal; elapsedSeconds is only a last-resort
// fallback for matches with no events to check at all.
const SOCCER_PHASE_LABEL: Record<string, string> = {
  SOCCER_MATCH_FIRST_HALF: "1st Half",
  SOCCER_MATCH_SECOND_HALF: "2nd Half",
  SOCCER_MATCH_EXTRA_FIRST_HALF: "Extra Time — 1st Half",
  SOCCER_MATCH_EXTRA_SECOND_HALF: "Extra Time — 2nd Half",
  SOCCER_MATCH_PENALTIES: "Penalties",
}
// Only reached when there's no StartOfSecondHalf event to trust —
// deliberately wide, since real 1st-half stoppage rarely approaches it.
const FIRST_HALF_ELAPSED_CUTOFF_SECONDS = 70 * 60
const SECOND_HALF_ELAPSED_CEILING_SECONDS = 115 * 60

function phaseLabelFromElapsedSeconds(elapsedSeconds: number | null | undefined): string | undefined {
  if (elapsedSeconds == null) return undefined
  if (elapsedSeconds <= FIRST_HALF_ELAPSED_CUTOFF_SECONDS) return "1st Half"
  if (elapsedSeconds <= SECOND_HALF_ELAPSED_CEILING_SECONDS) return "2nd Half"
  return undefined
}

type ClockLike = {
  phase: string | null
  state?: string | null
  display: string | null
  displayLong: string | null
  elapsedSeconds?: number | null
} | null | undefined

function toLivePhaseLabel(clock: ClockLike, secondHalfStarted: boolean): string {
  // elapsedSeconds is null during intermission — trust the backend's
  // own "Half Time" label instead of guessing from minutes.
  if (clock?.state === "intermission") return clock.displayLong ?? clock.display ?? "Half Time"

  if (secondHalfStarted) {
    // Confirmed via a real event — elapsed time only decides whether
    // we've since moved into extra time.
    if (clock?.elapsedSeconds != null && clock.elapsedSeconds > SECOND_HALF_ELAPSED_CEILING_SECONDS) {
      return SOCCER_PHASE_LABEL[clock?.phase ?? ""] ?? clock?.displayLong ?? clock?.display ?? "2nd Half"
    }
    return "2nd Half"
  }

  return (
    phaseLabelFromElapsedSeconds(clock?.elapsedSeconds) ??
    SOCCER_PHASE_LABEL[clock?.phase ?? ""] ??
    clock?.displayLong ??
    clock?.display ??
    "Live"
  )
}

function isLivePastFirstHalf(clock: ClockLike, secondHalfStarted: boolean): boolean {
  if (clock?.state === "intermission" || secondHalfStarted) return true
  return clock?.elapsedSeconds != null && clock.elapsedSeconds > FIRST_HALF_ELAPSED_CUTOFF_SECONDS
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
  let secondHalfStarted = false

  for (const event of match.timeline ?? []) {
    const kind = classify(event.type)

    if (event.type === "StartOfSecondHalf") secondHalfStarted = true

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
    (isLivePastFirstHalf(match.stats?.clock, secondHalfStarted) || match.status === "completed")
  ) {
    entries.push({
      id: `${entries.length}`,
      side: "match",
      type: "divider",
      description: `HT ${htHomeScore} - ${htAwayScore}`,
    })
  }

  entries.reverse()

  // During intermission, the HT divider above already says exactly this —
  // a second "Half Time" banner here would just repeat it.
  if (match.status === "live" && match.stats?.clock?.state !== "intermission") {
    entries.unshift({
      id: "live",
      side: "match",
      type: "divider",
      live: true,
      description: `${toLivePhaseLabel(match.stats?.clock, secondHalfStarted)} ${match.stats?.homeScore ?? 0} - ${match.stats?.awayScore ?? 0}`,
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
