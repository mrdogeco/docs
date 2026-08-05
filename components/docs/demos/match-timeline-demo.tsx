"use client"

import { useEffect, useState } from "react"
import type { TimelineEvent } from "@mrdoge/protocol"
import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { MatchTimeline, MatchTimelineSkeleton } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { matchToMatchTimelineProps } from "@/lib/mrdoge-adapters/match-timeline"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useHighlightMatchId } from "@/components/docs/demos/use-highlight-match-id"

// matches.subscribe only pushes stats.upd/status.upd — there's no
// timeline.upd, so useLiveMatch's own snapshot never gets new events
// once a match is subscribed. Polling just the timeline field (a cheap
// partial fetch via `select`) while live is the workaround.
function useLiveTimeline(matchId: string | undefined, isLive: boolean) {
  const [timeline, setTimeline] = useState<TimelineEvent[] | undefined>(undefined)

  useEffect(() => {
    if (!matchId || !isLive) return

    let cancelled = false
    function refresh() {
      getMrDogeClient()
        .matches.get({ id: matchId!, select: { timeline: true } })
        .then((result) => {
          if (!cancelled) setTimeline(result.timeline)
        })
        .catch(() => {})
    }

    refresh()
    const interval = setInterval(refresh, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [matchId, isLive])

  return timeline
}

export function MatchTimelineDemo() {
  const matchId = useHighlightMatchId("live")
  const match = useLiveMatch({ matchId: matchId ?? undefined })
  const liveTimeline = useLiveTimeline(matchId ?? undefined, match?.status === "live")

  if (matchId === null || match === null) {
    return <p className="text-sm text-fd-muted-foreground">No live match to show right now.</p>
  }

  const timeline = match
    ? matchToMatchTimelineProps({ ...match, timeline: liveTimeline ?? match.timeline })
    : null

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {match === undefined ? <MatchHighlight loading /> : <MatchHighlight {...matchToMatchHighlightProps(match)} />}
      {match === undefined ? (
        <MatchTimelineSkeleton />
      ) : timeline && timeline.entries.length > 0 ? (
        <MatchTimeline {...timeline} />
      ) : (
        <p className="text-sm text-fd-muted-foreground">No events reported for this match yet.</p>
      )}
    </div>
  )
}
