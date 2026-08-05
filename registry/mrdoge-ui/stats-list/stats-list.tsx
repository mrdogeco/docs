import { cn } from "@/lib/utils"

export interface StatsListEntry {
  label: string
  /** Pre-formatted for display, e.g. "62%", "14", "Yamal (3)". */
  home: string
  away: string
  /** Raw numeric values for the two sides — every row is a comparison bar, sized from these. */
  homeValue: number
  awayValue: number
}

export interface StatsListProps {
  /** Rows in display order. Sport-specific — see the adapter for which stats each sport contributes. */
  entries: StatsListEntry[]
  /**
   * Omits the comparison bar under every row, keeping just the numbers
   * and label — for entries where the two sides aren't a meaningful
   * proportional split, e.g. two different players' individual totals.
   *
   * @defaultValue true
   */
  showBars?: boolean
  className?: string
}

function StatsListRow({ entry, showBar }: { entry: StatsListEntry; showBar: boolean }) {
  const total = entry.homeValue + entry.awayValue
  const homeShare = total > 0 ? (entry.homeValue / total) * 100 : 0
  const awayShare = total > 0 ? (entry.awayValue / total) * 100 : 0
  const homeLeading = entry.homeValue > entry.awayValue
  const awayLeading = entry.awayValue > entry.homeValue

  return (
    <li className="flex flex-col gap-1.5 py-2.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={cn("tabular-nums", homeLeading ? "font-semibold" : "text-muted-foreground")}>
          {entry.home}
        </span>
        <span className="text-xs text-muted-foreground">{entry.label}</span>
        <span className={cn("tabular-nums", awayLeading ? "font-semibold" : "text-muted-foreground")}>
          {entry.away}
        </span>
      </div>
      {showBar ? (
        <div className="flex items-center gap-1">
          <div className="flex flex-1 justify-end">
            <div
              className={cn(
                "h-1 rounded-full transition-[width] duration-300",
                total === 0 ? "invisible" : homeLeading ? "bg-foreground" : "bg-muted-foreground/25"
              )}
              style={{ width: `${homeShare}%` }}
            />
          </div>
          <div className="flex flex-1 justify-start">
            <div
              className={cn(
                "h-1 rounded-full transition-[width] duration-300",
                total === 0 ? "invisible" : awayLeading ? "bg-foreground" : "bg-muted-foreground/25"
              )}
              style={{ width: `${awayShare}%` }}
            />
          </div>
        </div>
      ) : null}
    </li>
  )
}

export function StatsListSkeleton({ rowCount = 4, className }: { rowCount?: number; className?: string }) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <li key={index} className="flex flex-col gap-1.5 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* h-5, not h-3 — matches text-sm's real 1.25rem line-height, not just its font-size */}
            <span className="h-5 w-6 animate-pulse rounded bg-muted" />
            {/* h-4, not h-3 — matches text-xs' real 1rem line-height, not just its font-size */}
            <span className="h-4 w-24 animate-pulse rounded bg-muted" />
            <span className="h-5 w-6 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 flex-1 animate-pulse rounded-full bg-muted" />
            <div className="h-1 flex-1 animate-pulse rounded-full bg-muted" />
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Renders nothing when `entries` is empty — same convention as Match Timeline, leaves messaging (e.g. "no stats for this match") to the caller, since only the caller knows why. */
export function StatsList({ entries, showBars = true, className }: StatsListProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {entries.map((entry, index) => (
        <StatsListRow key={index} entry={entry} showBar={showBars} />
      ))}
    </ul>
  )
}
