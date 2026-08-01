"use client"

import { useTrendingMatches } from "@/registry/mrdoge-ui/use-trending-matches/use-trending-matches"

export function TrendingMatchesDemo() {
  const matches = useTrendingMatches({ sports: ["soccer"], limit: 5 })

  if (matches === null) {
    return <p className="text-sm text-fd-muted-foreground">Couldn't load trending matches right now.</p>
  }

  if (matches === undefined) {
    return <p className="text-sm text-fd-muted-foreground">Loading…</p>
  }

  if (matches.length === 0) {
    return <p className="text-sm text-fd-muted-foreground">Nothing trending right now.</p>
  }

  return (
    <ul className="flex w-full max-w-sm flex-col gap-2 text-sm">
      {matches.map((match) => (
        <li key={match.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
          <span className="truncate">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">{match.status}</span>
        </li>
      ))}
    </ul>
  )
}
