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
  className?: string
}

function formatKickoff(kickoff: Date | string) {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
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
  className,
}: LiveIndicatorProps) {
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
      {kickoff ? formatKickoff(kickoff) : "Scheduled"}
    </Badge>
  )
}
