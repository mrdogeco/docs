"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseTrendingMatchesOptions {
  /** Restrict to specific sports, e.g. ["soccer"]. Omit for all sports. */
  sports?: string[]
  /** Restrict to specific match statuses, e.g. ["upcoming"]. Omit for all statuses. */
  status?: ("upcoming" | "live" | "completed")[]
  /** Result count. Server default 5, capped at 50. */
  limit?: number
  /** IANA timezone for any timezone-dependent fields server-side. */
  timezone?: string
  /** Locale for any localized fields server-side. */
  locale?: string
}

/**
 * Today's most-viewed matches, ranked server-side by views — see
 * `matches.trending`. One-shot (not a subscription): call again / remount
 * to refresh.
 *
 * Mirrors `matches.trending`'s real params, minus `select` — this hook
 * always returns the full `Match` shape, so a field-selector doesn't fit
 * its contract.
 *
 * undefined = loading, null = the request failed (no fallback — that's an
 * honest empty state, not a fictional one).
 */
export function useTrendingMatches({
  sports,
  status,
  limit,
  timezone,
  locale,
}: UseTrendingMatchesOptions = {}) {
  const [matches, setMatches] = useState<Match[] | null | undefined>(undefined)
  const sportsKey = sports?.join(",")
  const statusKey = status?.join(",")

  useEffect(() => {
    let cancelled = false

    getMrDogeClient()
      .matches.trending({ sports, status, limit, timezone, locale })
      .then((result) => {
        if (!cancelled) setMatches(result)
      })
      .catch(() => {
        if (!cancelled) setMatches(null)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sportsKey/statusKey are the stable forms of sports/status
  }, [sportsKey, statusKey, limit, timezone, locale])

  return matches
}
