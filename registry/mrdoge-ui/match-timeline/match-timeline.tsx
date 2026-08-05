import { CircleDot, Square } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

// No icon library (lucide, react-icons' many families included) has an
// actual goal-post/net icon — closest hits are all just soccer balls.
// A small custom one, matching lucide's own stroke conventions
// (currentColor, 2px stroke, round caps) so it blends in next to
// CircleDot/Square above.
function GoalPostIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 3v16" />
      <path d="M19 3v16" />
      <path d="M5 3h14" />
      <path d="M5 3l5 5" />
      <path d="M19 3l-5 5" />
    </svg>
  )
}

export interface MatchTimelineEntry {
  id: string
  /**
   * Pre-formatted time label, e.g. "45+2'", "90+3'". Not every sport has a
   * meaningful running clock, so this is a string the caller formats
   * rather than a raw minute count — omit when there's none.
   */
  time?: string
  /**
   * Event kind — open string, sport-specific (e.g. "goal", "yellow-card").
   * Unrecognized types get a generic marker rather than being rejected,
   * since new event types can appear without warning.
   */
  type: string
  side: "home" | "away" | "match"
  description: string
  /** Goal-type events only — renders a running score pill instead of plain text. */
  score?: { home: number; away: number }
  /** "match"-side entries only — colors the divider red instead of muted, for the current live period. */
  live?: boolean
}

export interface MatchTimelineProps {
  /** Entries ordered most-recent-first. */
  entries: MatchTimelineEntry[]
  className?: string
}

const knownEventIcon: Record<string, ComponentType<{ className?: string }>> = {
  goal: CircleDot,
  "own-goal": CircleDot,
  "yellow-card": Square,
  "red-card": Square,
  penalty: GoalPostIcon,
}

const knownEventColor: Record<string, string> = {
  goal: "text-foreground",
  "own-goal": "text-destructive",
  "yellow-card": "fill-current text-yellow-500",
  "red-card": "fill-current text-destructive",
  penalty: "text-muted-foreground",
}

export function MatchTimelineSkeleton({ rowCount = 4, className }: { rowCount?: number; className?: string }) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <li
          key={index}
          className={cn("flex items-center gap-3 border-l py-2 pl-4", index % 2 === 1 && "flex-row-reverse border-r border-l-0 pr-4 pl-0")}
        >
          {/* h-4, not h-3 — matches text-xs' real 1rem line-height, not just its font-size */}
          <span className="h-4 w-6 shrink-0 animate-pulse rounded bg-muted" />
          <span className="size-3.5 shrink-0 animate-pulse rounded-full bg-muted" />
          {/* h-5, not h-3 — matches text-sm's real 1.25rem line-height, not just its font-size */}
          <span className="h-5 w-32 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ol>
  )
}

export function MatchTimeline({ entries, className }: MatchTimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {entries.map((entry) => {
        if (entry.side === "match") {
          return (
            <li key={entry.id} className="flex items-center gap-3 py-3">
              <span className={cn("h-px flex-1", entry.live ? "bg-destructive/40" : "bg-border")} />
              <span
                className={cn(
                  "shrink-0 text-xs font-semibold tabular-nums",
                  entry.live ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {entry.description}
              </span>
              <span className={cn("h-px flex-1", entry.live ? "bg-destructive/40" : "bg-border")} />
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
            <span className="w-6 shrink-0 text-xs tabular-nums text-muted-foreground">{entry.time}</span>
            <Icon className={cn("size-3.5 shrink-0", color)} />
            {entry.score ? (
              <span className="flex shrink-0 items-center rounded-full border border-blue-500 px-2 py-0.5 text-sm font-bold tabular-nums text-blue-600 dark:text-blue-400">
                {entry.score.home} - {entry.score.away}
              </span>
            ) : null}
            <span className="text-sm">{entry.description}</span>
          </li>
        )
      })}
    </ol>
  )
}
