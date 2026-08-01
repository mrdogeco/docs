"use client"

import { useEffect, useState } from "react"
import type { MatchDetail } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"

/** undefined = loading, null = subscribe failed (no fallback — that's an honest empty state). */
export function useLiveMatch(matchId: string) {
  const [match, setMatch] = useState<MatchDetail | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    let subscription: { cancel: () => Promise<void> } | null = null

    async function run() {
      const sub = await getMrDogeClient().matches.subscribe({ matchId })
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
