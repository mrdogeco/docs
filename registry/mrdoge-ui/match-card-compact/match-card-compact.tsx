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
  /** Shown right-aligned, e.g. a score or kickoff time. */
  info?: string
  className?: string
}

/**
 * A minimal match row — overlapping crests plus a label, no
 * score/status/odds. Deliberately lighter than Match Card, for contexts
 * that just need to identify a match at a glance: a dropdown item, a
 * group header. See Bet Slip's `BetSlipMatchGroup` and Match Highlight's
 * competition dropdown.
 */
export function MatchCardCompact({ home, away, label, info, className }: MatchCardCompactProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex shrink-0 -space-x-1.5">
        <EntityImage src={home.logoUrl} name={home.name} size="sm" className="ring-2 ring-card" />
        <EntityImage src={away.logoUrl} name={away.name} size="sm" className="ring-2 ring-card" />
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{label ?? `${home.name} vs ${away.name}`}</span>
      {info ? <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{info}</span> : null}
    </div>
  )
}
