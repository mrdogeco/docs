import type { MatchDetail, Market } from "@mrdoge/protocol"
import type { MatchCardProps } from "@/registry/mrdoge-ui/match-card/match-card"
import type { LiveIndicatorStatus } from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import type { OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

// match.status (upcoming/live/completed) is the authoritative field, always
// kept fresh by the server. Clock.state is finer (adds paused/intermission/
// interrupted) but comes from the live-stats feed, which can stop updating
// once a match ends — e.g. frozen on "live" at "90+5'" instead of ever
// transitioning to "finished". So match.status decides the coarse bucket
// first; clock.state only refines *within* "live".
function toLiveIndicatorStatus(match: MatchDetail): LiveIndicatorStatus {
  if (match.status === "upcoming") return "scheduled"
  if (match.status === "completed") return "finished"
  return match.stats?.clock?.state ?? "live"
}

// Exported so odds-board.ts can reuse it per market instead of
// re-implementing the same BetItem -> OddsOption mapping.
export function toOddsOptions(market?: Market): OddsOption[] {
  if (!market) return []
  return market.betItems.map((item) => ({
    id: item.id,
    label: item.caption ?? item.code,
    price: item.price.toFixed(2),
    suspended: !item.isAvailable,
  }))
}

// Public, unauthenticated, cached CDN — not part of the Team shape itself.
// See /docs/reference/images.
function teamLogoUrl(teamId: number) {
  return `https://api.mrdoge.co/images/teams/${teamId}.png`
}

/**
 * Maps a real `matches.get()` / `matches.subscribe()` response (plus an
 * optional market from `odds.list()`) to MatchCard's props. If the SDK's
 * shape changes, this fails to compile — that's the point.
 */
export function matchToMatchCardProps(
  match: MatchDetail,
  market?: Market,
): MatchCardProps {
  // Red cards are soccer-specific — MatchStats is a discriminated union
  // per sport, so narrow before reading homeRedCards/awayRedCards.
  const stats = match.stats?.sport === "soccer" ? match.stats : undefined

  return {
    status: toLiveIndicatorStatus(match),
    kickoff: match.startTime,
    // Only meaningful while the match is actually in progress — once
    // completed, the clock display is a frozen artifact (e.g. "90+5'"),
    // not a real "FT" transition, so drop it and let LiveIndicator show
    // its own "FT" label instead.
    elapsed: match.status === "live" ? (match.stats?.clock?.display ?? undefined) : undefined,
    home: {
      name: match.homeTeam.name,
      logoUrl: teamLogoUrl(match.homeTeam.id),
      redCards: stats?.homeRedCards,
    },
    away: {
      name: match.awayTeam.name,
      logoUrl: teamLogoUrl(match.awayTeam.id),
      redCards: stats?.awayRedCards,
    },
    homeScore: match.stats?.homeScore,
    awayScore: match.stats?.awayScore,
    odds: toOddsOptions(market),
  }
}
