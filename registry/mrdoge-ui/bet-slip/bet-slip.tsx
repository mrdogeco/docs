"use client"

import { Check, CheckCircle2, Circle, Layers, Loader2, MinusCircle, Ticket, TriangleAlert, X, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"

export interface BetSlipPick {
  id: string
  eventLabel: string
  market: string
  selection: string
  /** Decimal odds, e.g. 1.85. */
  price: number
  /** Colors the price — "down" (shortening, more likely) green, "up" (drifting, less likely) red. Static here — for live data, see useOddsMovement. */
  movement?: "up" | "down" | "flat"
  /** True once the underlying line is no longer available — dims the row and disables nothing else; removal stays a user action. */
  unavailable?: boolean
  /** Shown once per match group via BetSlipMatchGroup when both are present. */
  home?: { name: string; logoUrl?: string }
  away?: { name: string; logoUrl?: string }
  /** Match id — required (with betType/code) for conflict-checking via the Conflict Adapter, and to group picks from the same match together. */
  matchId?: string
  /** Market sysname, e.g. "SOCCER_MATCH_RESULT". */
  betType?: string
  /** Outcome code, e.g. "1", "1X", "O". */
  code?: string
  /** Parsed Over/Under threshold, when applicable. */
  threshold?: number
}

export interface BetSlipProps {
  picks: BetSlipPick[]
  onRemovePick?: (id: string) => void
  /** "single" (default) treats every pick independently. "parlay" combines them into one bet with a combined price. Only switchable once there are 2+ picks — same as sportsbooks, a parlay needs 2 legs. */
  mode?: "single" | "parlay"
  onModeChange?: (mode: "single" | "parlay") => void
  /** Parlay mode's combined stake. Controlled — BetSlip holds no state of its own. Renders (with a combined payout) only when onStakeChange is passed and mode is "parlay". */
  stake?: string
  onStakeChange?: (value: string) => void
  /** Single mode's stakes, one per pick, keyed by pick id. Rendered as its own input below each pick row; the footer becomes a read-only "Total stake" + "Potential payout" sum once onPickStakeChange is passed and mode is "single". */
  pickStakes?: Record<string, string>
  onPickStakeChange?: (id: string, value: string) => void
  /** Ids from `picks` that conflict with another pick in the slip — computed externally (e.g. via the Conflict Adapter) and rendered as a warning. BetSlip only ever flags; it has no "add pick" affordance of its own to prevent one from being added in the first place. */
  conflictingPickIds?: string[]
  /** Called when the submit button is pressed. Renders the button only when this is passed — BetSlip has no idea what "submitting" means for your product (auth and the actual request are yours; report progress back via submitState). */
  onSubmit?: () => void
  /** Overrides the button's default label ("Place parlay" in parlay mode, "Place bet" otherwise). Only applies to the idle state. */
  submitLabel?: string
  /** Disables the submit button regardless of submitState, e.g. while picks still conflict. */
  submitDisabled?: boolean
  /** "idle" (default) | "loading" | "success" | "error" — set this from your submit request's own state. Swaps the button's icon/label and disables it during "loading"/"success". */
  submitState?: "idle" | "loading" | "success" | "error"
  /** Shown above the button when submitState is "error". BetSlip has no toast/notification system of its own, so this is just a plain inline message — use your own if you have one. */
  submitError?: string
  className?: string
}

/**
 * Groups a match's crests and event label around any number of selection
 * rows for that match — picks from the same match render once here
 * instead of repeating team info per row. `BetSlip` uses this internally,
 * grouping `picks` by `matchId`; also exported for composing your own
 * layout around individual match groups.
 */
export function BetSlipMatchGroup({
  home,
  away,
  eventLabel,
  children,
}: {
  home?: { name: string; logoUrl?: string }
  away?: { name: string; logoUrl?: string }
  eventLabel: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2.5">
        {home && away ? (
          <div className="flex shrink-0 -space-x-1.5">
            <EntityImage src={home.logoUrl} name={home.name} size="sm" className="ring-2 ring-card" />
            <EntityImage src={away.logoUrl} name={away.name} size="sm" className="ring-2 ring-card" />
          </div>
        ) : null}
        <span className="truncate text-sm font-medium">{eventLabel}</span>
      </div>
      <div className="border-t">{children}</div>
    </div>
  )
}

export type BetSlipPickResult = "won" | "lost" | "push"

const resultIcon: Record<BetSlipPickResult, typeof Circle> = {
  won: CheckCircle2,
  lost: XCircle,
  push: MinusCircle,
}
const resultColor: Record<BetSlipPickResult, string> = {
  won: "text-emerald-600 dark:text-emerald-500",
  lost: "text-destructive",
  push: "text-amber-500",
}
const resultLineColor: Record<BetSlipPickResult, string> = {
  won: "bg-emerald-600/50 dark:bg-emerald-500/50",
  lost: "bg-destructive/50",
  push: "bg-amber-500/50",
}
// Same mechanical rule as OddsSelector's movementColor — a price
// shortening (down) means more likely (green), drifting (up) means less
// likely (red).
const movementColor: Record<NonNullable<BetSlipPick["movement"]>, string> = {
  up: "text-destructive",
  down: "text-emerald-600 dark:text-emerald-500",
  flat: "",
}

/**
 * One selection line within a match group — market, selection, price, and
 * a remove button. Doesn't render team/event info itself; that's
 * `BetSlipMatchGroup`'s job, shown once per match rather than once per
 * pick.
 *
 * `connected` (default true) draws a circle-and-line connector down the
 * left side between legs of the same group — pass `position`
 * ("first"/"middle"/"last", in order) alongside
 * it. Set `connected={false}` for singles, where picks from the same
 * match are still grouped but aren't one combined bet — the circle stays
 * (so removal still reads as "removing one pick"), the connecting lines
 * don't, and a divider separates rows instead. The same connector
 * doubles as a settlement indicator: pass `result` once a pick is
 * settled to swap the outline circle for a colored won/lost/push icon,
 * and `prevResult` (the previous leg's result, for the top line segment)
 * to keep the connector's color continuous between legs.
 *
 * `onStakeChange` renders this row's own stake input below the
 * selection — for singles mode, where every pick has an independent
 * stake instead of one combined amount in the footer.
 */
export function BetSlipPickRow({
  pick,
  onRemove,
  conflicting,
  position = "single",
  connected = true,
  result = null,
  prevResult = null,
  stake,
  onStakeChange,
}: {
  pick: BetSlipPick
  onRemove?: () => void
  conflicting?: boolean
  position?: "single" | "first" | "middle" | "last"
  connected?: boolean
  result?: BetSlipPickResult | null
  prevResult?: BetSlipPickResult | null
  stake?: string
  onStakeChange?: (value: string) => void
}) {
  const isFirstInGroup = position === "single" || position === "first"
  const showLineTop = connected && (position === "middle" || position === "last")
  const showLineBottom = connected && (position === "middle" || position === "first")
  const Icon = result ? resultIcon[result] : Circle
  const iconColor = result ? resultColor[result] : "text-muted-foreground"
  const topLineColor = prevResult ? resultLineColor[prevResult] : "bg-border"
  const bottomLineColor = result ? resultLineColor[result] : "bg-border"
  return (
    <div className={cn(!connected && !isFirstInGroup && "border-t", pick.unavailable && "opacity-50")}>
      <div className="flex items-stretch pr-2">
        <div className="flex w-8 shrink-0 flex-col items-center">
          <div className={cn("w-px flex-1", showLineTop ? topLineColor : "bg-transparent")} />
          <Icon className={cn("size-3 shrink-0", iconColor)} />
          <div className={cn("w-px flex-1", showLineBottom ? bottomLineColor : "bg-transparent")} />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-medium">{pick.selection}</p>
            <p className="truncate text-xs text-muted-foreground">
              {pick.market}
              {pick.unavailable ? " · No longer available" : null}
            </p>
            {conflicting ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-destructive">
                <TriangleAlert className="size-3" />
                Conflicts with another pick
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                pick.unavailable && "line-through",
                !pick.unavailable && pick.movement && movementColor[pick.movement]
              )}
            >
              {pick.price.toFixed(2)}
            </span>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove pick" onClick={onRemove}>
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
      {onStakeChange ? (
        <div className="flex items-center justify-between gap-3 px-3 pb-3">
          <label className="text-sm text-muted-foreground">Stake</label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={stake ?? ""}
            onChange={(event) => {
              const value = event.target.value
              if (/^\d*\.?\d*$/.test(value)) onStakeChange(value)
            }}
            className="h-7 w-20 text-right text-xs tabular-nums"
          />
        </div>
      ) : null}
    </div>
  )
}

// Picks that share a matchId group into one BetSlipMatchGroup; picks
// without one (hand-built, no adapter) each get their own group so
// nothing silently merges. Groups keep first-appearance order.
function groupPicksByMatch(picks: BetSlipPick[]) {
  const groups: { key: string; home?: BetSlipPick["home"]; away?: BetSlipPick["away"]; eventLabel: string; picks: BetSlipPick[] }[] = []
  const indexByKey = new Map<string, number>()

  for (const pick of picks) {
    const key = pick.matchId ?? pick.id
    const existingIndex = indexByKey.get(key)
    if (existingIndex !== undefined) {
      groups[existingIndex].picks.push(pick)
    } else {
      indexByKey.set(key, groups.length)
      groups.push({ key, home: pick.home, away: pick.away, eventLabel: pick.eventLabel, picks: [pick] })
    }
  }

  return groups
}

export function BetSlip({
  picks,
  onRemovePick,
  mode = "single",
  onModeChange,
  stake,
  onStakeChange,
  pickStakes,
  onPickStakeChange,
  conflictingPickIds,
  onSubmit,
  submitLabel,
  submitDisabled,
  submitState = "idle",
  submitError,
  className,
}: BetSlipProps) {
  // A parlay needs 2+ legs — below that there's nothing to combine, so
  // "single" is the only mode that makes sense regardless of what `mode`
  // holds (same rule real sportsbooks use).
  const effectiveMode: "single" | "parlay" = picks.length >= 2 ? mode : "single"
  const combinedPrice = picks.reduce((total, pick) => total * pick.price, 1)
  const stakeValue = Number(stake)
  const payout = stakeValue > 0 ? stakeValue * combinedPrice : 0
  const totalPickStake = picks.reduce((sum, pick) => sum + (Number(pickStakes?.[pick.id]) || 0), 0)
  const totalPickPayout = picks.reduce(
    (sum, pick) => sum + (Number(pickStakes?.[pick.id]) || 0) * pick.price,
    0
  )
  const showFooter =
    picks.length > 0 &&
    (effectiveMode === "parlay" || (effectiveMode === "single" && Boolean(onPickStakeChange)) || Boolean(onSubmit))

  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
    >
      {picks.length > 0 ? <div className="flex h-10 items-center justify-between gap-2 border-b py-2 pl-3 pr-2">
        <span className="truncate text-sm font-medium">
          {`${effectiveMode === "parlay" ? "Parlay" : "Singles"}`}
        </span>
        {picks.length >= 2 ?
          <div className="flex items-center gap-1 rounded-md border p-0.5">
            {(["single", "parlay"] as const).map((m) => {
              const Icon = m === "single" ? Ticket : Layers
              const active = effectiveMode === m
              return (
                <Button
                  key={m}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={m === "single" ? "Single bets" : "Parlay"}
                  aria-pressed={active}
                  onClick={() => onModeChange?.(m)}
                  className={cn(
                    "rounded",
                    active
                      ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </Button>
              )
            })}
          </div>
          : null}
      </div> : null}

      {picks.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 p-6 text-center">
          <Ticket className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No picks selected yet.</p>
        </div>
      ) : (
        <div className="divide-y">
          {groupPicksByMatch(picks).map((group) => (
            <BetSlipMatchGroup key={group.key} home={group.home} away={group.away} eventLabel={group.eventLabel}>
              {group.picks.map((pick, index) => (
                <BetSlipPickRow
                  key={pick.id}
                  pick={pick}
                  position={
                    group.picks.length === 1
                      ? "single"
                      : index === 0
                        ? "first"
                        : index === group.picks.length - 1
                          ? "last"
                          : "middle"
                  }
                  connected={effectiveMode === "parlay"}
                  onRemove={() => onRemovePick?.(pick.id)}
                  conflicting={conflictingPickIds?.includes(pick.id)}
                  stake={effectiveMode === "single" ? pickStakes?.[pick.id] : undefined}
                  onStakeChange={
                    effectiveMode === "single" && onPickStakeChange
                      ? (value) => onPickStakeChange(pick.id, value)
                      : undefined
                  }
                />
              ))}
            </BetSlipMatchGroup>
          ))}
        </div>
      )}

      {showFooter ? (
        <div className="flex flex-col gap-3 border-t p-3">
          {effectiveMode === "parlay" ? (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="size-3.5" />
                {picks.length} legs
              </span>
              <span className="font-semibold tabular-nums">{combinedPrice.toFixed(2)}</span>
            </div>
          ) : null}
          {effectiveMode === "parlay" && onStakeChange ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="bet-slip-stake" className="text-sm text-muted-foreground">
                  Stake
                </label>
                <Input
                  id="bet-slip-stake"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={stake ?? ""}
                  onChange={(event) => {
                    const value = event.target.value
                    if (/^\d*\.?\d*$/.test(value)) onStakeChange(value)
                  }}
                  className="w-24 text-right tabular-nums"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Potential payout</span>
                <span className="font-semibold tabular-nums">{payout.toFixed(2)}</span>
              </div>
            </>
          ) : null}
          {effectiveMode === "single" && onPickStakeChange ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total stake</span>
                <span className="font-semibold tabular-nums">{totalPickStake.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Potential payout</span>
                <span className="font-semibold tabular-nums">{totalPickPayout.toFixed(2)}</span>
              </div>
            </>
          ) : null}
          {onSubmit ? (
            <div className="flex flex-col gap-1.5">
              {submitState === "error" && submitError ? (
                <p className="text-xs text-destructive">{submitError}</p>
              ) : null}
              <Button
                type="button"
                onClick={onSubmit}
                disabled={submitDisabled || submitState === "loading" || submitState === "success"}
                className="w-full"
              >
                {submitState === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Placing...
                  </>
                ) : submitState === "success" ? (
                  <>
                    <Check className="size-4" />
                    Placed
                  </>
                ) : (
                  (submitLabel ?? (effectiveMode === "parlay" ? "Place parlay" : "Place bet"))
                )}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
