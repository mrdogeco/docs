// Re-exported from @mrdoge/react. Every component subscribing to the same
// matchId + betTypes shares one underlying WS subscription and one copy of
// the data. Covers both pre-live and in-play odds, whichever markets are
// currently posted.
export { useOdds, type UseOddsOptions } from "@mrdoge/react"
