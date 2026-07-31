import type { Market } from "@mrdoge/protocol"
import type { OddsBoardProps } from "@/registry/mrdoge-ui/odds-board/odds-board"
import { toOddsOptions } from "@/lib/sdk-adapters/event-card"

// Market.betType is a raw sysname on the wire (e.g. "SOCCER_MATCH_RESULT"),
// not a display label — a real name lookup table is out of scope here, so
// this falls back to a light cleanup (underscores to spaces, title case)
// rather than the raw sysname or a fabricated name.
function toMarketLabel(betType: string): string {
  return betType
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Maps a real `odds.list({ matchId })` response (every market for a match
 * at once) to OddsBoard's props. If the SDK's shape changes, this fails to
 * compile.
 */
export function marketsToOddsBoardProps(markets: Market[]): OddsBoardProps {
  return {
    markets: markets.map((market) => ({
      id: market.id,
      label: toMarketLabel(market.betType),
      options: toOddsOptions(market),
    })),
  }
}
