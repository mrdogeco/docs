"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseMatchesOptions {
  /** Restrict to specific sports, e.g. ["soccer"]. Omit for all sports. */
  sports?: string[]
  /** Restrict to specific match statuses, e.g. ["upcoming"]. Omit for all statuses. */
  status?: ("upcoming" | "live" | "completed")[]
  /** Single day, YYYY-MM-DD. Mutually exclusive with startDate/endDate. */
  date?: string
  /** Start of a date range, YYYY-MM-DD, inclusive. */
  startDate?: string
  /** End of a date range, YYYY-MM-DD, inclusive. */
  endDate?: string
  /** Result count. Server default 20, capped at 100. */
  limit?: number
  /** IANA timezone for any timezone-dependent fields server-side. */
  timezone?: string
  /** Locale for any localized fields server-side. */
  locale?: string
}

/**
 * A plain list of matches — see `matches.list`. Unlike useTrendingMatches,
 * not limited to today's most-viewed ones, so it still returns results
 * even when nothing matching your filters happens to be trending right
 * now. One-shot (not a subscription): call again / remount to refresh.
 *
 * undefined = loading, null = the request failed (no fallback — that's an
 * honest empty state, not a fictional one).
 */
export function useMatches({
  sports,
  status,
  date,
  startDate,
  endDate,
  limit,
  timezone,
  locale,
}: UseMatchesOptions = {}) {
  const [matches, setMatches] = useState<Match[] | null | undefined>(undefined)
  const sportsKey = sports?.join(",")
  const statusKey = status?.join(",")

  useEffect(() => {
    let cancelled = false

    getMrDogeClient()
      .matches.list({ sports, status, date, startDate, endDate, limit, timezone, locale })
      .then((result) => {
        if (!cancelled) setMatches(result.data)
      })
      .catch(() => {
        if (!cancelled) setMatches(null)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sportsKey/statusKey are the stable forms of sports/status
  }, [sportsKey, statusKey, date, startDate, endDate, limit, timezone, locale])

  return matches
}
