"use client"

import { useEffect, useState } from "react"
import type { Market } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseLiveOddsOptions {
  /** The match to subscribe odds for. Pass undefined to skip subscribing. */
  matchId: string | undefined
  /**
   * Restrict which markets come back. Omit to get every live market on the
   * match.
   *
   * Some bet types post one market per line instead of one market total —
   * e.g. `SOCCER_UNDER_OVER` posts a separate market for each Over/Under
   * threshold (0.5, 1.5, 2.5, ...). This hook always returns every market
   * that matched, so filtering to a single-market bet type (like
   * `SOCCER_MATCH_RESULT`) is what makes indexing `[0]` safe.
   *
   * Some markets also use a different sysname before kickoff — e.g. the
   * standard 1X2 line is `SOCCER_MATCH_RESULT_PRELIVE` up until the match
   * goes live, then `SOCCER_MATCH_RESULT`. Filter on both if you want the
   * market regardless of match state: `["SOCCER_MATCH_RESULT",
   * "SOCCER_MATCH_RESULT_PRELIVE"]`.
   */
  betTypes?: string[]
}

/**
 * undefined = loading, null = no live markets match this filter for this
 * match (Business tier only — no fallback, that's an honest empty state,
 * not a fictional one).
 */
export function useLiveOdds({ matchId, betTypes }: UseLiveOddsOptions) {
  const [markets, setMarkets] = useState<Market[] | null | undefined>(undefined)
  const betTypesKey = betTypes?.join(",")

  useEffect(() => {
    if (!matchId) {
      setMarkets(undefined)
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
        setMarkets(sub.snapshot.length > 0 ? sub.snapshot : null)
        sub.on("snapshot", (next) => setMarkets(next.length > 0 ? next : null))
        sub.on("odds.upd", (next) => setMarkets(next.length > 0 ? next : null))
      })
      .catch(() => {
        if (!cancelled) setMarkets(null)
      })

    return () => {
      cancelled = true
      subscription?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- betTypesKey is the stable form of betTypes
  }, [matchId, betTypesKey])

  return markets
}
