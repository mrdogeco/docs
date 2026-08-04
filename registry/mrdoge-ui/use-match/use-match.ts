"use client"

import { useEffect, useState } from "react"
import type { MatchDetail } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseMatchOptions {
  /** The match to fetch. Pass undefined to skip fetching — e.g. while some other lookup is still resolving which match to show. */
  matchId: string | undefined
}

/**
 * One-shot fetch of a single match — see `matches.get`. Unlike
 * `useLiveMatch`, this never updates after the initial fetch: call again
 * / remount to refresh. The right choice when live score/status updates
 * would be unwanted noise, e.g. a fixed upcoming match in a demo that
 * shouldn't visibly change state mid-read.
 *
 * undefined = loading (or no matchId yet), null = the request failed (no
 * fallback — that's an honest empty state, not a fictional one).
 */
export function useMatch({ matchId }: UseMatchOptions) {
  const [match, setMatch] = useState<MatchDetail | null | undefined>(undefined)

  useEffect(() => {
    if (!matchId) {
      setMatch(undefined)
      return
    }

    let cancelled = false
    getMrDogeClient()
      // matches.get takes `id`, not `matchId` — unlike every other
      // matches.* method. Real SDK quirk, not a typo.
      .matches.get({ id: matchId })
      .then((result) => {
        if (!cancelled) setMatch(result)
      })
      .catch(() => {
        if (!cancelled) setMatch(null)
      })

    return () => {
      cancelled = true
    }
  }, [matchId])

  return match
}
