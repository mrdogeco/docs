import "server-only"
import { MrDoge } from "@mrdoge/node"
import type { MatchDetail, Market } from "@mrdoge/protocol"

export interface ShowcaseMatch {
  match: MatchDetail
  markets: Market[]
}

// Server-only, build-time fetch for the site's "real match" showcases
// (mrdoge.co's homepage components teaser, /ui gallery) — not a live/
// runtime lookup. Each match resolves to null on its own failure (missing
// API key, network hiccup during build, tier without odds.list access) so
// one bad fetch degrades that one card to sample data instead of failing
// the whole site build.
export async function fetchShowcaseMatches(matchIds: string[]): Promise<(ShowcaseMatch | null)[]> {
  if (!process.env.MRDOGE_ODDS_API_KEY) return matchIds.map(() => null)

  const client = new MrDoge({ apiKey: process.env.MRDOGE_ODDS_API_KEY })
  try {
    return await Promise.all(
      matchIds.map(async (matchId) => {
        try {
          const [match, markets] = await Promise.all([
            client.matches.get({ id: matchId }),
            // odds.list is Business tier and separately gated — a key
            // without that access shouldn't sink the match fetch, just
            // show no odds.
            client.odds.list({ matchId }).catch(() => [] as Market[]),
          ])
          return { match, markets }
        } catch (error) {
          console.warn(`[showcase] Failed to fetch match ${matchId} at build time, falling back to sample data.`, error)
          return null
        }
      })
    )
  } finally {
    await client.close()
  }
}

export async function fetchShowcaseMatch(matchId: string): Promise<ShowcaseMatch | null> {
  const [result] = await fetchShowcaseMatches([matchId])
  return result
}
