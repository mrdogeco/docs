"use client"

import { cn } from "@/lib/utils"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"
import {
  OddsSelector,
  type OddsOption,
} from "@/registry/mrdoge-ui/odds-selector/odds-selector"

export type MatchCardStatus =
  | "scheduled"
  | "live"
  | "paused"
  | "intermission"
  | "interrupted"
  | "finished"

export interface MatchCardTeam {
  name: string
  logoUrl?: string
  /** Shown as a small red-card marker (position set by MatchCardProps.redCardPosition) once the match is live or finished. */
  redCards?: number
}

export interface MatchCardOdds {
  /** Market name, e.g. "Match Result". Not currently rendered. */
  market: string
  options: OddsOption[]
}

export interface MatchCardDataProps {
  loading?: false
  status: MatchCardStatus
  kickoff?: Date | string
  elapsed?: string
  /**
   * Clock format for the kickoff time.
   *
   * @defaultValue "24h"
   */
  timeFormat?: "12h" | "24h"
  home: MatchCardTeam
  away: MatchCardTeam
  homeScore?: number
  awayScore?: number
  /**
   * Where the red-card marker renders relative to each team row: "left"
   * (next to the team name) or "right" (next to the score).
   *
   * @defaultValue "right"
   */
  redCardPosition?: "left" | "right"
  /**
   * Renders a labeled odds card when provided. Any market works — Match
   * Card doesn't care which one, it just needs a name and options.
   */
  odds?: MatchCardOdds
  /** Shows a skeleton in the odds area while set. Ignored once `odds` is provided. */
  oddsLoading?: boolean
  /**
   * Where the odds card renders. Falls back to "bottom" below a `@lg`
   * (32rem) container width.
   *
   * @defaultValue "bottom"
   */
  oddsPosition?: "bottom" | "right"
  selectedOddsId?: string
  /** Called with the pressed option's id, or `undefined` when pressing the already-selected option deselects it. */
  onSelectOdds?: (id: string | undefined) => void
  className?: string
}

interface MatchCardLoadingProps {
  /** Renders a skeleton with the same dimensions instead — no other prop is needed. */
  loading: true
  /** Reserves space for an odds row/column in the skeleton too. */
  oddsLoading?: boolean
  /** Same as MatchCardDataProps.oddsPosition. */
  oddsPosition?: "bottom" | "right"
  className?: string
}

export type MatchCardProps = MatchCardDataProps | MatchCardLoadingProps

function formatKickoff(kickoff: Date | string, timeFormat: "12h" | "24h") {
  const date = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: timeFormat === "12h",
  })
}

const stoppedPlayLabel: Record<"paused" | "intermission" | "interrupted", string> = {
  paused: "Paused",
  intermission: "Intermission",
  interrupted: "Interrupted",
}

function StatusColumn({
  status,
  kickoff,
  elapsed,
  timeFormat,
}: {
  status: MatchCardStatus
  kickoff?: Date | string
  elapsed?: string
  timeFormat: "12h" | "24h"
}) {
  if (status === "live") {
    return (
      <span className="text-xs font-bold leading-tight text-destructive tabular-nums">
        {elapsed ?? "LIVE"}
      </span>
    )
  }

  if (status === "paused" || status === "intermission" || status === "interrupted") {
    return (
      <span className="text-xs font-bold leading-tight text-amber-600 tabular-nums dark:text-amber-400">
        {elapsed ?? stoppedPlayLabel[status]}
      </span>
    )
  }

  if (status === "finished") {
    return (
      <span className="text-xs font-bold leading-tight text-muted-foreground tabular-nums">
        {elapsed ?? "FT"}
      </span>
    )
  }

  return (
    <span className="text-xs font-medium leading-tight text-muted-foreground tabular-nums">
      {kickoff ? formatKickoff(kickoff, timeFormat) : "—"}
    </span>
  )
}

function RedCardIndicator({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {count > 1 ? (
        <span className="text-[11px] font-bold tabular-nums text-destructive">x{count}</span>
      ) : null}
      <span className="block h-3 w-2 shrink-0 rounded-[1.5px] bg-destructive" />
    </div>
  )
}

function TeamRow({
  team,
  score,
  showScore,
  showRedCards,
  redCardPosition,
  live,
  dimmed,
}: {
  team: MatchCardTeam
  score?: number
  showScore: boolean
  showRedCards: boolean
  redCardPosition: "left" | "right"
  /** True while the match is in progress (live/paused/intermission/interrupted) — the score reads in the live color. */
  live: boolean
  /** True for the losing side once the match is finished. */
  dimmed: boolean
}) {
  const redCard =
    showRedCards && team.redCards ? <RedCardIndicator count={team.redCards} /> : null

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <EntityImage src={team.logoUrl} name={team.name} size="sm" />
        <span className="truncate text-sm font-medium">{team.name}</span>
        {redCardPosition === "left" ? redCard : null}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {redCardPosition === "right" ? redCard : null}
        {showScore ? (
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              live && "text-destructive",
              dimmed && "text-muted-foreground"
            )}
          >
            {score ?? 0}
          </span>
        ) : null}
      </div>
    </div>
  )
}

function TeamRowSkeleton({ nameWidth }: { nameWidth: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-5 shrink-0 animate-pulse rounded-full bg-muted" />
        <span className={cn("h-3 animate-pulse rounded bg-muted", nameWidth)} />
      </div>
      <span className="h-3 w-4 shrink-0 animate-pulse rounded bg-muted" />
    </div>
  )
}

/** Same shape as OddsSelector's button grid, sized to match its real height. */
function OddsSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 auto-cols-fr grid-flow-col divide-x">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-0.5 px-2 py-2.5">
            <div className="flex h-4 items-center">
              <span className="h-2.5 w-4 animate-pulse rounded bg-muted" />
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
 * Matches MatchCard's real dimensions exactly, so nothing shifts when
 * live data arrives. Exported separately too, for a loading list of
 * several cards before any of them have data yet.
 */
export function MatchCardSkeleton({
  className,
  oddsLoading,
  oddsPosition = "bottom",
}: {
  className?: string
  oddsLoading?: boolean
  oddsPosition?: "bottom" | "right"
}) {
  const wantsRow = oddsLoading && oddsPosition === "right"

  return (
    <div
      className={cn(
        "@container w-full overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
    >
      <div className={cn(wantsRow && "@lg:flex @lg:items-stretch")}>
        <div className={cn("flex flex-1 gap-3 px-3 py-3", wantsRow && "@lg:min-w-0")}>
          <div className="flex w-11 shrink-0 items-center justify-center border-r pr-3">
            <span className="h-3 w-7 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <TeamRowSkeleton nameWidth="w-24" />
            <TeamRowSkeleton nameWidth="w-20" />
          </div>
        </div>
        {oddsLoading ? (
          <div
            className={cn(
              "border-t",
              wantsRow && "@lg:w-64 @lg:shrink-0 @lg:border-t-0 @lg:border-l"
            )}
          >
            <OddsSkeleton />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function MatchCard(props: MatchCardProps) {
  if (props.loading) {
    return (
      <MatchCardSkeleton
        className={props.className}
        oddsLoading={props.oddsLoading}
        oddsPosition={props.oddsPosition}
      />
    )
  }

  const {
    status,
    kickoff,
    elapsed,
    timeFormat = "24h",
    home,
    away,
    homeScore,
    awayScore,
    redCardPosition = "right",
    odds,
    oddsLoading,
    oddsPosition = "bottom",
    selectedOddsId,
    onSelectOdds,
    className,
  } = props

  const showScore = status !== "scheduled"
  const showRedCards = status !== "scheduled"
  const isFinished = status === "finished"
  const isLive = showScore && !isFinished
  const hasScores = homeScore != null && awayScore != null
  const homeLost = isFinished && hasScores && homeScore < awayScore
  const awayLost = isFinished && hasScores && awayScore < homeScore
  const hasOdds = Boolean(odds && odds.options.length > 0)
  const showOddsSlot = hasOdds || (oddsLoading && !odds)
  // @container below falls back to stacked under @lg regardless of oddsPosition.
  const wantsRow = showOddsSlot && oddsPosition === "right"

  const oddsCard = hasOdds ? (
    <OddsSelector
      variant="bare"
      options={odds!.options}
      selectedId={selectedOddsId}
      onSelect={onSelectOdds}
      className="w-full"
    />
  ) : showOddsSlot ? (
    <OddsSkeleton />
  ) : null

  return (
    <div
      className={cn(
        "@container w-full overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
    >
      <div className={cn(wantsRow && "@lg:flex @lg:items-stretch")}>
        <div className={cn("flex flex-1 gap-3 px-3 py-3", wantsRow && "@lg:min-w-0")}>
          <div className="flex w-11 shrink-0 items-center justify-center border-r pr-3 text-center">
            <StatusColumn status={status} kickoff={kickoff} elapsed={elapsed} timeFormat={timeFormat} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <TeamRow
              team={home}
              score={homeScore}
              showScore={showScore}
              showRedCards={showRedCards}
              redCardPosition={redCardPosition}
              live={isLive}
              dimmed={homeLost}
            />
            <TeamRow
              team={away}
              score={awayScore}
              showScore={showScore}
              showRedCards={showRedCards}
              redCardPosition={redCardPosition}
              live={isLive}
              dimmed={awayLost}
            />
          </div>
        </div>
        {showOddsSlot ? (
          <div
            className={cn(
              "border-t",
              wantsRow && "@lg:w-64 @lg:shrink-0 @lg:border-t-0 @lg:border-l"
            )}
          >
            {oddsCard}
          </div>
        ) : null}
      </div>
    </div>
  )
}
