import type { MatchDetail, MatchStats } from "@mrdoge/protocol"
import type { StatsListEntry } from "@/registry/mrdoge-ui/stats-list/stats-list"

function pair(label: string, home: number | undefined, away: number | undefined, format?: (n: number) => string): StatsListEntry | null {
  if (home == null || away == null) return null
  const toText = format ?? String
  return { label, home: toText(home), away: toText(away), homeValue: home, awayValue: away }
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`
}

// Booleans (who's serving, who's in the bonus) still render as a bar —
// a full bar on whichever side is true, empty on the other — rather than
// being dropped, since every row here is a comparison bar.
function booleanPair(label: string, home: boolean | undefined, away: boolean | undefined): StatsListEntry | null {
  if (home == null && away == null) return null
  return {
    label,
    home: home ? "Yes" : "No",
    away: away ? "Yes" : "No",
    homeValue: home ? 1 : 0,
    awayValue: away ? 1 : 0,
  }
}

/**
 * Maps a real `match.stats` (from `matches.get()`/`matches.subscribe()`)
 * to Stats List's entries — a plain array, one row per available stat. If
 * the SDK's shape changes, this fails to compile.
 *
 * MatchStats is a discriminated union per sport, so this switches on
 * `stats.sport` — every branch is covered, but four sports
 * (american football, baseball, ice hockey, handball) currently have no
 * comparable home/away stats in the protocol beyond score and clock
 * (already shown elsewhere, e.g. Match Highlight), so those return an
 * empty array rather than padding the list with fields that don't exist.
 * Tennis's current-game points ("15"/"40"/"AD") aren't included — text,
 * not a number, so there's no meaningful bar for it.
 */
export function statsToStatsListEntries(stats: MatchStats | null | undefined): StatsListEntry[] {
  if (!stats) return []

  switch (stats.sport) {
    case "soccer":
      return [
        pair("Possession", stats.homePossession, stats.awayPossession, percent),
        pair("Expected Goals", stats.homeExpectedGoals, stats.awayExpectedGoals, (n) => n.toFixed(2)),
        pair("Shots", stats.homeShots, stats.awayShots),
        pair("Shots on Target", stats.homeShotsOnTarget, stats.awayShotsOnTarget),
        pair("Corners", stats.homeCorners, stats.awayCorners),
        pair("Fouls", stats.homeFouls, stats.awayFouls),
        pair("Offsides", stats.homeOffsides, stats.awayOffsides),
        pair("Yellow Cards", stats.homeYellowCards, stats.awayYellowCards),
        pair("Red Cards", stats.homeRedCards, stats.awayRedCards),
        pair("Tackles", stats.homeTackles, stats.awayTackles),
        pair("Throw-ins", stats.homeThrowIns, stats.awayThrowIns),
        pair("Goal Kicks", stats.homeGoalKicks, stats.awayGoalKicks),
        pair("Woodwork Hits", stats.homeWoodworkHits, stats.awayWoodworkHits),
        pair("Penalty Kicks", stats.homePenaltyKicks, stats.awayPenaltyKicks),
      ].filter((entry): entry is StatsListEntry => entry !== null)

    case "tennis":
      return [
        pair("Games (current set)", stats.homeGamesInCurrentSet, stats.awayGamesInCurrentSet),
        booleanPair("Serving", stats.homeServes, stats.awayServes),
      ].filter((entry): entry is StatsListEntry => entry !== null)

    case "basketball":
      return [
        pair("Fouls", stats.homeFouls, stats.awayFouls),
        booleanPair("In Bonus", stats.homeIsBonus, stats.awayIsBonus),
        booleanPair("Possession", stats.homeHasPossession, stats.awayHasPossession),
      ].filter((entry): entry is StatsListEntry => entry !== null)

    case "volleyball":
      return [booleanPair("Serving", stats.homeServes, stats.awayServes)].filter(
        (entry): entry is StatsListEntry => entry !== null
      )

    // Baseball's stats (outs, balls, strikes, bases) describe the current
    // at-bat, not a per-team count — they don't fit a home/away comparison
    // row. American football, ice hockey, and handball have no
    // sport-specific fields in the protocol at all yet.
    case "american_football":
    case "baseball":
    case "ice_hockey":
    case "handball":
      return []

    default:
      return []
  }
}

function topPlayer(players: { name: string; value: number }[] | undefined): { name: string; value: number } | null {
  if (!players || players.length === 0) return null
  return players.reduce((top, player) => (player.value > top.value ? player : top))
}

function playerPair(
  label: string,
  homePlayers: { name: string; value: number }[] | undefined,
  awayPlayers: { name: string; value: number }[] | undefined
): StatsListEntry | null {
  const home = topPlayer(homePlayers)
  const away = topPlayer(awayPlayers)
  if (!home && !away) return null
  return {
    label,
    home: home ? `${home.name} (${home.value})` : "—",
    away: away ? `${away.name} (${away.value})` : "—",
    homeValue: home?.value ?? 0,
    awayValue: away?.value ?? 0,
  }
}

/**
 * Maps a real match's per-player stat breakdowns (soccer only — the only
 * sport with per-player arrays in the protocol today) to Stats List's
 * entries: the top player per side for shots, shots on target, and
 * woodwork hits. Returns an empty array when `match.timeline` has no
 * player-attributed events (captions with a player name) — a proxy for
 * "this match doesn't have player-level tracking," since the same
 * data-provider gap that skips player names in the timeline also tends
 * to leave the per-player stat arrays empty.
 */
export function matchToPlayerStatsListEntries(match: MatchDetail): StatsListEntry[] {
  const hasPlayerInfo = (match.timeline ?? []).some((event) => event.captions.length >= 3)
  if (!hasPlayerInfo) return []

  const stats = match.stats?.sport === "soccer" ? match.stats : undefined
  if (!stats) return []

  return [
    playerPair("Shots", stats.homePlayersShots, stats.awayPlayersShots),
    playerPair("Shots on Target", stats.homePlayersShotsOnTarget, stats.awayPlayersShotsOnTarget),
    playerPair("Woodwork Hits", stats.homePlayersWoodworkHits, stats.awayPlayersWoodworkHits),
  ].filter((entry): entry is StatsListEntry => entry !== null)
}
