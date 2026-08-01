"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseTrendingMatchesOptions {
  /** Restrict to specific sports, e.g. ["soccer"]. Omit for all sports. */
  sports?: string[]
  /** Result count. Server default 5, capped at 50. */
  limit?: number
}

/**
 * Today's most-viewed matches, ranked server-side by views — see
 * `matches.trending`. One-shot (not a subscription): call again / remount
 * to refresh.
 *
 * undefined = loading, null = the request failed (no fallback — that's an
 * honest empty state, not a fictional one).
 */
export function useTrendingMatches({ sports, limit }: UseTrendingMatchesOptions = {}) {
  const [matches, setMatches] = useState<Match[] | null | undefined>(undefined)
  const sportsKey = sports?.join(",")

  useEffect(() => {
    let cancelled = false

    getMrDogeClient()
      .matches.trending({ sports, limit })
      .then((result) => {
        if (!cancelled) setMatches(result)
      })
      .catch(() => {
        if (!cancelled) setMatches(null)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sportsKey is the stable form of sports
  }, [sportsKey, limit])

  return matches
}
