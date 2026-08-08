import type { MatchDetail, Market } from "@mrdoge/protocol"
import type {
  MatchCardDataProps,
  MatchCardOdds,
  MatchCardStatus,
} from "@/registry/mrdoge-ui/match-card/match-card"
import type { OddsOption, OddsMovement } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

// match.status (upcoming/live/completed) is the authoritative field, always
// kept fresh by the server. Clock.state is finer (adds paused/intermission/
// interrupted) but comes from the live-stats feed, which can stop updating
// once a match ends — e.g. frozen on "live" at "90+5'" instead of ever
// transitioning to "finished". So match.status decides the coarse bucket
// first; clock.state only refines *within* "live".
function toMatchCardStatus(match: MatchDetail): MatchCardStatus {
  if (match.status === "upcoming") return "scheduled"
  if (match.status === "completed") return "finished"
  return match.stats?.clock?.state ?? "live"
}

// Outcome order (1/X/2 left-to-right, Over before Under, ...) is decided
// server-side — the SDK gateway orders every market's lines before they
// ever reach here, so there's nothing to sort in this adapter.
//
// Odds Selector's own examples have room for real team names; Match
// Card is a lot narrower, so it asks for "code" instead (1/X/2) — short
// and never needs truncating.
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
  return market.lines.map((line) => ({
    id: line.id,
    label: labelFrom === "code" ? line.code : (line.caption ?? line.code),
    price: line.price.toFixed(2),
    suspended: !line.isAvailable,
    movement: movementById?.[line.id],
  }))
}

function toMatchCardOdds(
  market?: Market,
  movementById?: Record<string, OddsMovement>
): MatchCardOdds | undefined {
  if (!market) return undefined
  return {
    market: market.displayName,
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
 * actually using useOdds.
 *
 * `movementById` is optional — pass `useOddsMovement(market)`'s result to
 * color options as odds change; omit it and options render without any
 * color change.
 *
 * Odds are dropped once the match is completed, regardless of what
 * `market` holds — betting closes when a match ends, and a WS subscription
 * has no reason to push another update once there's nothing left to
 * change, so `market` would otherwise just sit frozen on its last live
 * value forever.
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
    status: toMatchCardStatus(match),
    kickoff: match.startTime,
    // Only meaningful while the match is actually in progress — once
    // completed, the clock display is a frozen artifact (e.g. "90+5'"),
    // not a real "FT" transition, so drop it and let Match Card show its
    // own "FT" label instead.
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
    odds: match.status === "completed" ? undefined : toMatchCardOdds(market, movementById),
  }
}

/**
 * Same as matchToMatchCardProps, but keeps odds even once the match is
 * completed. matchToMatchCardProps drops them there deliberately — correct
 * for the live app, where a frozen line would be misleading once betting's
 * closed. Showcase/marketing usage (mrdoge.co's homepage and /ui gallery)
 * wants the opposite: proving the SDK still has the data regardless of
 * match status, suspended lines and all.
 */
export function matchToMatchCardPropsWithOdds(
  match: MatchDetail,
  market?: Market,
  movementById?: Record<string, OddsMovement>,
): MatchCardDataProps {
  return {
    ...matchToMatchCardProps(match, market, movementById),
    odds: toMatchCardOdds(market, movementById),
  }
}
