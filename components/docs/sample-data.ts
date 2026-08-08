import type { Market } from "@mrdoge/protocol"
import type { OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import type { MatchTimelineEntry } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import type { BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"

// A specific, curated real match — not "whatever's live right now" — so the
// live demo pages (see registry/mrdoge-ui/use-live-match/use-live-match.ts)
// are predictable.
export const DEMO_MATCH_ID = "45293428"

// 2026 World Cup Final (Spain 1-0 Argentina, after extra time) — a
// completed match with a full stats/timeline history, for Match
// Highlight's "completed" example.
export const FINISHED_MATCH_ID = "47170270"

// Curated set of real, completed matches for build-time SSG showcases
// (mrdoge.co's homepage components teaser) — fetched via
// lib/mrdoge-server.ts's fetchShowcaseMatches. FINISHED_MATCH_ID leads the
// list since it doubles as the single-match demo used elsewhere.
export const SHOWCASE_MATCH_IDS = [FINISHED_MATCH_ID, "47170287", "46934657"]

// Typed against the real SDK response shape (satisfies Market[]/TimelineEvent[]/etc),
// so a schema change in @mrdoge/protocol shows up here as a build failure
// instead of a silent inaccuracy. Content is still hand-picked for a good
// demo — only the shape is compiler-verified.
export const sampleMarkets = [
  {
    id: "market-1",
    betType: "SOCCER_MATCH_RESULT",
    displayName: "Match Result",
    lines: [
      { id: "home", code: "1", caption: null, price: 1.85, isAvailable: true },
      { id: "draw", code: "X", caption: null, price: 3.4, isAvailable: true },
      { id: "away", code: "2", caption: null, price: 4.2, isAvailable: false },
    ],
  },
  {
    id: "market-2",
    betType: "SOCCER_UNDER_OVER",
    displayName: "Over/Under 2.5",
    lines: [
      { id: "over", code: "O2.5", caption: "Over 2.5", price: 1.95, isAvailable: true },
      { id: "under", code: "U2.5", caption: "Under 2.5", price: 1.85, isAvailable: true },
    ],
  },
  {
    id: "market-3",
    betType: "SOCCER_BOTH_TEAMS_TO_SCORE",
    displayName: "Both Teams to Score",
    lines: [
      { id: "yes", code: "GG", caption: "Yes", price: 1.72, isAvailable: true },
      { id: "no", code: "NG", caption: "No", price: 2.05, isAvailable: true },
    ],
  },
] satisfies Market[]

export const sampleOdds: OddsOption[] = [
  { id: "home", label: "Palmeiras", price: "1.85", movement: "up" },
  { id: "draw", label: "Draw", price: "3.40", movement: "flat" },
  { id: "away", label: "Flamengo", price: "4.20", movement: "down", suspended: true },
]

export const sampleTimeline: MatchTimelineEntry[] = [
  { id: "1", time: "12'", type: "goal", side: "home", description: "Goal — Silva" },
  { id: "2", time: "34'", type: "yellow-card", side: "away", description: "Yellow card — Reyes" },
  { id: "3", time: "58'", type: "substitution", side: "home", description: "Silva off, Costa on" },
  { id: "4", time: "77'", type: "goal", side: "away", description: "Goal — Reyes" },
]

export const samplePicks: BetSlipPick[] = [
  { id: "1", eventLabel: "Palmeiras vs Flamengo", market: "Match Winner", selection: "Palmeiras", price: 1.85 },
  { id: "2", eventLabel: "Corinthians vs Santos", market: "Total Goals", selection: "Over 2.5", price: 2.1 },
]
