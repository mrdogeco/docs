import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type LiveIndicatorStatus = "scheduled" | "live" | "finished"

export interface LiveIndicatorProps {
  status: LiveIndicatorStatus
  /** Kickoff time, shown when status is "scheduled". */
  kickoff?: Date | string
  /** Elapsed match clock (e.g. "67'"), shown when status is "live". */
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

// Only 3 states are representable here because that's all the underlying
// event data reliably distinguishes — don't add a "postponed"/"delayed"
// variant without a data source that can actually back it.
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
