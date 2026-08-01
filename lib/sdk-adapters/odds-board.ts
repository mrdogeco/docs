import type { Market } from "@mrdoge/protocol"
import type { OddsBoardProps } from "@/registry/mrdoge-ui/odds-board/odds-board"
import { toOddsOptions, toMarketLabel } from "@/lib/sdk-adapters/match-card"

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
