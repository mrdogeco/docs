import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Market } from "@mrdoge/protocol"
import { useOddsMovement } from "./use-odds-movement"

function market(prices: Record<string, number>): Market {
  return {
    id: "market-1",
    betType: "SOCCER_MATCH_RESULT",
    displayName: "Match Result",
    lines: Object.entries(prices).map(([id, price]) => ({
      id,
      code: id,
      caption: null,
      price,
      isAvailable: true,
    })),
  }
}

describe("useOddsMovement", () => {
  it("returns an empty object when there is no market", () => {
    const { result } = renderHook(() => useOddsMovement(undefined))
    expect(result.current).toEqual({})
  })

  it("has no entries for the first snapshot it sees", () => {
    const { result } = renderHook(() => useOddsMovement(market({ home: 1.85, draw: 3.4 })))
    expect(result.current).toEqual({})
  })

  it("marks a price increase as up and a decrease as down, leaving unchanged prices out", () => {
    const { result, rerender } = renderHook(({ m }) => useOddsMovement(m), {
      initialProps: { m: market({ home: 1.85, draw: 3.4, away: 4.2 }) },
    })

    rerender({ m: market({ home: 2.1, draw: 3.4, away: 3.9 }) })

    expect(result.current).toEqual({ home: "up", away: "down" })
  })

  it("has no entry for an item id seen for the first time on a later snapshot", () => {
    const { result, rerender } = renderHook(({ m }) => useOddsMovement(m), {
      initialProps: { m: market({ home: 1.85 }) },
    })

    rerender({ m: market({ home: 2.1, draw: 3.4 }) })

    expect(result.current).toEqual({ home: "up" })
  })
})
