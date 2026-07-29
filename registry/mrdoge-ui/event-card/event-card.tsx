"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  LiveIndicator,
  type LiveIndicatorStatus,
} from "@/registry/mrdoge-ui/live-indicator/live-indicator"
import {
  OddsSelector,
  type OddsOption,
} from "@/registry/mrdoge-ui/odds-selector/odds-selector"

export interface EventCardTeam {
  name: string
  logoUrl?: string
}

export interface EventCardProps {
  competition: string
  status: LiveIndicatorStatus
  kickoff?: Date | string
  elapsed?: string
  home: EventCardTeam
  away: EventCardTeam
  homeScore?: number
  awayScore?: number
  odds: OddsOption[]
  selectedOddsId?: string
  onSelectOdds?: (id: string) => void
  className?: string
}

function TeamRow({
  team,
  score,
  showScore,
}: {
  team: EventCardTeam
  score?: number
  showScore: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar size="sm" className="bg-muted">
          <AvatarImage src={team.logoUrl} alt={team.name} />
          <AvatarFallback>{team.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium">{team.name}</span>
      </div>
      {showScore ? (
        <span className="text-sm font-semibold tabular-nums">{score ?? 0}</span>
      ) : null}
    </div>
  )
}

export function EventCard({
  competition,
  status,
  kickoff,
  elapsed,
  home,
  away,
  homeScore,
  awayScore,
  odds,
  selectedOddsId,
  onSelectOdds,
  className,
}: EventCardProps) {
  const showScore = status !== "scheduled"

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader className="flex-row items-center justify-between">
        <span className="truncate text-xs text-muted-foreground">
          {competition}
        </span>
        <LiveIndicator status={status} kickoff={kickoff} elapsed={elapsed} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <TeamRow team={home} score={homeScore} showScore={showScore} />
        <TeamRow team={away} score={awayScore} showScore={showScore} />
      </CardContent>
      <CardFooter className="border-t bg-transparent pt-4">
        <OddsSelector
          options={odds}
          selectedId={selectedOddsId}
          onSelect={onSelectOdds}
          className="w-full"
        />
      </CardFooter>
    </Card>
  )
}
