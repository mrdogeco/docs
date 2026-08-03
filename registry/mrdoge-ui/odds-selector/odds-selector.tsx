"use client"

import { useState } from "react"
import { ChevronDown, LayoutGrid, SlidersHorizontal } from "lucide-react"
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

/**
 * One market rendered as a two-column row, e.g. Over/Under at a single
 * goal threshold. Use `lines` (a market per row) instead of `options` (a
 * flat row of a single market) for bet types that post one market per
 * line — see the "Multiple Lines" example.
 */
export interface OddsLine {
  id: string
  /** Short label for the line itself, e.g. "2.5" — shown above the slider in slider view. Omit if there's no natural short label. */
  label?: string
  over: OddsOption
  under: OddsOption
}

export interface OddsSelectorProps {
  /** Market name shown as a header above the options, e.g. "Match Result". Omit to render just the options. */
  label?: string
  /** A single market's selections, laid out in one row. Ignored when `lines` is set. */
  options?: OddsOption[]
  /** Id of the currently selected option — shared by `options` and `lines`, so only one selection is possible across the whole table even when it spans several rows/markets. */
  selectedId?: string
  /** Called with the pressed option's id, or `undefined` when pressing the already-selected option deselects it. */
  onSelect?: (id: string | undefined) => void
  /** Several markets, one per row — e.g. every Over/Under goal threshold stacked in one card. Takes over `options` when set; still uses `selectedId`/`onSelect`. */
  lines?: OddsLine[]
  /** Adds a header toggle to browse `lines` one at a time via a slider instead of a stacked list. No effect with fewer than 2 lines. */
  enableSliderView?: boolean
  /** Adds a header toggle to collapse the selector down to just its header. Requires `label` (or `lines`/`enableSliderView`) to have a header to put it in. */
  collapsible?: boolean
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

function OddsOptionButton({
  option,
  selected,
  onClick,
  layout,
}: {
  option: OddsOption
  selected: boolean
  onClick: () => void
  layout: "column" | "row"
}) {
  return (
    <button
      type="button"
      disabled={option.suspended}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "flex min-w-0 transition-colors",
        layout === "column"
          ? "flex-col items-center justify-center gap-0.5 px-2 py-2.5"
          : "items-center justify-between gap-2 px-3 py-2.5 text-left",
        selected ? "bg-primary text-primary-foreground" : "hover:bg-accent/50",
        option.suspended && "pointer-events-none opacity-50"
      )}
    >
      <span
        className={cn(
          "truncate text-xs",
          layout === "column" && "max-w-full",
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
}

function OddsLineRow({
  line,
  selectedId,
  onSelect,
}: {
  line: OddsLine
  selectedId: string | undefined
  onSelect: (id: string | undefined) => void
}) {
  return (
    <div className="grid grid-cols-2 divide-x">
      {[line.over, line.under].map((option) => {
        const selected = option.id === selectedId
        return (
          <OddsOptionButton
            key={option.id}
            option={option}
            layout="row"
            selected={selected}
            onClick={() => onSelect(selected ? undefined : option.id)}
          />
        )
      })}
    </div>
  )
}

// Starts the slider on the line closest to an even split (e.g. 1.90/2.00)
// rather than always the first/lowest threshold, which is often the most
// lopsided line (e.g. 1.17/4.45).
function mostBalancedIndex(lines: OddsLine[]): number {
  let bestIndex = 0
  let bestSpread = Infinity
  lines.forEach((line, i) => {
    const spread = Math.abs(parseFloat(line.over.price) - parseFloat(line.under.price))
    if (spread < bestSpread) {
      bestIndex = i
      bestSpread = spread
    }
  })
  return bestIndex
}

function OddsLinesSlider({
  lines,
  selectedId,
  onSelect,
}: {
  lines: OddsLine[]
  selectedId?: string
  onSelect?: (id: string | undefined) => void
}) {
  const [index, setIndex] = useState(() => mostBalancedIndex(lines))
  // Lines can arrive/change size as live data updates — clamp rather than
  // point past the end.
  const currentIndex = Math.min(index, lines.length - 1)
  const line = lines[currentIndex]

  return (
    <div className="flex flex-col">
      <OddsLineRow line={line} selectedId={selectedId} onSelect={(id) => onSelect?.(id)} />
      <div className="flex flex-col items-center gap-1 border-t px-3 py-3">
        {line.label ? (
          <span className="text-sm font-semibold text-card-foreground">{line.label}</span>
        ) : null}
        <input
          type="range"
          min={0}
          max={lines.length - 1}
          step={1}
          value={currentIndex}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-full cursor-pointer accent-primary"
          aria-label="Select line"
        />
      </div>
    </div>
  )
}

export function OddsSelector({
  label,
  options = [],
  lines,
  selectedId,
  onSelect,
  enableSliderView = false,
  collapsible = false,
  variant = "card",
  className,
}: OddsSelectorProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [linesView, setLinesView] = useState<"list" | "slider">("list")
  const showLinesToggle = Boolean(lines && lines.length > 1 && enableSliderView)
  const showHeader = Boolean(label) || showLinesToggle || collapsible

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden",
        variant === "card" && "rounded-xl border bg-card",
        className
      )}
    >
      {showHeader ? (
        <div
          className={cn(
            "flex h-10 items-center justify-between gap-2 py-2 pl-3 pr-2 border-b",
            collapsed && "border-b-transparent"
          )}
        >
          <span className="truncate text-sm font-medium text-card-foreground">{label}</span>
          <div className="flex items-center gap-1">
            {showLinesToggle ? (
              <div className="flex items-center gap-1 rounded-md border p-0.5">
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={linesView === "list"}
                  onClick={() => setLinesView("list")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    linesView === "list"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Slider view"
                  aria-pressed={linesView === "slider"}
                  onClick={() => setLinesView("slider")}
                  className={cn(
                    "rounded p-1 transition-colors",
                    linesView === "slider"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
            ) : null}
            {collapsible ? (
              <button
                type="button"
                aria-label={collapsed ? "Expand" : "Collapse"}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed((c) => !c)}
                className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronDown className={cn("size-3.5 transition-transform", collapsed && "-rotate-90")} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {!collapsed &&
        (lines ? (
          showLinesToggle && linesView === "slider" ? (
            <OddsLinesSlider lines={lines} selectedId={selectedId} onSelect={onSelect} />
          ) : (
            <div className="divide-y">
              {lines.map((line) => (
                <OddsLineRow
                  key={line.id}
                  line={line}
                  selectedId={selectedId}
                  onSelect={(id) => onSelect?.(id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="grid flex-1 auto-cols-fr grid-flow-col divide-x">
            {options.map((option) => {
              const selected = option.id === selectedId
              return (
                <OddsOptionButton
                  key={option.id}
                  option={option}
                  layout="column"
                  selected={selected}
                  onClick={() => onSelect?.(selected ? undefined : option.id)}
                />
              )
            })}
          </div>
        ))}
    </div>
  )
}
