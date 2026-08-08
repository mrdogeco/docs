import type { Market } from "@mrdoge/protocol"
import type { OddsLine } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

// Over/Under outcomes only carry a generic "O"/"U" code, no threshold in
// it. The threshold lives in the caption instead ("Over 1.5", "Under
// 1.5"), so that's what has to be parsed to sort lines and label them.
function parseThreshold(caption: string | null | undefined): number {
  const match = caption?.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : NaN
}

/**
 * Some bet types post one market per line instead of one market total.
 * SOCCER_UNDER_OVER posts a separate market for each Over/Under threshold
 * (0.5, 1.5, 2.5, ...). Pairs each market's two outcomes into one OddsLine
 * row and sorts by threshold, for OddsSelector's `lines` prop.
 */
export function toOddsLines(markets: Market[]): OddsLine[] {
  const lines: (OddsLine & { threshold: number })[] = []
  for (const market of markets) {
    const over = market.lines.find((line) => line.code.startsWith("O"))
    const under = market.lines.find((line) => line.code.startsWith("U"))
    if (!over || !under) continue
    const threshold = parseThreshold(over.caption ?? under.caption)
    // Can't sort or label a line without a real threshold. Drop it
    // rather than showing a broken "NaN" row.
    if (Number.isNaN(threshold)) continue
    lines.push({
      id: market.id,
      threshold,
      label: String(threshold),
      over: {
        id: over.id,
        label: over.caption ?? over.code,
        price: over.price.toFixed(2),
        suspended: !over.isAvailable,
      },
      under: {
        id: under.id,
        label: under.caption ?? under.code,
        price: under.price.toFixed(2),
        suspended: !under.isAvailable,
      },
    })
  }
  return lines.sort((a, b) => a.threshold - b.threshold)
}

/**
 * Picks the line closest to an even split: the Over/Under prices closest
 * to each other, e.g. Over 1.90 / Under 2.00 rather than a lopsided Over
 * 1.18 / Under 4.50. A reasonable single-market pick when there's only
 * room to show one Total Goals line, e.g. alongside other markets on a
 * board. The first market in the snapshot is otherwise arbitrary.
 */
export function pickMostBalancedMarket(markets: Market[]): Market | undefined {
  let best: Market | undefined
  let bestSpread = Infinity
  for (const market of markets) {
    const over = market.lines.find((line) => line.code.startsWith("O"))
    const under = market.lines.find((line) => line.code.startsWith("U"))
    if (!over || !under) continue
    const spread = Math.abs(over.price - under.price)
    if (spread < bestSpread) {
      best = market
      bestSpread = spread
    }
  }
  return best
}
