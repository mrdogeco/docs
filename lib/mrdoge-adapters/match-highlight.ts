import type { Match, MatchDetail } from "@mrdoge/protocol"
import type { MatchHighlightCompetitionMatch, MatchHighlightDataProps } from "@/registry/mrdoge-ui/match-highlight/match-highlight"

// Public, unauthenticated, cached CDN. Not part of the Team/Region shape
// itself. See /docs/reference/images.
function teamLogoUrl(teamId: number) {
  return `https://api.mrdoge.co/images/teams/${teamId}.png`
}

function regionLogoUrl(regionId: number) {
  return `https://api.mrdoge.co/images/regions/${regionId}.png`
}

/**
 * Maps a real `matches.get()` / `matches.subscribe()` response to Match
 * Highlight's props. If the SDK's shape changes, this fails to compile.
 *
 * Cards and corners are soccer-specific. MatchStats is a discriminated
 * union per sport, so this narrows before reading them; other sports get
 * no stats row at all rather than misleading zeros.
 *
 * Doesn't populate `competitionMatches`/`onOpenCompetitionMatches`/
 * `onSelectCompetitionMatch`: those need a live query for "other matches
 * today in this competition", which a single-match adapter can't run on
 * its own. Add them at the call site (see the demo).
 */
export function matchToMatchHighlightProps(match: MatchDetail): MatchHighlightDataProps {
  const stats = match.stats?.sport === "soccer" ? match.stats : undefined
  const clock = match.stats?.clock

  return {
    status: match.status,
    competition: match.competition.name,
    region: { name: match.region.name, logoUrl: regionLogoUrl(match.region.id) },
    kickoff: match.startTime,
    home: {
      name: match.homeTeam.name,
      logoUrl: teamLogoUrl(match.homeTeam.id),
      yellowCards: stats?.homeYellowCards,
      redCards: stats?.homeRedCards,
      corners: stats?.homeCorners,
    },
    away: {
      name: match.awayTeam.name,
      logoUrl: teamLogoUrl(match.awayTeam.id),
      yellowCards: stats?.awayYellowCards,
      redCards: stats?.awayRedCards,
      corners: stats?.awayCorners,
    },
    homeScore: match.stats?.homeScore,
    awayScore: match.stats?.awayScore,
    clock: clock
      ? {
          state: clock.state,
          display: clock.display,
          displayLong: clock.displayLong,
          elapsedSeconds: clock.elapsedSeconds,
          referenceTime: clock.referenceTime,
          minute: clock.minute,
          stoppage: clock.stoppage,
        }
      : undefined,
  }
}

function toCompetitionMatchInfo(match: Match): string | undefined {
  if (match.status === "upcoming") {
    return new Date(match.startTime).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: false })
  }
  if (match.stats?.homeScore != null && match.stats?.awayScore != null) {
    return `${match.stats.homeScore}-${match.stats.awayScore}`
  }
  return undefined
}

/**
 * Maps a real `matches.list({ competitionIds: [...], date })` response
 * onto Match Highlight's `competitionMatches` prop: excludes the match
 * you're already viewing and sorts by kickoff time. Pure mapping only;
 * running that query lazily (e.g. only once the dropdown first opens) is
 * the caller's job. See the demo.
 */
export function matchesToCompetitionMatches(matches: Match[], excludeMatchId: string): MatchHighlightCompetitionMatch[] {
  return matches
    .filter((match) => match.id !== excludeMatchId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map((match) => ({
      id: match.id,
      home: { name: match.homeTeam.name, logoUrl: teamLogoUrl(match.homeTeam.id) },
      away: { name: match.awayTeam.name, logoUrl: teamLogoUrl(match.awayTeam.id) },
      info: toCompetitionMatchInfo(match),
    }))
}
