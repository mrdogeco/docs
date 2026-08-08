import { CircleDot, Square } from "lucide-react"
import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

function GoalPostIcon({ className }: { className?: string }) {
  return (
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="457.338px" height="457.338px" viewBox="0 0 457.338 457.338"
      className={className}>
      <g>
        <g>
          <path d="M13.738,345.63c7.59,0,13.739-6.155,13.739-13.737V140.401c7.348,1.741,17.236,5.759,27.429,14.942
			c22.019,19.841,48.255,66.575,48.255,176.549c0,7.582,6.146,13.737,13.74,13.737c7.59,0,13.737-6.155,13.737-13.737
			c0-92.563-17.805-157.244-52.874-192.601h246.218v192.601c0,7.582,6.14,13.737,13.737,13.737c7.591,0,13.737-6.155,13.737-13.737
			V139.834c7.515,1.351,18.631,5.144,30.145,15.517c22.024,19.841,48.262,66.576,48.262,176.549c0,7.582,6.146,13.737,13.737,13.737
			c7.598,0,13.737-6.155,13.737-13.737c0-97.324-19.648-163.908-58.396-197.893c-17.909-15.715-35.87-20.514-47.484-21.841v-0.338
			h-3.734c-3.687-0.22-6.368-0.114-7.843,0H21.029c-3.689-0.22-6.376-0.114-7.843,0H0v220.08C0,339.475,6.144,345.63,13.738,345.63z
			"/>
        </g>
      </g>
    </svg>
  )
}

export interface MatchTimelineEntry {
  id: string
  /**
   * Pre-formatted time label, e.g. "45+2'", "90+3'". Not every sport has a
   * meaningful running clock, so this is a string the caller formats
   * rather than a raw minute count; omit when there's none.
   */
  time?: string
  /**
   * Event kind: open string, sport-specific (e.g. "goal", "yellow-card").
   * Unrecognized types get a generic marker rather than being rejected,
   * since new event types can appear without warning.
   */
  type: string
  side: "home" | "away" | "match"
  description: string
  /** Goal-type events only. Renders a running score pill instead of plain text. */
  score?: { home: number; away: number }
  /** "match"-side entries only. Colors the divider red instead of muted, for the current live period. */
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
          {/* h-4, not h-3: matches text-xs' real 1rem line-height, not just its font-size */}
          <span className="h-4 w-6 shrink-0 animate-pulse rounded bg-muted" />
          <span className="size-3.5 shrink-0 animate-pulse rounded-full bg-muted" />
          {/* h-5, not h-3: matches text-sm's real 1.25rem line-height, not just its font-size */}
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
