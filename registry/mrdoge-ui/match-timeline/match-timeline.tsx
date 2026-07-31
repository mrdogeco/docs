import { CircleDot, LogOut, Square } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

export interface MatchTimelineEntry {
  id: string
  /**
   * Pre-formatted time label, e.g. "45+2'", "Q3", "Set 2", "HT". Not every
   * sport has a meaningful running clock, so this is a string the caller
   * formats rather than a raw minute count — omit when there's none.
   */
  time?: string
  /**
   * Event kind — open string, sport-specific (e.g. "goal", "ace",
   * "penalty-miss"). Unrecognized types get a generic marker rather than
   * being rejected, since new event types can appear without warning.
   */
  type: string
  side: "home" | "away" | "match"
  description: string
}

export interface MatchTimelineProps {
  /** Entries ordered chronologically. */
  entries: MatchTimelineEntry[]
  className?: string
}

const knownEventIcon: Record<string, ComponentType<{ className?: string }>> = {
  goal: CircleDot,
  "yellow-card": Square,
  "red-card": Square,
  substitution: LogOut,
}

const knownEventColor: Record<string, string> = {
  goal: "text-foreground",
  "yellow-card": "text-yellow-500",
  "red-card": "text-destructive",
  substitution: "text-muted-foreground",
}

export function MatchTimeline({ entries, className }: MatchTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {entries.map((entry) => {
        if (entry.side === "match") {
          return (
            <li
              key={entry.id}
              className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground"
            >
              {entry.time && <span className="tabular-nums">{entry.time}</span>}
              <span>{entry.description}</span>
            </li>
          )
        }

        const Icon = knownEventIcon[entry.type] ?? CircleDot
        const color = knownEventColor[entry.type] ?? "text-muted-foreground"
        const isAway = entry.side === "away"

        return (
          <li
            key={entry.id}
            className={cn(
              "flex items-center gap-3 border-l py-2 pl-4",
              isAway && "flex-row-reverse border-r border-l-0 pr-4 pl-0 text-right"
            )}
          >
            <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">
              {entry.time}
            </span>
            <Icon className={cn("size-3.5 shrink-0", color)} />
            <span className="text-sm">{entry.description}</span>
          </li>
        )
      })}
    </ol>
  )
}
