"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Flag, Square } from "lucide-react"

import { cn } from "@/lib/utils"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"
import { MatchCardCompact, type MatchCardCompactTeam } from "@/registry/mrdoge-ui/match-card-compact/match-card-compact"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"

/** Mirrors match.status directly, no "scheduled"/"finished" relabeling. */
export type MatchHighlightStatus = "upcoming" | "live" | "completed"

export interface MatchHighlightTeam {
  name: string
  logoUrl?: string
  yellowCards?: number
  redCards?: number
  corners?: number
}

export interface MatchHighlightClock {
  /** Finer-grained than the outer `status`, which only has "live", not paused/intermission/interrupted. */
  state: "scheduled" | "live" | "paused" | "intermission" | "interrupted" | "finished"
  /** Short label, e.g. "45+2'", "HT", "FT". Used if displayLong is absent. */
  display?: string | null
  /** Verbose label meant for a detail header, e.g. "Half-time", "Full Time", "2nd Half". Preferred over `display`. */
  displayLong?: string | null
  /** Seconds elapsed as of `referenceTime`, paired together to tick a live timer client-side. Without both, falls back to `displayLong`/`display` as a static label. */
  elapsedSeconds?: number | null
  referenceTime?: string | null
  /** Running match minute (soccer), already capped at the phase max. `null` for sports without one. */
  minute?: number | null
  /** Stoppage/injury-time overflow in minutes, e.g. `3` for "45+3'". Soccer only. */
  stoppage?: number | null
}

export interface MatchHighlightRegion {
  name: string
  logoUrl?: string
}

export interface MatchHighlightCompetitionMatch {
  id: string
  home: MatchCardCompactTeam
  away: MatchCardCompactTeam
  /** Pre-formatted, e.g. "2-1" or "18:00": whatever's meaningful for that match's own status. */
  info?: string
}

export interface MatchHighlightDataProps {
  loading?: false
  status: MatchHighlightStatus
  competition?: string
  /** Shown to the left of `competition`. Omit to render the name with no flag. */
  region?: MatchHighlightRegion
  /**
   * Other matches today in the same competition. Pass together with
   * `onOpenCompetitionMatches` to turn the competition name into a
   * dropdown; omit either and it renders as plain, non-interactive text.
   * `undefined` while the dropdown is open and still loading, `null` if
   * the fetch failed or there simply aren't any.
   */
  competitionMatches?: MatchHighlightCompetitionMatch[] | null
  /** Called every time the dropdown opens; fetch `competitionMatches` lazily here rather than eagerly on every render. */
  onOpenCompetitionMatches?: () => void
  onSelectCompetitionMatch?: (matchId: string) => void
  kickoff?: Date | string
  home: MatchHighlightTeam
  away: MatchHighlightTeam
  homeScore?: number
  awayScore?: number
  clock?: MatchHighlightClock
  /** @defaultValue "24h" */
  timeFormat?: "12h" | "24h"
  className?: string
}

interface MatchHighlightLoadingProps {
  /** Renders a skeleton with the same dimensions instead; no other prop is needed. */
  loading: true
  className?: string
}

export type MatchHighlightProps = MatchHighlightDataProps | MatchHighlightLoadingProps

function formatKickoff(kickoff: Date | string, timeFormat: "12h" | "24h") {
  const parsed = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  return {
    date: parsed.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" }),
    time: parsed.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: timeFormat === "12h" }),
  }
}

// Today's kickoff time is more useful than the date; any other day, the
// date is what tells the two matches apart.
function formatFinishedDate(kickoff: Date | string, timeFormat: "12h" | "24h") {
  const parsed = typeof kickoff === "string" ? new Date(kickoff) : kickoff
  const isToday = parsed.toDateString() === new Date().toDateString()
  const { date, time } = formatKickoff(parsed, timeFormat)
  return isToday ? time : date
}

// Ticks every second from elapsedSeconds + drift since referenceTime,
// uncapped past 45/90. stoppage is a static "+N" suffix, not counted up;
// it's the ref's fixed allotment, not a live position within it.
// Falls back to a static label when not ticking (not live, or a sport
// with no continuous minute).
function useClockLabel(status: MatchHighlightStatus, clock: MatchHighlightClock | undefined): string | null {
  const canTick = status === "live" && clock?.state === "live" && clock.elapsedSeconds != null && Boolean(clock.referenceTime)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!canTick) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [canTick])

  // Once the match is really over, ignore the clock entirely: it can be
  // frozen on a stale in-progress reading (e.g. "125'" from extra time)
  // if the last push arrived right before the match ended. `status` is
  // authoritative here; the caller falls back to a plain "FT" instead.
  // Same reasoning as Match Card's own toMatchCardStatus.
  if (!clock || status === "completed") return null
  if (canTick) {
    const driftSeconds = (now - new Date(clock.referenceTime!).getTime()) / 1000
    const liveSeconds = Math.max(0, clock.elapsedSeconds! + driftSeconds)
    const seconds = Math.floor(liveSeconds % 60)
    const minutes = Math.floor(liveSeconds / 60)
    const base = `${minutes}:${String(seconds).padStart(2, "0")}`
    return clock.stoppage ? `${base} +${clock.stoppage}` : base
  }
  return clock.displayLong ?? clock.display ?? null
}

// The stats row's height is always reserved, whether or not this
// particular team actually has cards/corners to show. Otherwise two
// live matches (one with stats posted, one without) render at different
// heights, and so does the same match before/after its first stats push.
function TeamColumn({ team, showStats }: { team: MatchHighlightTeam; showStats: boolean }) {
  const hasStats = showStats && (team.yellowCards != null || team.redCards != null || team.corners != null)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <EntityImage src={team.logoUrl} name={team.name} className="size-12 @sm:size-14" />
      <span className="line-clamp-2 text-sm font-medium">{team.name}</span>
      <div className="flex h-4 items-center gap-2.5 text-xs text-muted-foreground tabular-nums">
        {hasStats ? (
          <>
            {team.yellowCards != null ? (
              <span className="flex items-center gap-1">
                <Square className="size-3 fill-yellow-500 text-yellow-500" />
                {team.yellowCards}
              </span>
            ) : null}
            {team.redCards != null ? (
              <span className="flex items-center gap-1">
                <Square className="size-3 fill-destructive text-destructive" />
                {team.redCards}
              </span>
            ) : null}
            {team.corners != null ? (
              <span className="flex items-center gap-1">
                <Flag className="size-3.5" />
                {team.corners}
              </span>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

function CompetitionMatchesSkeleton() {
  return (
    <ul className="flex flex-col gap-0.5">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-2 px-1.5 py-1">
          <div className="flex shrink-0 -space-x-1.5">
            <span className="size-5 animate-pulse rounded-full bg-muted ring-2 ring-popover" />
            <span className="size-5 animate-pulse rounded-full bg-muted ring-2 ring-popover" />
          </div>
          <span className="h-4 w-28 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  )
}

function CompetitionRow({
  competition,
  region,
  competitionMatches,
  onOpenCompetitionMatches,
  onSelectCompetitionMatch,
}: {
  competition: string
  region?: MatchHighlightRegion
  competitionMatches?: MatchHighlightCompetitionMatch[] | null
  onOpenCompetitionMatches?: () => void
  onSelectCompetitionMatch?: (matchId: string) => void
}) {
  const label = (
    <>
      {region ? <EntityImage src={region.logoUrl} name={region.name} className="size-3.5" /> : null}
      <span className="truncate">{competition}</span>
    </>
  )

  const [open, setOpen] = useState(false)

  if (!onOpenCompetitionMatches) {
    return <div className="flex items-center justify-center gap-1.5 text-center text-muted-foreground">{label}</div>
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) onOpenCompetitionMatches()
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {label}
          <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="max-h-80 overflow-y-auto">
        <PopoverTitle>{competition}</PopoverTitle>
        {competitionMatches === undefined ? (
          <CompetitionMatchesSkeleton />
        ) : competitionMatches === null || competitionMatches.length === 0 ? (
          <p className="text-xs text-muted-foreground">No other matches.</p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {competitionMatches.map((match) => (
              <li key={match.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCompetitionMatch?.(match.id)
                    setOpen(false)
                  }}
                  className="w-full cursor-pointer rounded-md px-1.5 py-1 text-left hover:bg-muted"
                >
                  <MatchCardCompact home={match.home} away={match.away} info={match.info} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}

// Mirrors the real markup row-for-row (same icon sizes, same reserved
// stats-row height) rather than approximating with generic bars, so
// there's no layout shift once real data replaces it, regardless of
// which status the match turns out to have.
export function MatchHighlightSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("@container w-full rounded-xl border bg-card p-3", className)}>
      <div className="flex items-center justify-center gap-1.5">
        <span className="size-3.5 shrink-0 animate-pulse rounded-full bg-muted" />
        {/* h-4, not h-3: matches text-xs' real 1rem line-height, not just its font-size */}
        <span className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 @sm:gap-6">
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="size-12 animate-pulse rounded-full bg-muted @sm:size-14" />
          {/* h-5, not h-3: matches text-sm's real 1.25rem line-height, not just its font-size */}
          <span className="h-5 w-16 animate-pulse rounded bg-muted" />
          <span className="h-4 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="h-8 w-14 animate-pulse rounded bg-muted @sm:h-9" />
          <span className="h-4 w-10 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <span className="size-12 animate-pulse rounded-full bg-muted @sm:size-14" />
          <span className="h-5 w-16 animate-pulse rounded bg-muted" />
          <span className="h-4 w-10 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export function MatchHighlight(props: MatchHighlightProps) {
  // Called unconditionally (rules-of-hooks) even in the loading branch,
  // which has no clock to tick yet.
  const clockLabel = useClockLabel(props.loading ? "upcoming" : props.status, props.loading ? undefined : props.clock)

  if (props.loading) {
    return <MatchHighlightSkeleton className={props.className} />
  }

  const {
    status,
    competition,
    region,
    competitionMatches,
    onOpenCompetitionMatches,
    onSelectCompetitionMatch,
    kickoff,
    home,
    away,
    homeScore,
    awayScore,
    clock,
    timeFormat = "24h",
    className,
  } = props

  const showScore = status !== "upcoming"
  const isLive = status === "live"
  const isTicking = isLive && clock?.state === "live"
  const kickoffParts = status === "upcoming" && kickoff ? formatKickoff(kickoff, timeFormat) : null

  return (
    <div className={cn("@container w-full rounded-xl border bg-card p-3 text-card-foreground", className)}>
      {competition ? (
        <div className="text-xs font-medium">
          <CompetitionRow
            competition={competition}
            region={region}
            competitionMatches={competitionMatches}
            onOpenCompetitionMatches={onOpenCompetitionMatches}
            onSelectCompetitionMatch={onSelectCompetitionMatch}
          />
        </div>
      ) : null}
      <div className="mt-3 flex items-center justify-center gap-3 @sm:gap-6">
        <TeamColumn team={home} showStats={showScore} />
        <div className="flex shrink-0 flex-col items-center gap-1">
          {showScore ? (
            <span className={cn("text-2xl font-bold tabular-nums @sm:text-3xl", isLive && "text-destructive")}>
              {homeScore ?? 0} – {awayScore ?? 0}
            </span>
          ) : null}
          {kickoffParts ? (
            <div className="flex flex-col items-center text-xs font-medium tabular-nums text-muted-foreground">
              <span>{kickoffParts.date}</span>
              <span>{kickoffParts.time}</span>
            </div>
          ) : status === "completed" ? (
            <div className="flex flex-col items-center text-xs font-medium tabular-nums text-muted-foreground">
              <span>FT</span>
              {kickoff ? <span>{formatFinishedDate(kickoff, timeFormat)}</span> : null}
            </div>
          ) : (
            <span className={cn("text-xs font-medium tabular-nums text-muted-foreground", isTicking && "text-destructive")}>
              {status === "upcoming" ? "Upcoming" : clockLabel}
            </span>
          )}
        </div>
        <TeamColumn team={away} showStats={showScore} />
      </div>
    </div>
  )
}
