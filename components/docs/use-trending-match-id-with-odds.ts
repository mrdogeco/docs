"use client"

import { useEffect, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

/**
 * Docs-only: given an already-fetched trending list, resolves the first
 * candidate that actually has odds for the given betTypes — not every
 * trending match has every market posted yet (pre-match boards can lag for
 * lower-profile fixtures), so picking blind made for a demo that sometimes
 * had nothing to show. Takes `trending` as a param (rather than calling
 * `useTrendingMatches` itself) so multiple call sites — e.g. one preferring
 * a live match, one preferring a not-yet-live one — can share a single
 * fetch instead of each firing its own `matches.trending` request.
 *
 * By default checks not-yet-live candidates first (complete, stable
 * pre-match boards when available), then live ones; `preferLive` reverses
 * that. Either way, candidates within a group are checked in trending rank
 * order, in parallel.
 *
 * undefined = loading, null = none of the trending matches have this market.
 */
export function useTrendingMatchIdWithOdds({
  trending,
  betTypes,
  preferLive = false,
}: {
  trending: Match[] | null | undefined
  betTypes: string[]
  preferLive?: boolean
}) {
  const [matchId, setMatchId] = useState<string | null | undefined>(undefined)
  const betTypesKey = betTypes.join(",")

  useEffect(() => {
    if (trending === undefined) return
    if (trending === null || trending.length === 0) {
      setMatchId(null)
      return
    }

    let cancelled = false
    const live = trending.filter((m) => m.status === "live")
    const notLive = trending.filter((m) => m.status !== "live")
    const ordered = preferLive ? [...live, ...notLive] : [...notLive, ...live]

    Promise.all(
      ordered.map((candidate) =>
        getMrDogeClient()
          .odds.list({ matchId: candidate.id, betTypes })
          .then((markets) => (markets.length > 0 ? candidate.id : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (!cancelled) setMatchId(results.find((id) => id !== null) ?? null)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- betTypesKey is the stable form of betTypes; trending itself is the real trigger
  }, [trending, betTypesKey, preferLive])

  return matchId
}
