"use client"

import { useEffect, useState } from "react"
import type { TimelineEvent } from "@mrdoge/protocol"
import { MatchHighlight } from "@/registry/mrdoge-ui/match-highlight/match-highlight"
import { matchToMatchHighlightProps } from "@/lib/mrdoge-adapters/match-highlight"
import { MatchTimeline, MatchTimelineSkeleton } from "@/registry/mrdoge-ui/match-timeline/match-timeline"
import { matchToMatchTimelineProps } from "@/lib/mrdoge-adapters/match-timeline"
import { getMrDogeClient } from "@/registry/mrdoge-ui/mrdoge-client/mrdoge-client"
import { useLiveMatch } from "@/registry/mrdoge-ui/use-live-match/use-live-match"
import { useSharedLiveOrCompletedMatchId } from "@/components/docs/demos/use-shared-demo-matches"
import { FINISHED_MATCH_ID } from "@/components/docs/sample-data"

// matches.subscribe only pushes stats.upd/status.upd. There's no
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
  // Prefers a genuinely live match; falls back to a fixed completed match
  // if nothing's live right now (e.g. quiet hours): an upcoming match
  // would just trade one empty timeline for another.
  const resolvedId = useSharedLiveOrCompletedMatchId()

  // A live match can resolve before it has any goals/cards yet (e.g. it
  // just kicked off) — a duller demo than the guaranteed-populated
  // finished match. Once we see that, switch to it instead.
  const [fallbackToFinished, setFallbackToFinished] = useState(false)
  const matchId = fallbackToFinished ? FINISHED_MATCH_ID : resolvedId
  const match = useLiveMatch({ matchId })
  const liveTimeline = useLiveTimeline(matchId, match?.status === "live")

  const timeline = match
    ? matchToMatchTimelineProps({ ...match, timeline: liveTimeline ?? match.timeline })
    : null

  // "Real" excludes the synthetic live-score/HT/FT divider entries Match
  // Timeline always injects for a live or completed match — those aren't
  // an actual reported event.
  const hasRealEntries = timeline?.entries.some((entry) => entry.type !== "divider") ?? false
  useEffect(() => {
    if (!fallbackToFinished && match?.status === "live" && !hasRealEntries) {
      setFallbackToFinished(true)
    }
  }, [fallbackToFinished, match?.status, hasRealEntries])

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

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
