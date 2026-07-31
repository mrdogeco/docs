import type { MatchDetail, Market } from "@mrdoge/protocol"
import type { EventCardProps } from "@/registry/mrdoge-ui/event-card/event-card"
import type { LiveIndicatorStatus } from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import type { OddsOption } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

// Clock.state (on match.stats) uses the same 6-value vocabulary as
// LiveIndicatorStatus, so it passes straight through when present. Falls
// back to the coarser match.status (upcoming/live/completed) for matches
// with no stats yet — e.g. far-future fixtures.
function toLiveIndicatorStatus(match: MatchDetail): LiveIndicatorStatus {
  const clockState = match.stats?.clock?.state
  if (clockState) return clockState

  switch (match.status) {
    case "upcoming":
      return "scheduled"
    case "live":
      return "live"
    case "completed":
      return "finished"
  }
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

/**
 * Maps a real `matches.get()` / `matches.subscribe()` response (plus an
 * optional market from `odds.list()`) to EventCard's props. If the SDK's
 * shape changes, this fails to compile — that's the point.
 */
export function matchToEventCardProps(
  match: MatchDetail,
  market?: Market,
): EventCardProps {
  return {
    competition: match.competition.name,
    status: toLiveIndicatorStatus(match),
    kickoff: match.startTime,
    elapsed: match.stats?.clock?.display ?? undefined,
    home: { name: match.homeTeam.name },
    away: { name: match.awayTeam.name },
    homeScore: match.stats?.homeScore,
    awayScore: match.stats?.awayScore,
    odds: toOddsOptions(market),
  }
}
