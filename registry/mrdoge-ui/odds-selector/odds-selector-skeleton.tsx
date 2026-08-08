import { cn } from "@/lib/utils"

/**
 * Same DOM shape as OddsSelector's own "card" variant (label bar + button
 * grid), sized from the same text tokens (text-xs/text-sm line-heights):
 * matches the real rendered height exactly once options load, rather than
 * a guessed pixel value that drifts out of sync.
 */
export function OddsSelectorSkeleton({
  optionCount = 3,
  label = false,
  className,
}: {
  optionCount?: number
  label?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", className)}>
      {label ? (
        <div className="h-10 border-b py-2.5 pl-3 pr-2">
          <div className="flex h-5 items-center">
            <span className="h-2.5 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : null}
      <div className="grid auto-cols-fr grid-flow-col divide-x">
        {Array.from({ length: optionCount }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-0.5 px-2 py-2.5">
            <div className="flex h-4 items-center">
              <span className="h-2 w-4 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex h-5 items-center">
              <span className="h-3 w-10 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Placeholder for a lines table (one row per market, two columns per row).
 * Real row count is dynamic (however many lines a match currently has),
 * so this renders a reasonable generic count while loading rather than
 * trying to predict the exact number.
 */
export function OddsLinesSkeleton({
  rowCount = 4,
  className,
}: {
  rowCount?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", className)}>
      <div className="h-10 border-b py-2.5 pl-3 pr-2">
        <div className="flex h-5 items-center">
          <span className="h-2.5 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 divide-x">
            {Array.from({ length: 2 }).map((_, col) => (
              <div key={col} className="flex items-center justify-between gap-2 px-3 py-2.5">
                <div className="flex h-4 items-center">
                  <span className="h-2.5 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex h-5 items-center">
                  <span className="h-3 w-8 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
