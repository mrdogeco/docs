import type { OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import type { MatchTimelineEntry } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import type { BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import type { FormResult } from "@/registry/mrdoge-ui/team-form-indicator/team-form-indicator"

export const sampleOdds: OddsOption[] = [
  { id: "home", label: "1", price: "1.85", movement: "up" },
  { id: "draw", label: "X", price: "3.40", movement: "flat" },
  { id: "away", label: "2", price: "4.20", movement: "down", suspended: true },
]

export const sampleTimeline: MatchTimelineEntry[] = [
  { id: "1", minute: 12, type: "goal", team: "home", description: "Goal — Silva" },
  { id: "2", minute: 34, type: "yellow-card", team: "away", description: "Yellow card — Reyes" },
  { id: "3", minute: 58, type: "substitution", team: "home", description: "Silva off, Costa on" },
  { id: "4", minute: 77, type: "goal", team: "away", description: "Goal — Reyes" },
]

export const samplePicks: BetSlipPick[] = [
  { id: "1", eventLabel: "Palmeiras vs Flamengo", market: "Match Winner", selection: "Palmeiras", price: 1.85 },
  { id: "2", eventLabel: "Corinthians vs Santos", market: "Total Goals", selection: "Over 2.5", price: 2.1 },
]

export const sampleForm: FormResult[] = ["L", "D", "W", "W", "W"]
