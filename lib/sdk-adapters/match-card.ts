import type { MatchDetail, Market } from "@mrdoge/protocol"
import type { MatchCardDataProps, MatchCardOdds } from "@/registry/mrdoge-ui/match-card/match-card"
import type { LiveIndicatorStatus } from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import type { OddsOption, OddsMovement } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

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

// Outcome order (1/X/2 left-to-right, Over before Under, ...) is decided
// server-side now — the SDK gateway runs every market's betItems through
// the same ordering rules before it ever reaches here. See
// `orderBetItems` in mrdoge-odds-api's sdk/mappers.ts.
//
// Exported so odds-board.ts can reuse it per market instead of
// re-implementing the same BetItem -> OddsOption mapping. Odds Board has
// room for real team names; Match Card is a lot narrower, so it asks for
// "code" instead (1/X/2) — short and never needs truncating.
export function toOddsOptions(
  market?: Market,
  {
    labelFrom = "caption",
    movementById,
  }: {
    labelFrom?: "caption" | "code"
    /** From useOddsMovement(market) — id -> "up" | "down" since the previous snapshot. */
    movementById?: Record<string, OddsMovement>
  } = {}
): OddsOption[] {
  if (!market) return []
  return market.betItems.map((item) => ({
    id: item.id,
    label: labelFrom === "code" ? item.code : (item.caption ?? item.code),
    price: item.price.toFixed(2),
    suspended: !item.isAvailable,
    movement: movementById?.[item.id],
  }))
}

// Market.betType is a raw sysname on the wire (e.g. "SOCCER_MATCH_RESULT"),
// not a display label — a real name lookup table is out of scope here, so
// this falls back to a light cleanup (underscores to spaces, title case)
// rather than the raw sysname or a fabricated name. Exported so
// odds-board.ts can reuse it instead of re-implementing the same mapping.
export function toMarketLabel(betType: string): string {
  return betType
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

function toMatchCardOdds(
  market?: Market,
  movementById?: Record<string, OddsMovement>
): MatchCardOdds | undefined {
  if (!market) return undefined
  return {
    market: toMarketLabel(market.betType),
    options: toOddsOptions(market, { labelFrom: "code", movementById }),
  }
}

// Public, unauthenticated, cached CDN — not part of the Team shape itself.
// See /docs/reference/images.
function teamLogoUrl(teamId: number) {
  return `https://api.mrdoge.co/images/teams/${teamId}.png`
}

/**
 * Maps a real `matches.get()` / `matches.subscribe()` response (plus an
 * optional market from `odds.list()`) to MatchCard's props. If the SDK's
 * shape changes, this fails to compile — that's the point. Returns
 * MatchCardDataProps (not the full MatchCardProps union) since this
 * always has real data to show; callers render `<MatchCard loading />`
 * separately while that data is still in flight.
 *
 * Whether the odds slot should show a skeleton while `market` is still
 * loading isn't this function's call — a caller with no odds feature at
 * all also has `market === undefined`, and this function can't tell the
 * difference. Pass `oddsLoading` as a sibling prop at the call site
 * instead, e.g. `oddsLoading={market === undefined}`, only when you're
 * actually using useLiveOdds.
 *
 * `movementById` is optional — pass `useOddsMovement(market)`'s result to
 * show up/down indicators as odds change; omit it and options just render
 * without one.
 */
export function matchToMatchCardProps(
  match: MatchDetail,
  market?: Market,
  movementById?: Record<string, OddsMovement>,
): MatchCardDataProps {
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
    odds: toMatchCardOdds(market, movementById),
  }
}
