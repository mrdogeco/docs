"use client"

import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"
import { useMatches } from "@/registry/mrdoge-ui/use-matches/use-matches"

/**
 * Shared by the Match Highlight / Match Timeline / Stats List demos — a
 * match with the given status that's actually real right now, not a
 * fixed id that would eventually go stale. Prefers today's trending
 * (most-viewed) match with that status; falls back to any match with
 * that status at all. undefined = still resolving, null = none anywhere.
 */
export function useHighlightMatchId(status: "upcoming" | "live"): string | null | undefined {
  // matches.trending has no date param — it's today's most-viewed by
  // definition, so no bound needed there. The useMatches fallback queries
  // the full list though, and status alone isn't enough to keep it
  // current — see useMatches' own "status alone isn't enough" callout.
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // trending's own `status` param doesn't reliably filter server-side —
  // it can return matches with a different status than requested — so
  // fetch a wider unfiltered batch and check each candidate's real
  // status client-side instead of trusting the param.
  const trending = useTrendingMatches({ limit: 10 })
  const anyMatch = useMatches({
    status: [status],
    startDate: today.toISOString().slice(0, 10),
    endDate: tomorrow.toISOString().slice(0, 10),
    limit: 1,
  })

  if (trending === undefined) return undefined
  const trendingMatch = trending?.find((match) => match.status === status)
  if (trendingMatch) return trendingMatch.id

  if (anyMatch === undefined) return undefined
  if (anyMatch === null || anyMatch.length === 0) return null
  return anyMatch[0].id
}
