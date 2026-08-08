import type { MatchDetail, Market } from "@mrdoge/protocol"
import type { BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import type { OddsMovement } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

// Over/Under outcomes only carry a generic "O"/"U" code, no threshold in
// it. The threshold lives in the caption instead ("Over 1.5", "Under
// 1.5"), so that's what has to be parsed for conflict-checking.
function parseThreshold(caption: string | null | undefined): number | undefined {
  const match = caption?.match(/[\d.]+/)
  const value = match ? parseFloat(match[0]) : NaN
  return Number.isNaN(value) ? undefined : value
}

// Public, unauthenticated, cached CDN. Not part of the Team shape itself.
// See /docs/reference/images.
function teamLogoUrl(teamId: number) {
  return `https://api.mrdoge.co/images/teams/${teamId}.png`
}

/**
 * Builds a `BetSlipPick` from a real match, one of its markets, and a
 * selected line id. A pick is basically a selected odds line. Returns
 * `undefined` if `lineId` isn't found in `market.lines`; filter those out
 * when mapping several selections at once.
 *
 * `movementById` is optional. Pass `useOddsMovement(market)`'s result to
 * color the pick's price as odds change; omit it and the price renders
 * without any color change.
 */
export function toBetSlipPick(
  match: MatchDetail,
  market: Market,
  lineId: string,
  movementById?: Record<string, OddsMovement>
): BetSlipPick | undefined {
  const line = market.lines.find((l) => l.id === lineId)
  if (!line) return undefined

  const isTotals = line.code.startsWith("O") || line.code.startsWith("U")

  return {
    id: line.id,
    eventLabel: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    market: market.displayName,
    selection: line.caption ?? line.code,
    price: line.price,
    movement: movementById?.[line.id],
    unavailable: !line.isAvailable,
    home: { name: match.homeTeam.name, logoUrl: teamLogoUrl(match.homeTeam.id) },
    away: { name: match.awayTeam.name, logoUrl: teamLogoUrl(match.awayTeam.id) },
    kickoff: match.startTime,
    matchId: match.id,
    betType: market.betType,
    code: line.code,
    threshold: isTotals ? parseThreshold(line.caption) : undefined,
  }
}
