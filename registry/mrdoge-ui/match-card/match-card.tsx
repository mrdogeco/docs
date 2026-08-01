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

export interface MatchCardProps {
  status: LiveIndicatorStatus
  kickoff?: Date | string
  elapsed?: string
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
  /** Renders a compact odds row below the match when provided. */
  odds?: OddsOption[]
  selectedOddsId?: string
  onSelectOdds?: (id: string) => void
  className?: string
}

function RedCardIndicator({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {count > 1 ? (
        <span className="text-[11px] font-bold tabular-nums text-destructive">x{count}</span>
      ) : null}
      <span className="block h-2.5 w-[7px] shrink-0 rounded-[1.5px] bg-destructive" />
    </div>
  )
}

function TeamRow({
  team,
  score,
  showScore,
  showRedCards,
  redCardPosition,
  dimmed,
}: {
  team: MatchCardTeam
  score?: number
  showScore: boolean
  showRedCards: boolean
  redCardPosition: "left" | "right"
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

export function MatchCard({
  status,
  kickoff,
  elapsed,
  home,
  away,
  homeScore,
  awayScore,
  redCardPosition = "right",
  odds,
  selectedOddsId,
  onSelectOdds,
  className,
}: MatchCardProps) {
  const showScore = status !== "scheduled"
  const showRedCards = status !== "scheduled"
  const isFinished = status === "finished"
  const hasScores = homeScore != null && awayScore != null
  const homeLost = isFinished && hasScores && homeScore < awayScore
  const awayLost = isFinished && hasScores && awayScore < homeScore

  return (
    <div className={cn("w-full rounded-xl border bg-card text-card-foreground", className)}>
      <div className="flex gap-3 px-3 py-3">
        <div className="flex w-11 shrink-0 items-center justify-center border-r pr-3 text-center">
          <LiveIndicator variant="plain" status={status} kickoff={kickoff} elapsed={elapsed} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <TeamRow
            team={home}
            score={homeScore}
            showScore={showScore}
            showRedCards={showRedCards}
            redCardPosition={redCardPosition}
            dimmed={homeLost}
          />
          <TeamRow
            team={away}
            score={awayScore}
            showScore={showScore}
            showRedCards={showRedCards}
            redCardPosition={redCardPosition}
            dimmed={awayLost}
          />
        </div>
      </div>
      {odds && odds.length > 0 ? (
        <div className="border-t px-3 py-3">
          <OddsSelector
            options={odds}
            selectedId={selectedOddsId}
            onSelect={onSelectOdds}
            className="w-full"
          />
        </div>
      ) : null}
    </div>
  )
}
