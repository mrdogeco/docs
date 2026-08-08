import { cn } from "@/lib/utils"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"

export interface MatchCardCompactTeam {
  name: string
  logoUrl?: string
}

export interface MatchCardCompactProps {
  home: MatchCardCompactTeam
  away: MatchCardCompactTeam
  /** Shown next to the crests. Defaults to "home vs away". */
  label?: string
  /**
   * Shown right-aligned, e.g. a score. Takes priority over `kickoff` when
   * both are set, so a live score can override the date once one exists.
   */
  info?: string
  /** Formatted and shown right-aligned when `info` isn't set, e.g. "Aug 9". No time-of-day or "today" special-casing — this is a compact identifier row, not the primary place a match's kickoff lives (that's Match Card / Match Highlight's job). */
  kickoff?: Date | string
  className?: string
}

function formatKickoff(kickoff: Date | string) {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

/**
 * A minimal match row: overlapping crests plus a label, no
 * score/status/odds. Deliberately lighter than Match Card, for contexts
 * that just need to identify a match at a glance: a dropdown item, a
 * group header. See Bet Slip's `BetSlipMatchGroup` and Match Highlight's
 * competition dropdown.
 */
export function MatchCardCompact({ home, away, label, info, kickoff, className }: MatchCardCompactProps) {
  const trailing = info ?? (kickoff ? formatKickoff(kickoff) : undefined)
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex shrink-0 gap-2">
        <EntityImage src={home.logoUrl} name={home.name} size="sm"  />
        <EntityImage src={away.logoUrl} name={away.name} size="sm" />
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label ?? `${home.name} vs ${away.name}`}</span>
      {trailing ? <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{trailing}</span> : null}
    </div>
  )
}
