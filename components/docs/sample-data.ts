import type { Market, TimelineEvent, TeamForm, Recommendation, Region, Competition } from "@mrdoge/protocol"
import type { OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import type { MatchTimelineEntry } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import type { BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import type { FormResult } from "@/registry/mrdoge-ui/team-form-indicator/team-form-indicator"

// A specific, curated real match — not "whatever's live right now" — so the
// live demo pages (see registry/mrdoge-ui/use-live-match/use-live-match.ts)
// are predictable.
export const DEMO_MATCH_ID = "45293428"

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

export const sampleTimelineEvents = [
  { type: "GoalWithScorer", side: "home", phase: "1H", captions: ["Silva"], timeOffsetSeconds: 720 },
  { type: "YellowCard", side: "away", phase: "1H", captions: ["Reyes"], timeOffsetSeconds: 2040 },
  { type: "Substitution", side: "home", phase: "2H", captions: ["Silva", "Costa"], timeOffsetSeconds: 3480 },
  { type: "GoalWithScorer", side: "away", phase: "2H", captions: ["Reyes"], timeOffsetSeconds: 4620 },
] satisfies TimelineEvent[]

export const samplePicks: BetSlipPick[] = [
  { id: "1", eventLabel: "Palmeiras vs Flamengo", market: "Match Winner", selection: "Palmeiras", price: 1.85 },
  { id: "2", eventLabel: "Corinthians vs Santos", market: "Total Goals", selection: "Over 2.5", price: 2.1 },
]

export const sampleForm: FormResult[] = ["L", "D", "W", "W", "W"]

// The real API returns both summary.form and matches most-recent-first —
// kept in that order here to match; teamFormToProps() reverses both for
// display (see lib/sdk-adapters/team-form-indicator.ts).
export const sampleTeamForm = {
  team: { id: 1, name: "Palmeiras", sport: { id: 1, name: "Soccer" } },
  summary: {
    wins: 3,
    draws: 1,
    losses: 1,
    goalsFor: 9,
    goalsAgainst: 5,
    sampleSize: 5,
    form: ["W", "W", "W", "D", "L"],
    streak: "W3",
  },
  matches: [
    {
      matchId: "form-match-5",
      startedAt: "2026-07-30T21:00:00Z",
      competition: { id: 1, name: "Brasileirão Série A", region: "Brazil" },
      homeTeam: { id: 1, name: "Palmeiras" },
      awayTeam: { id: 2, name: "Flamengo" },
      opponent: { id: 2, name: "Flamengo" },
      isHome: true,
      score: { for: 2, against: 1, home: 2, away: 1 },
      result: "win",
    },
    {
      matchId: "form-match-4",
      startedAt: "2026-07-22T21:00:00Z",
      competition: { id: 1, name: "Brasileirão Série A", region: "Brazil" },
      homeTeam: { id: 6, name: "Botafogo" },
      awayTeam: { id: 1, name: "Palmeiras" },
      opponent: { id: 6, name: "Botafogo" },
      isHome: false,
      score: { for: 2, against: 0, home: 0, away: 2 },
      result: "win",
    },
    {
      matchId: "form-match-3",
      startedAt: "2026-07-15T21:00:00Z",
      competition: { id: 1, name: "Brasileirão Série A", region: "Brazil" },
      homeTeam: { id: 1, name: "Palmeiras" },
      awayTeam: { id: 5, name: "Fluminense" },
      opponent: { id: 5, name: "Fluminense" },
      isHome: true,
      score: { for: 3, against: 1, home: 3, away: 1 },
      result: "win",
    },
    {
      matchId: "form-match-2",
      startedAt: "2026-07-08T21:00:00Z",
      competition: { id: 1, name: "Brasileirão Série A", region: "Brazil" },
      homeTeam: { id: 4, name: "Grêmio" },
      awayTeam: { id: 1, name: "Palmeiras" },
      opponent: { id: 4, name: "Grêmio" },
      isHome: false,
      score: { for: 1, against: 1, home: 1, away: 1 },
      result: "draw",
    },
    {
      matchId: "form-match-1",
      startedAt: "2026-07-01T21:00:00Z",
      competition: { id: 1, name: "Brasileirão Série A", region: "Brazil" },
      homeTeam: { id: 1, name: "Palmeiras" },
      awayTeam: { id: 3, name: "São Paulo" },
      opponent: { id: 3, name: "São Paulo" },
      isHome: true,
      score: { for: 1, against: 2, home: 1, away: 2 },
      result: "loss",
    },
  ],
} satisfies TeamForm

export const sampleRecommendation = {
  id: "rec-1",
  matchId: "match-2",
  match: {
    id: "match-2",
    startTime: "2026-07-31T21:00:00Z",
    status: "upcoming",
    homeTeam: { id: 1, name: "Palmeiras" },
    awayTeam: { id: 7, name: "Corinthians" },
    sport: { id: 1, name: "Soccer" },
    competition: { id: 1, name: "Brasileirão Série A" },
    region: { id: 1, name: "Brazil" },
  },
  marketId: "market-2",
  betItemId: "home",
  outcome: "1",
  odds: 1.95,
  point: null,
  confidence: "High",
  edgePercentage: 0.084,
  kellyFraction: 0.032,
  rationale: [
    "Palmeiras unbeaten in 8 home matches this season.",
    "Corinthians missing two starting defenders to injury.",
  ],
  riskFactors: ["Palmeiras rotating squad ahead of a continental fixture."],
  settled: false,
  result: null,
  createdAt: "2026-07-30T12:00:00Z",
} satisfies Recommendation

export const sampleRegions = [
  { id: 1, name: "Brazil", eventCount: 12 },
  { id: 2, name: "England", eventCount: 8 },
  { id: 3, name: "Spain", eventCount: 5 },
] satisfies Region[]

export const sampleCompetitions = [
  { id: 1, name: "Brasileirão Série A", regionId: 1, eventCount: 8 },
  { id: 2, name: "Brasileirão Série B", regionId: 1, eventCount: 4 },
  { id: 3, name: "Premier League", regionId: 2, eventCount: 6 },
  { id: 4, name: "Championship", regionId: 2, eventCount: 2 },
  { id: 5, name: "La Liga", regionId: 3, eventCount: 5 },
] satisfies Competition[]
