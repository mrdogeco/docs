"use client"

import { useMemo, useState } from "react"
import type { Match } from "@mrdoge/protocol"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EntityImage } from "@/registry/mrdoge-ui/entity-image/entity-image"
import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"
import { useRegions } from "@/registry/mrdoge-ui/use-regions/use-regions"
import { useMatches } from "@/registry/mrdoge-ui/use-matches/use-matches"
import { useLiveMatches } from "@/registry/mrdoge-ui/use-live-matches/use-live-matches"
import { matchToMatchCardProps } from "@/lib/mrdoge-adapters/match-card"

export interface MatchesFeedProps {
  /** Restrict to specific sports, e.g. ["soccer"]. Omit for all sports. */
  sports?: string[]
  className?: string
}

// Simulated Reality League — a 24/7 virtual competition, not a real match.
const EXCLUDED_REGION_IDS = new Set([733])

// Public, unauthenticated, cached CDN — not part of the Region shape itself.
function regionLogoUrl(regionId: number) {
  return `https://api.mrdoge.co/images/regions/${regionId}.png`
}

// Only fetches once its region is actually open — regions.list() already
// gave the count for the closed state, so there's nothing to fetch until
// then.
function RegionMatches({
  regionId,
  sports,
  date,
  timezone,
}: {
  regionId: number
  sports?: string[]
  date: string
  timezone: string
}) {
  // No status filter here would silently exclude completed matches,
  // undercounting against regions.list()'s eventCount.
  const matches = useMatches({
    regionIds: [regionId],
    date,
    timezone,
    sports,
    status: ["upcoming", "live", "completed"],
    limit: 100,
  })

  // useMatches never carries live stats (score/clock) — patch those in
  // for whichever of the above are currently live.
  const liveMatches = useLiveMatches({ sports, regionIds: [regionId] })

  const merged = useMemo(() => {
    if (!matches || !liveMatches) return matches
    const liveById = new Map(liveMatches.map((m) => [m.id, m]))
    return matches.map((m) => {
      if (m.status !== "live") return m
      const live = liveById.get(m.id)
      if (live) return live
      // match.del only carries the id, not a final state — a live match
      // that's no longer in the live snapshot has finished.
      return { ...m, status: "completed" as const }
    })
  }, [matches, liveMatches])

  const groups = useMemo(() => {
    const map = new Map<number, { name: string; matches: Match[] }>()
    for (const match of merged ?? []) {
      const key = match.competition.id
      if (!map.has(key)) map.set(key, { name: match.competition.name, matches: [] })
      map.get(key)!.matches.push(match)
    }
    return Array.from(map.values())
  }, [merged])

  if (matches === undefined) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <MatchCard key={i} loading className="w-full" />
        ))}
      </div>
    )
  }

  if (matches === null || matches.length === 0) {
    return <p className="text-sm text-muted-foreground">No matches in this region today.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group.name} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">{group.name}</span>
          {group.matches.map((match) => (
            <MatchCard key={match.id} {...matchToMatchCardProps(match)} className="w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Today's matches (the viewer's own timezone), grouped by region — an
 * accordion per region, competition sub-groups inside once opened. Owns
 * its own data-fetching via the Mr. Doge SDK (`useRegions`/`useMatches`),
 * unlike the rest of mrdoge-ui's plain-props components.
 */
export function MatchesFeed({ sports, className }: MatchesFeedProps) {
  const today = new Date().toLocaleDateString("en-CA")
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const regions = useRegions({ sports, date: today, timezone })
  const [openRegions, setOpenRegions] = useState<string[]>([])

  if (regions === undefined) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  const withMatches = (regions ?? [])
    .filter((region) => (region.eventCount ?? 0) > 0 && !EXCLUDED_REGION_IDS.has(region.id))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (withMatches.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>No matches today.</p>
  }

  return (
    <Accordion type="multiple" value={openRegions} onValueChange={setOpenRegions} className={className}>
      {withMatches.map((region) => (
        <AccordionItem key={region.id} value={String(region.id)}>
          <AccordionTrigger>
            <div className="flex flex-1 items-center justify-between gap-2 pr-2">
              <span className="flex min-w-0 items-center gap-2">
                <EntityImage src={regionLogoUrl(region.id)} name={region.name} size="sm" />
                <span className="truncate">{region.name}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{region.eventCount}</span>
            </div>
          </AccordionTrigger>
          {/* h-auto — default height is locked at open-animation time, before the async match list grows past the skeleton. */}
          <AccordionContent className="h-auto">
            {openRegions.includes(String(region.id)) ? (
              <RegionMatches regionId={region.id} sports={sports} date={today} timezone={timezone} />
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
