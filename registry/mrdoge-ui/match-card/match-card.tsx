"use client"

import { cn } from "@/lib/utils"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"
import {
  LiveIndicator,
  type LiveIndicatorStatus,
} from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import {
  OddsSelector,
  type OddsOption,
} from "@/registry/mrdoge-ui/odds-selector/odds-selector"

export interface MatchCardTeam {
  name: string
  logoUrl?: string
  /** Shown as a small red-card marker (position set by MatchCardProps.redCardPosition) once the match is live or finished. */
  redCards?: number
}

export interface MatchCardOdds {
  /**
   * Market name, e.g. "Match Result". Not rendered — Match Card's odds
   * area is narrow (especially the row variant), so there's no room for
   * a header without pushing the card's height up. Kept on the type in
   * case a future layout has space for it.
   */
  market: string
  options: OddsOption[]
}

export interface MatchCardDataProps {
  loading?: false
  status: LiveIndicatorStatus
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
  /**
   * Where the odds card renders: "bottom" (default, stacked) or "right"
   * (stays a single row — better for wide/desktop layouts).
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
  className?: string
}

export type MatchCardProps = MatchCardDataProps | MatchCardLoadingProps

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

/**
 * Matches MatchCard's real dimensions exactly, so nothing shifts when
 * live data arrives. Exported separately too, for a loading list of
 * several cards before any of them have data yet.
 */
export function MatchCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full rounded-xl border bg-card text-card-foreground", className)}>
      <div className="flex gap-3 px-3 py-3">
        <div className="flex w-11 shrink-0 items-center justify-center border-r pr-3">
          <span className="h-3 w-7 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <TeamRowSkeleton nameWidth="w-24" />
          <TeamRowSkeleton nameWidth="w-20" />
        </div>
      </div>
    </div>
  )
}

export function MatchCard(props: MatchCardProps) {
  if (props.loading) {
    return <MatchCardSkeleton className={props.className} />
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
  const isRow = hasOdds && oddsPosition === "right"

  const oddsCard = hasOdds ? (
    <OddsSelector
      variant="bare"
      options={odds!.options}
      selectedId={selectedOddsId}
      onSelect={onSelectOdds}
      className="w-full"
    />
  ) : null

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-card text-card-foreground",
        isRow && "flex items-stretch",
        className
      )}
    >
      <div className={cn("flex flex-1 gap-3 px-3 py-3", isRow && "min-w-0")}>
        <div className="flex w-11 shrink-0 items-center justify-center border-r pr-3 text-center">
          <LiveIndicator
            variant="plain"
            status={status}
            kickoff={kickoff}
            elapsed={elapsed}
            timeFormat={timeFormat}
          />
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
      {hasOdds ? (
        isRow ? (
          <div className="flex w-64 shrink-0 border-l">{oddsCard}</div>
        ) : (
          <div className="border-t">{oddsCard}</div>
        )
      ) : null}
    </div>
  )
}
