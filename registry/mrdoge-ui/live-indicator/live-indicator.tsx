import { Clock, Pause } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type LiveIndicatorStatus =
  | "scheduled"
  | "live"
  | "paused"
  | "intermission"
  | "interrupted"
  | "finished"

export interface LiveIndicatorProps {
  status: LiveIndicatorStatus
  /** Kickoff time, shown when status is "scheduled". */
  kickoff?: Date | string
  /**
   * Elapsed match clock, shown when status is "live", "paused",
   * "intermission", or "interrupted" (e.g. "67'", "HT").
   */
  elapsed?: string
  /**
   * "badge" (default) renders a filled pill, for standalone use. "plain"
   * renders just the colored label with no background, for dense layouts
   * like Match Card's status column.
   */
  variant?: "badge" | "plain"
  /**
   * Clock format for the kickoff time.
   *
   * @defaultValue "24h"
   */
  timeFormat?: "12h" | "24h"
  className?: string
}

function formatKickoff(kickoff: Date | string, timeFormat: "12h" | "24h" = "24h") {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: timeFormat === "12h",
  })
}

function formatKickoffDate(kickoff: Date | string) {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
  })
}

const stoppedPlayLabel: Record<"paused" | "intermission" | "interrupted", string> = {
  paused: "Paused",
  intermission: "Intermission",
  interrupted: "Interrupted",
}

export function LiveIndicator({
  status,
  kickoff,
  elapsed,
  variant = "badge",
  timeFormat = "24h",
  className,
}: LiveIndicatorProps) {
  if (variant === "plain") {
    if (status === "live") {
      return (
        <span className={cn("text-xs font-bold leading-tight text-destructive tabular-nums", className)}>
          {elapsed ?? "LIVE"}
        </span>
      )
    }

    if (status === "paused" || status === "intermission" || status === "interrupted") {
      return (
        <span
          className={cn(
            "text-xs font-bold leading-tight text-amber-600 tabular-nums dark:text-amber-400",
            className
          )}
        >
          {elapsed ?? stoppedPlayLabel[status]}
        </span>
      )
    }

    if (status === "finished") {
      return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
          <span className="text-xs font-bold leading-tight text-muted-foreground tabular-nums">
            {elapsed ?? "FT"}
          </span>
          {kickoff ? (
            <span className="text-xs leading-tight text-muted-foreground tabular-nums">
              {formatKickoffDate(kickoff)}
            </span>
          ) : null}
        </div>
      )
    }

    return (
      <span className={cn("text-xs font-medium leading-tight text-muted-foreground tabular-nums", className)}>
        {kickoff ? formatKickoff(kickoff, timeFormat) : "—"}
      </span>
    )
  }

  if (status === "live") {
    return (
      <Badge
        variant="destructive"
        className={cn("gap-1.5 border-transparent bg-destructive text-destructive-foreground", className)}
      >
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive-foreground/60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-destructive-foreground" />
        </span>
        {elapsed ?? "LIVE"}
      </Badge>
    )
  }

  if (status === "paused" || status === "intermission" || status === "interrupted") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "gap-1.5 border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
          className
        )}
      >
        <Pause className="size-3" />
        {elapsed ?? stoppedPlayLabel[status]}
      </Badge>
    )
  }

  if (status === "finished") {
    return (
      <Badge variant="secondary" className={className}>
        Finished
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Clock className="size-3" />
      {kickoff ? formatKickoff(kickoff, timeFormat) : "Scheduled"}
    </Badge>
  )
}
