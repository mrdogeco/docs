import type { TimelineEvent } from "@mrdoge/protocol"
import type { MatchTimelineProps } from "@/registry/mrdoge-ui/match-timeline/match-timeline"

// Soccer/hockey/handball phases run on a continuous minute clock, so a
// seconds offset converts cleanly to "N'". Other sports' phases (quarters,
// sets, innings) don't have a single conversion that reads naturally — for
// those, the phase code itself is a better label than a minute count.
const MINUTE_CLOCK_PHASES = new Set(["1H", "2H", "ET1", "ET2"])

function toTimeLabel(event: TimelineEvent): string | undefined {
  if (event.timeOffsetSeconds === 0) return undefined
  if (MINUTE_CLOCK_PHASES.has(event.phase)) {
    return `${Math.floor(event.timeOffsetSeconds / 60)}'`
  }
  return event.phase
}

/**
 * Maps a real match timeline (from `matches.get()`/`matches.subscribe()`,
 * or the `matches.*` reference docs) to MatchTimeline's props. If the SDK's
 * shape changes, this fails to compile.
 */
export function timelineToMatchTimelineProps(events: TimelineEvent[]): MatchTimelineProps {
  return {
    entries: events.map((event, index) => ({
      id: String(index),
      time: toTimeLabel(event),
      type: event.type,
      side: event.side,
      description: event.captions.join(" — "),
    })),
  }
}
