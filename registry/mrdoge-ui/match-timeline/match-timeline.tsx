import { CircleDot, LogOut, Square } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

export type MatchTimelineEventType =
  | "goal"
  | "yellow-card"
  | "red-card"
  | "substitution"
  | "other"

export interface MatchTimelineEntry {
  id: string
  /** Match minute, e.g. 45 or 90 (extra time is passed in via `description`). */
  minute: number
  type: MatchTimelineEventType
  team: "home" | "away"
  description: string
}

export interface MatchTimelineProps {
  /** Entries ordered chronologically, ascending minute. */
  entries: MatchTimelineEntry[]
  className?: string
}

const eventIcon: Record<MatchTimelineEventType, ComponentType<{ className?: string }>> = {
  goal: CircleDot,
  "yellow-card": Square,
  "red-card": Square,
  substitution: LogOut,
  other: CircleDot,
}

const eventIconColor: Record<MatchTimelineEventType, string> = {
  goal: "text-foreground",
  "yellow-card": "text-yellow-500",
  "red-card": "text-destructive",
  substitution: "text-muted-foreground",
  other: "text-muted-foreground",
}

export function MatchTimeline({ entries, className }: MatchTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {entries.map((entry) => {
        const Icon = eventIcon[entry.type]
        const isAway = entry.team === "away"

        return (
          <li
            key={entry.id}
            className={cn(
              "flex items-center gap-3 border-l py-2 pl-4",
              isAway && "flex-row-reverse border-r border-l-0 pr-4 pl-0 text-right"
            )}
          >
            <span className="w-8 shrink-0 text-xs tabular-nums text-muted-foreground">
              {entry.minute}&apos;
            </span>
            <Icon className={cn("size-3.5 shrink-0", eventIconColor[entry.type])} />
            <span className="text-sm">{entry.description}</span>
          </li>
        )
      })}
    </ol>
  )
}
