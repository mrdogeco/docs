"use client"

import { useState } from "react"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { matchToMatchCardProps } from "@/lib/sdk-adapters/match-card"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useLiveOdds } from "@/registry/mrdoge-ui/use-live-odds/use-live-odds"
import { DEMO_MATCH_ID } from "@/components/docs/sample-data"

export function MatchCardLiveWithOddsDemo() {
  const match = useLiveMatch(DEMO_MATCH_ID)
  const market = useLiveOdds(match?.id)
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>()

  if (match === undefined) {
    return <p className="text-sm text-fd-muted-foreground">Loading…</p>
  }

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

  return (
    <div className="w-full max-w-sm">
      <MatchCard
        {...matchToMatchCardProps(match, market ?? undefined)}
        selectedOddsId={selectedOddsId}
        onSelectOdds={setSelectedOddsId}
      />
    </div>
  )
}
