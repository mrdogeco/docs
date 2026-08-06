"use client"

import { MatchDetail } from "@/components/docs/demos/match-detail"
import { useSharedLiveOrCompletedMatchId } from "@/components/docs/demos/use-shared-demo-matches"

export function MatchDetailDemo() {
  const matchId = useSharedLiveOrCompletedMatchId()

  if (matchId === undefined) {
    return <p className="text-sm text-fd-muted-foreground">Loading...</p>
  }

  return <MatchDetail matchId={matchId} className="w-full max-w-sm" />
}
