"use client"

import { useMemo, useRef } from "react"
import type { Market } from "@mrdoge/protocol"
import type { OddsMovement } from "@/registry/mrdoge-ui/odds-selector/odds-selector"

/**
 * Diffs each bet item's price against the price it had the last time this
 * hook saw a market for the same match, so an Odds Selector can show
 * up/down indicators as live odds change. Movement isn't something the SDK
 * computes or sends — `odds.subscribe` pushes a full replace-in-place
 * snapshot on every change (see useLiveOdds), so this hook remembers the
 * previous snapshot's prices itself and compares.
 *
 * A bet item with no prior snapshot to compare against (first time seen,
 * or the match/market just changed) has no entry in the result — nothing
 * to compare yet, not a "flat" tick. An unchanged price also has no entry,
 * on purpose: an indicator that never goes away would just be noise.
 */
export function useOddsMovement(
  market: Market | null | undefined
): Record<string, OddsMovement> {
  const previousPrices = useRef<Map<string, number>>(new Map())

  return useMemo(() => {
    if (!market) return {}

    const movement: Record<string, OddsMovement> = {}
    const nextPrices = new Map<string, number>()

    for (const item of market.betItems) {
      const previous = previousPrices.current.get(item.id)
      if (previous !== undefined && item.price !== previous) {
        movement[item.id] = item.price > previous ? "up" : "down"
      }
      nextPrices.set(item.id, item.price)
    }

    previousPrices.current = nextPrices
    return movement
  }, [market])
}
