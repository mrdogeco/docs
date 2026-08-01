"use client"

import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/sdk-adapters/match-card"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { DEMO_MATCH_ID } from "@/components/docs/sample-data"

export function MatchCardLiveDemo() {
  const match = useLiveMatch({ matchId: DEMO_MATCH_ID })

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

  return (
    <div className="w-full max-w-sm">
      {match === undefined ? <MatchCard loading /> : <MatchCard {...matchToMatchCardProps(match)} />}
    </div>
  )
}
