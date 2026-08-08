"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"
import type { Match } from "@mrdoge/protocol"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"
import { useMatches } from "@/registry/mrdoge-ui/use-matches/use-matches"
import { FINISHED_MATCH_ID } from "@/components/docs/sample-data"

export const MATCH_RESULT_BET_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]
export const DOUBLE_CHANCE_BET_TYPES = ["SOCCER_DOUBLE_CHANCE"]
export const TOTAL_GOALS_BET_TYPES = ["SOCCER_UNDER_OVER", "SOCCER_UNDER_OVER_PRELIVE"]

/**
 * Three shared match pools, so demos needing "a good match" read the same
 * ids instead of each resolving their own candidate. All three rank
 * candidates the same way: Match Result + Double Chance + Total Goals
 * all posted, ranked by Total Goals line count, so the demos with looser
 * requirements (just Match Result) are automatically satisfied by
 * whatever wins under the strictest one (Odds Selector's "Multiple
 * Lines" example).
 *
 * - live: Match Card's "with odds" live slot, and the base pool for the
 *   two fallback resolvers below. These need a match actually in
 *   progress (real events, real stats).
 * - upcoming: Match Highlight's upcoming example, Bet Slip's single-game
 *   example, Match Card's "with odds" upcoming slot. These need a stable
 *   match that won't change mid-read.
 * - odds (live or upcoming): Odds Selector's three examples. They only
 *   need a rich odds board, not a particular match status. Restricting
 *   to live-only just shrank the candidate pool for no reason, especially
 *   since pre-match boards are often more complete than in-play ones.
 *
 * Two more resolvers below combine live with a fallback, for demos that
 * want to show something during quiet hours rather than a blank state:
 * useSharedLiveOrUpcomingMatchId (Match Highlight's live example) and
 * useSharedLiveOrCompletedMatchId (Match Timeline, Stats List). These
 * need actual event/stat history, which an upcoming match doesn't have.
 *
 * Resolved once per pool (module-level, not per-hook-instance). The
 * candidate list itself is already shared via useTrendingMatches/
 * useMatches' own cache, but checking each candidate's odds is extra
 * network work worth caching too, not just its inputs.
 */

interface Entry {
  /** Ranked qualifying ids, richest first. null = none qualify. */
  value: string[] | null | undefined
  listeners: Set<() => void>
  started: boolean
}

const resolutions = new Map<string, Entry>()

function getEntry(key: string): Entry {
  let entry = resolutions.get(key)
  if (!entry) {
    entry = { value: undefined, listeners: new Set(), started: false }
    resolutions.set(key, entry)
  }
  return entry
}

function notify(entry: Entry) {
  for (const listener of entry.listeners) listener()
}

function resolveRichest(key: string, candidates: Match[]) {
  const entry = getEntry(key)
  if (entry.started) return
  entry.started = true

  Promise.all(
    candidates.map((candidate) =>
      Promise.all([
        getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: MATCH_RESULT_BET_TYPES }),
        getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: DOUBLE_CHANCE_BET_TYPES }),
        getMrDogeClient().odds.list({ matchId: candidate.id, betTypes: TOTAL_GOALS_BET_TYPES }),
      ])
        .then(([matchResult, doubleChance, totalGoals]) =>
          matchResult.length > 0 && doubleChance.length > 0 && totalGoals.length > 0
            ? { id: candidate.id, lineCount: totalGoals.length }
            : null
        )
        .catch(() => null)
    )
  ).then((results) => {
    const qualifying = results.filter((r): r is { id: string; lineCount: number } => r !== null)
    qualifying.sort((a, b) => b.lineCount - a.lineCount)
    entry.value = qualifying.length > 0 ? qualifying.map((q) => q.id) : null
    notify(entry)
  })
}

function useRichestMatchIds(key: string, candidates: Match[] | null | undefined): string[] | null | undefined {
  const entry = getEntry(key)

  useEffect(() => {
    if (candidates && candidates.length > 0) resolveRichest(key, candidates)
  }, [key, candidates])

  // Stable across renders for the same key. An inline closure here would
  // get a new identity every render, and React re-subscribes (losing the
  // resolved value, if any) whenever `subscribe`'s identity changes, not
  // just when `key` does.
  const subscribe = useCallback(
    (listener: () => void) => {
      entry.listeners.add(listener)
      return () => entry.listeners.delete(listener)
    },
    [entry]
  )
  const getSnapshot = useCallback(() => entry.value, [entry])

  const resolved = useSyncExternalStore(
    subscribe,
    getSnapshot,
    // Server-rendered too (Next.js renders "use client" components on the
    // server for the initial HTML). There's no subscription there, so
    // always render the loading state and let the client take over.
    () => undefined
  )

  if (candidates === undefined) return undefined
  if (candidates === null || candidates.length === 0) return null
  return resolved
}

function firstOf(list: string[] | null | undefined): string | null | undefined {
  if (list === undefined) return undefined
  if (list === null || list.length === 0) return null
  return list[0]
}

/**
 * Candidates for a given status combo. Prefers `matches.trending()`
 * (today's most-viewed, a better demo signal), falling back to a plain
 * `matches.list()` when trending has nothing. trending() has real gaps
 * (confirmed live: it can return zero results for every query, including
 * an unfiltered one, a backend cache-regeneration hiccup, not a status-
 * filter bug). matches.list() doesn't share that failure mode, so this
 * is the fallback, not trending itself with a bigger limit.
 */
function useCandidates(status: ("live" | "upcoming")[]): Match[] | null | undefined {
  const trending = useTrendingMatches({ sports: ["soccer"], status, limit: 20 })

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const listFallback = useMatches({
    sports: ["soccer"],
    status,
    startDate: today.toISOString().slice(0, 10),
    endDate: tomorrow.toISOString().slice(0, 10),
    limit: 20,
  })

  if (trending === undefined) return undefined
  if (trending && trending.length > 0) return trending
  return listFallback
}

/** The one live match every "needs a live match" demo shares. */
export function useSharedLiveMatchId(): string | null | undefined {
  const candidates = useCandidates(["live"])
  return firstOf(useRichestMatchIds("live", candidates))
}

/** The one match every "needs a rich odds board" demo shares: live or upcoming, whichever has more to show. */
export function useSharedOddsMatchId(): string | null | undefined {
  const candidates = useCandidates(["live", "upcoming"])
  return firstOf(useRichestMatchIds("odds", candidates))
}

function useSharedUpcomingMatchIds(): string[] | null | undefined {
  const candidates = useCandidates(["upcoming"])
  return useRichestMatchIds("upcoming", candidates)
}

/** The one upcoming match every "needs an upcoming match" demo shares. */
export function useSharedUpcomingMatchId(): string | null | undefined {
  return firstOf(useSharedUpcomingMatchIds())
}

/**
 * Prefers the shared live match; falls back to the *second*-best shared
 * upcoming match once live is confirmed to have nothing (not while it's
 * still loading: switching candidates after upcoming loads first would
 * flash one match then swap to another). Second-best, not best, for
 * Match Highlight's live example specifically, whose "Upcoming" card on
 * the same page already shows the best one; falling back to the same
 * match would render it twice.
 */
export function useSharedLiveOrUpcomingMatchId(): string | null | undefined {
  const live = useSharedLiveMatchId()
  const upcomingList = useSharedUpcomingMatchIds()

  if (live === undefined) return undefined
  if (live) return live
  if (upcomingList === undefined) return undefined
  if (upcomingList === null || upcomingList.length === 0) return null
  return upcomingList[1] ?? upcomingList[0]
}

/**
 * Prefers the shared live match; falls back to the fixed
 * FINISHED_MATCH_ID once live is confirmed to have nothing. For Match
 * Timeline and Stats List. An upcoming match has no events or stats at
 * all, so falling back to one would just trade "no live match" for an
 * equally empty state; a completed match has a full history to actually
 * show.
 */
export function useSharedLiveOrCompletedMatchId(): string | undefined {
  const live = useSharedLiveMatchId()
  if (live === undefined) return undefined
  return live ?? FINISHED_MATCH_ID
}
