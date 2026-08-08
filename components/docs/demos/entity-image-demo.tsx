"use client"

import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"
import { useMatch } from "@/registry/mrdoge-ui/use-match/use-match"
import { FINISHED_MATCH_ID } from "@/components/docs/sample-data"

// Public, unauthenticated, cached CDN. Not part of the Team/Region shape
// itself; see /docs/reference/images.
function teamLogoUrl(teamId: number) {
  return `https://api.mrdoge.co/images/teams/${teamId}.png`
}

function regionLogoUrl(regionId: number) {
  return `https://api.mrdoge.co/images/regions/${regionId}.png`
}

export function EntityImageDemo() {
  const match = useMatch({ matchId: FINISHED_MATCH_ID })

  if (match === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load this match right now.</p>
  }

  if (match === undefined) {
    return (
      <div className="flex items-center gap-4">
        <span className="size-10 animate-pulse rounded-full bg-muted" />
        <span className="size-10 animate-pulse rounded-full bg-muted" />
        <span className="size-10 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <EntityImage src={teamLogoUrl(match.homeTeam.id)} name={match.homeTeam.name} size="lg"/>
      <EntityImage src={regionLogoUrl(match.region.id)} name={match.region.name} size="lg"/>
      <EntityImage src={teamLogoUrl(match.awayTeam.id)} name={match.awayTeam.name} size="lg" />
    </div>
  )
}
