"use client"

import { useEffect, useState } from "react"
import type { Market } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

/**
 * undefined = loading, null = no live odds for this match (Business tier
 * only — no fallback, that's an honest empty state, not a fictional one).
 */
export function useLiveOdds(matchId: string | undefined) {
  const [market, setMarket] = useState<Market | null | undefined>(undefined)

  useEffect(() => {
    if (!matchId) {
      setMarket(undefined)
      return
    }

    let cancelled = false
    let subscription: { cancel: () => Promise<void> } | null = null

    getMrDogeClient()
      .odds.subscribe({ matchId })
      .then((sub) => {
        if (cancelled) {
          sub.cancel()
          return
        }
        subscription = sub
        setMarket(sub.snapshot[0] ?? null)
        sub.on("snapshot", (markets) => setMarket(markets[0] ?? null))
        sub.on("odds.upd", (markets) => setMarket(markets[0] ?? null))
      })
      .catch(() => {
        if (!cancelled) setMarket(null)
      })

    return () => {
      cancelled = true
      subscription?.cancel()
    }
  }, [matchId])

  return market
}
