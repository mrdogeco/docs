"use client"

import { useEffect, useState } from "react"
import type { MatchDetail } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

export interface UseLiveMatchOptions {
  /** The match to subscribe to. Pass undefined to skip subscribing — e.g. while some other lookup is still resolving which match to show. */
  matchId: string | undefined
}

/**
 * undefined = loading (or no matchId yet), null = subscribe failed (no
 * fallback — that's an honest empty state).
 */
export function useLiveMatch({ matchId }: UseLiveMatchOptions) {
  const [match, setMatch] = useState<MatchDetail | null | undefined>(undefined)

  useEffect(() => {
    if (!matchId) {
      setMatch(undefined)
      return
    }

    let cancelled = false
    let subscription: { cancel: () => Promise<void> } | null = null

    async function run() {
      const sub = await getMrDogeClient().matches.subscribe({ matchId: matchId! })
      if (cancelled) {
        sub.cancel()
        return
      }
      subscription = sub

      setMatch(sub.snapshot)
      sub.on("snapshot", (snapshot) => setMatch(snapshot))
      sub.on("stats.upd", (stats) => setMatch((prev) => (prev ? { ...prev, stats } : prev)))
      sub.on("status.upd", ({ status }) => setMatch((prev) => (prev ? { ...prev, status } : prev)))
    }

    run().catch(() => {
      if (!cancelled) setMatch(null)
    })

    return () => {
      cancelled = true
      subscription?.cancel()
    }
  }, [matchId])

  return match
}
