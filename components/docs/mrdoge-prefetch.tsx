"use client"

import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useMatch } from "@/registry/mrdoge-ui/use-match/use-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { DEMO_MATCH_ID, FINISHED_MATCH_ID } from "@/components/docs/sample-data"
import {
  useSharedUpcomingMatchId,
  useSharedLiveMatchId,
  useSharedOddsMatchId,
  MATCH_RESULT_BET_TYPES,
  DOUBLE_CHANCE_BET_TYPES,
  TOTAL_GOALS_BET_TYPES,
} from "@/components/docs/demos/use-shared-demo-matches"

/**
 * Mounted once at the /docs/ui layout root, so it stays alive across
 * client-side navigation between component pages. Warms the shared
 * @mrdoge/react cache — matches and their odds — as soon as any docs page
 * loads, so navigating to a page that reuses the same match/market reads
 * it from cache instantly instead of showing a fresh loading skeleton.
 *
 * Doesn't cover Bet Slip's multi-game example — it needs several
 * *distinct* upcoming matches, not the one shared upcoming match
 * everything else here uses.
 */
export function MrDogePrefetch() {
  useLiveMatch({ matchId: DEMO_MATCH_ID })
  useMatch({ matchId: FINISHED_MATCH_ID })
  // Match Timeline/Stats List's fallback subscribes (not one-shot fetches)
  // this same match — a different cache key, warmed separately.
  useLiveMatch({ matchId: FINISHED_MATCH_ID })

  const upcomingId = useSharedUpcomingMatchId()
  useMatch({ matchId: upcomingId ?? undefined })
  useLiveOdds({ matchId: upcomingId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  useLiveOdds({ matchId: upcomingId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
  useLiveOdds({ matchId: upcomingId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })

  const liveId = useSharedLiveMatchId()
  useLiveMatch({ matchId: liveId ?? undefined })
  useLiveOdds({ matchId: liveId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  useLiveOdds({ matchId: liveId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
  useLiveOdds({ matchId: liveId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })

  const oddsId = useSharedOddsMatchId()
  useLiveMatch({ matchId: oddsId ?? undefined })
  useLiveOdds({ matchId: oddsId ?? undefined, betTypes: MATCH_RESULT_BET_TYPES })
  useLiveOdds({ matchId: oddsId ?? undefined, betTypes: DOUBLE_CHANCE_BET_TYPES })
  useLiveOdds({ matchId: oddsId ?? undefined, betTypes: TOTAL_GOALS_BET_TYPES })

  return null
}
