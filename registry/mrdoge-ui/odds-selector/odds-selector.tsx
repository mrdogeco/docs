"use client"

import { cn } from "@/lib/utils"

export type OddsMovement = "up" | "down" | "flat"

export interface OddsOption {
  id: string
  /** Selection label, e.g. "1", "X", "2" or a team name / "Draw". */
  label: string
  /** Formatted price, e.g. "1.85". */
  price: string
  movement?: OddsMovement
  suspended?: boolean
}

export interface OddsSelectorProps {
  /** Market name shown as a header above the options, e.g. "Match Result". Omit to render just the options. */
  label?: string
  options: OddsOption[]
  selectedId?: string
  /** Called with the pressed option's id, or `undefined` when pressing the already-selected option deselects it. */
  onSelect?: (id: string | undefined) => void
  /**
   * "card" (default) renders its own border/background, for standalone
   * use. "bare" drops that chrome — for embedding inside another card
   * (e.g. Match Card's odds row) without a card-in-a-card look.
   */
  variant?: "card" | "bare"
  className?: string
}

// A price shortening (going down) means the market now thinks the outcome
// is more likely — the conventional "hot" direction in real odds boards,
// shown green. Drifting (going up) means the opposite, shown red. Same
// mechanical rule regardless of market type.
const movementColor: Record<OddsMovement, string> = {
  up: "text-destructive",
  down: "text-emerald-600 dark:text-emerald-500",
  flat: "",
}

export function OddsSelector({
  label,
  options,
  selectedId,
  onSelect,
  variant = "card",
  className,
}: OddsSelectorProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden",
        variant === "card" && "rounded-xl border bg-card",
        className
      )}
    >
      {label ? (
        <div className="border-b px-3 py-2 text-sm font-medium text-card-foreground">
          {label}
        </div>
      ) : null}
      <div className="grid flex-1 auto-cols-fr grid-flow-col divide-x">
        {options.map((option) => {
          const selected = option.id === selectedId

          return (
            <button
              key={option.id}
              type="button"
              disabled={option.suspended}
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(selected ? undefined : option.id)
              }}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-2.5 transition-colors",
                selected ? "bg-primary text-primary-foreground" : "hover:bg-accent/50",
                option.suspended && "pointer-events-none opacity-50"
              )}
            >
              <span
                className={cn(
                  "max-w-full truncate text-xs",
                  selected ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                {option.label}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  !selected && !option.suspended && option.movement && movementColor[option.movement]
                )}
              >
                {option.suspended ? "—" : option.price}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
