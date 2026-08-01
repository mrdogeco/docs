"use client"

import { useEffect, useState } from "react"
import type { Market } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseLiveOddsOptions {
  /** The match to subscribe odds for. Pass undefined to skip subscribing. */
  matchId: string | undefined
  /**
   * Restrict (and make deterministic) which market comes back. Omit to get
   * every live market on the match; this hook always returns just the
   * first one, so without a filter that first one is whatever order the
   * server sends.
   *
   * Some markets use a different sysname before kickoff — e.g. the
   * standard 1X2 line is `SOCCER_MATCH_RESULT_PRELIVE` up until the match
   * goes live, then `SOCCER_MATCH_RESULT`. Filter on both if you want the
   * market regardless of match state: `["SOCCER_MATCH_RESULT",
   * "SOCCER_MATCH_RESULT_PRELIVE"]`.
   */
  betTypes?: string[]
}

/**
 * undefined = loading, null = no live odds for this match (Business tier
 * only — no fallback, that's an honest empty state, not a fictional one).
 */
export function useLiveOdds({ matchId, betTypes }: UseLiveOddsOptions) {
  const [market, setMarket] = useState<Market | null | undefined>(undefined)
  const betTypesKey = betTypes?.join(",")

  useEffect(() => {
    if (!matchId) {
      setMarket(undefined)
      return
    }

    let cancelled = false
    let subscription: { cancel: () => Promise<void> } | null = null

    getMrDogeClient()
      .odds.subscribe({ matchId, betTypes })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- betTypesKey is the stable form of betTypes
  }, [matchId, betTypesKey])

  return market
}
