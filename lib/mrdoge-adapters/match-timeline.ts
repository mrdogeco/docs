import type { MatchDetail, TimelineEvent } from "@mrdoge/protocol"
import type { MatchTimelineEntry, MatchTimelineProps } from "@/registry/mrdoge-ui/match-timeline/match-timeline"

// Only the event types a match center typically surfaces — goals, cards,
// penalties, plus half-time (full-time is synthesized separately from
// match.status/stats below, not from a timeline event, since there's no
// single event type that reliably marks "the match is truly over" once
// extra time is possible). Fouls, tackles, throw-ins, corners, goal
// kicks, offsides, and shots are real events too but too noisy for this
// view — they're still in `match.timeline` if you want them.
//
// Matched by prefix, not exact string — lower-tier competitions report
// goals/cards without a named player (e.g. "GoalWithoutScorer",
// "YellowCardWithoutPlayer" instead of "GoalWithScorer"/
// "YellowCardWithPlayer"), same event, just less detail. An exact-match
// set silently dropped those matches' goals entirely, including from the
// running score below. captions still degrades correctly either way —
// no player name in captions[2] just falls back to the team name.
//
// Substitution is deliberately not included — no live match sampled
// while building this had any substitution events, so the caption order
// for on/off couldn't be confirmed against real data.
function classify(type: string): "goal" | "own-goal" | "yellow-card" | "red-card" | "penalty" | null {
  if (type === "OwnGoal") return "own-goal"
  if (type.startsWith("Goal")) return "goal"
  if (type.startsWith("YellowCard")) return "yellow-card"
  if (type.startsWith("RedCard")) return "red-card"
  if (type === "PenaltyKick") return "penalty"
  return null
}

// captions[0] is already a pre-formatted minute string ("41", "90+3",
// "106") for every event type this adapter keeps — using it directly
// (rather than deriving from timeOffsetSeconds) is what correctly
// preserves stoppage-time notation.
function toTimeLabel(event: TimelineEvent): string | undefined {
  return event.captions[0] ? `${event.captions[0]}'` : undefined
}

// clock.displayLong/display are just the raw running minute during open
// play ("64'") — there's no "2nd Half"-style text in either field until
// the next phase transition (HT, FT, ...). clock.phase is the only field
// that reliably says which phase you're in throughout, so the live
// banner derives its label from that instead. Extra-time phase codes are
// inferred from the confirmed "…_SECOND_HALF" naming, not directly
// observed — falls back to the raw clock text for anything unmapped.
const SOCCER_PHASE_LABEL: Record<string, string> = {
  SOCCER_MATCH_FIRST_HALF: "1st Half",
  SOCCER_MATCH_SECOND_HALF: "2nd Half",
  SOCCER_MATCH_EXTRA_FIRST_HALF: "Extra Time — 1st Half",
  SOCCER_MATCH_EXTRA_SECOND_HALF: "Extra Time — 2nd Half",
}

function toLivePhaseLabel(clock: { phase: string | null; display: string | null; displayLong: string | null } | null | undefined): string {
  return SOCCER_PHASE_LABEL[clock?.phase ?? ""] ?? clock?.displayLong ?? clock?.display ?? "Live"
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
      continue
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
