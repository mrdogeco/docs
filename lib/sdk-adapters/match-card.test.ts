import { describe, expect, it } from "vitest"
import type { Market, MatchDetail, SoccerStats } from "@mrdoge/protocol"
import { matchToMatchCardProps, toMarketLabel, toOddsOptions } from "./match-card"

function soccerStats(overrides: Partial<SoccerStats> = {}): SoccerStats {
  return {
    sport: "soccer",
    clock: null,
    homeScore: 0,
    awayScore: 0,
    ...overrides,
  }
}

function baseMatch(overrides: Partial<MatchDetail> = {}): MatchDetail {
  return {
    id: "match-1",
    startTime: "2026-08-01T19:00:00Z",
    status: "upcoming",
    homeTeam: { id: 1, name: "Palmeiras" },
    awayTeam: { id: 2, name: "Flamengo" },
    sport: { id: 1, name: "Soccer" },
    competition: { id: 1, name: "Brasileirão Série A" },
    region: { id: 1, name: "Brazil" },
    ...overrides,
  }
}

function market(overrides: Partial<Market> = {}): Market {
  return {
    id: "market-1",
    betType: "SOCCER_MATCH_RESULT",
    displayName: "Match Result",
    betItems: [
      { id: "home", code: "1", caption: null, price: 1.85, isAvailable: true },
      { id: "draw", code: "X", caption: null, price: 3.4, isAvailable: true },
      { id: "away", code: "2", caption: "Flamengo", price: 4.2, isAvailable: false },
    ],
    ...overrides,
  }
}

describe("toOddsOptions", () => {
  it("returns an empty array when market is missing", () => {
    expect(toOddsOptions(undefined)).toEqual([])
  })

  it("labels with caption by default, falling back to code", () => {
    const options = toOddsOptions(market())
    expect(options.map((o) => o.label)).toEqual(["1", "X", "Flamengo"])
  })

  it("labels with code when labelFrom is code", () => {
    const options = toOddsOptions(market(), { labelFrom: "code" })
    expect(options.map((o) => o.label)).toEqual(["1", "X", "2"])
  })

  it("formats price to two decimals and flags unavailable items as suspended", () => {
    const options = toOddsOptions(market())
    expect(options).toEqual([
      { id: "home", label: "1", price: "1.85", suspended: false, movement: undefined },
      { id: "draw", label: "X", price: "3.40", suspended: false, movement: undefined },
      { id: "away", label: "Flamengo", price: "4.20", suspended: true, movement: undefined },
    ])
  })

  it("applies movementById per item id, leaving unlisted items undefined", () => {
    const options = toOddsOptions(market(), { movementById: { home: "up", draw: "down" } })
    expect(options.map((o) => o.movement)).toEqual(["up", "down", undefined])
  })
})

describe("toMarketLabel", () => {
  it("splits underscores and title-cases each word", () => {
    expect(toMarketLabel("SOCCER_MATCH_RESULT")).toBe("Soccer Match Result")
  })

  it("title-cases a single word with no underscores", () => {
    expect(toMarketLabel("HANDICAP")).toBe("Handicap")
  })
})

describe("matchToMatchCardProps", () => {
  it("maps upcoming status to scheduled", () => {
    const props = matchToMatchCardProps(baseMatch({ status: "upcoming" }))
    expect(props.status).toBe("scheduled")
  })

  it("maps completed status to finished", () => {
    const props = matchToMatchCardProps(baseMatch({ status: "completed", stats: soccerStats() }))
    expect(props.status).toBe("finished")
  })

  it("uses clock.state while live", () => {
    const props = matchToMatchCardProps(
      baseMatch({ status: "live", stats: soccerStats({ clock: { ...soccerStats().clock, state: "paused" } as never }) })
    )
    expect(props.status).toBe("paused")
  })

  it("falls back to live when clock is null", () => {
    const props = matchToMatchCardProps(baseMatch({ status: "live", stats: soccerStats({ clock: null }) }))
    expect(props.status).toBe("live")
  })

  it("only carries the elapsed clock display while match.status is live", () => {
    const finished = matchToMatchCardProps(
      baseMatch({
        status: "completed",
        stats: soccerStats({
          clock: {
            phase: null,
            state: "finished",
            display: "90+5'",
            displayLong: null,
            elapsedSeconds: null,
            remainingSeconds: null,
            periodDurationSeconds: null,
            minute: null,
            stoppage: null,
            referenceTime: null,
          },
        }),
      })
    )
    expect(finished.elapsed).toBeUndefined()
  })

  it("builds team logo URLs from the team id", () => {
    const props = matchToMatchCardProps(baseMatch())
    expect(props.home.logoUrl).toBe("https://api.mrdoge.co/images/teams/1.png")
    expect(props.away.logoUrl).toBe("https://api.mrdoge.co/images/teams/2.png")
  })

  it("carries red cards only for soccer stats", () => {
    const withCards = matchToMatchCardProps(
      baseMatch({ status: "live", stats: soccerStats({ homeRedCards: 1, awayRedCards: 0 }) })
    )
    expect(withCards.home.redCards).toBe(1)

    const noStats = matchToMatchCardProps(baseMatch({ status: "upcoming" }))
    expect(noStats.home.redCards).toBeUndefined()
  })

  it("omits odds when no market is passed, includes them when one is", () => {
    const withoutMarket = matchToMatchCardProps(baseMatch())
    expect(withoutMarket.odds).toBeUndefined()

    const withMarket = matchToMatchCardProps(baseMatch(), market())
    expect(withMarket.odds?.market).toBe("Soccer Match Result")
    expect(withMarket.odds?.options).toHaveLength(3)
  })
})
