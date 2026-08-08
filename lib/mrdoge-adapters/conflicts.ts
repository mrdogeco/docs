import type { Market } from "@mrdoge/protocol"
import type { BetSlipPick } from "@/registry/mrdoge-ui/bet-slip/bet-slip"

export interface ConflictCandidate {
  id: string
  matchId: string
  /** Market sysname, e.g. "SOCCER_UNDER_OVER". */
  betType: string
  /** Outcome code, e.g. "O", "1X". */
  code: string
  /** Parsed Over/Under threshold; only set when `code` is "O"/"U". */
  threshold?: number
}

const MATCH_RESULT_TYPES = ["SOCCER_MATCH_RESULT", "SOCCER_MATCH_RESULT_PRELIVE"]
const DOUBLE_CHANCE = "SOCCER_DOUBLE_CHANCE"
const TOTALS = ["SOCCER_UNDER_OVER", "SOCCER_UNDER_OVER_PRELIVE"]
const BTTS = ["SOCCER_BOTH_TEAMS_TO_SCORE", "SOCCER_BOTH_TEAMS_TO_SCORE_PRELIVE"]
const BTTS_YES_CODES = ["Y", "GG"]

// Over/Under outcomes only carry a generic "O"/"U" code, no threshold in
// it. The threshold lives in the caption instead ("Over 1.5", "Under
// 1.5"), so that's what has to be parsed to compare thresholds.
function parseThreshold(caption: string | null | undefined): number | undefined {
  const match = caption?.match(/[\d.]+/)
  const value = match ? parseFloat(match[0]) : NaN
  return Number.isNaN(value) ? undefined : value
}

/**
 * Flattens every line of every market for one match into conflict
 * candidates, parsing an Over/Under threshold from the caption where
 * applicable.
 */
export function toConflictCandidates(matchId: string, markets: Market[]): ConflictCandidate[] {
  const candidates: ConflictCandidate[] = []
  for (const market of markets) {
    for (const line of market.lines) {
      const isTotals = line.code.startsWith("O") || line.code.startsWith("U")
      candidates.push({
        id: line.id,
        matchId,
        betType: market.betType,
        code: line.code,
        threshold: isTotals ? parseThreshold(line.caption) : undefined,
      })
    }
  }
  return candidates
}

// Pairwise incompatibility check: the three rule families this adapter
// knows about. Symmetric: conflicts(a, b) === conflicts(b, a).
function conflicts(a: ConflictCandidate, b: ConflictCandidate): boolean {
  if (a.matchId !== b.matchId) return false

  // Double Chance is just two of Match Result's three outcomes combined:
  // the two markets describe overlapping information about the same
  // result, not independent events. Even a "compatible" pair (Home win +
  // "Home or Away") is a wasted leg, not a real parlay combination, so
  // any Match Result selection blocks the entire Double Chance market and
  // vice versa, not just the specific pairs that are outright impossible.
  const isMrDcPair =
    (MATCH_RESULT_TYPES.includes(a.betType) && b.betType === DOUBLE_CHANCE) ||
    (MATCH_RESULT_TYPES.includes(b.betType) && a.betType === DOUBLE_CHANCE)
  if (isMrDcPair) return true

  if (TOTALS.includes(a.betType) && TOTALS.includes(b.betType)) {
    if (a.threshold === undefined || b.threshold === undefined) return false
    const aIsOver = a.code.startsWith("O")
    const bIsOver = b.code.startsWith("O")

    if (aIsOver === bIsOver) {
      // Same side at different thresholds, e.g. Over 1.5 + Over 2.5: the
      // higher threshold winning always means the lower one wins too, so
      // the pair is never a genuinely new combination, just a redundant
      // (or actively worse) parlay leg.
      return a.threshold !== b.threshold
    }

    // Opposite sides: Over-at-T1 and Under-at-T2 are only both true when
    // goals can land strictly between the two thresholds, e.g. Over 1.5 +
    // Under 4.5 (2, 3, or 4 goals). Impossible once T1 >= T2, e.g. Under
    // 1.5 + Over 4.5.
    const overThreshold = aIsOver ? a.threshold : b.threshold
    const underThreshold = aIsOver ? b.threshold : a.threshold
    return overThreshold >= underThreshold
  }

  const [btts, totals] = BTTS.includes(a.betType) && TOTALS.includes(b.betType)
    ? [a, b]
    : BTTS.includes(b.betType) && TOTALS.includes(a.betType)
      ? [b, a]
      : []
  if (btts && totals) {
    const isBttsYes = BTTS_YES_CODES.includes(btts.code)
    const isLowUnder = totals.code.startsWith("U") && totals.threshold !== undefined && totals.threshold <= 1.5
    return isBttsYes && isLowUnder
  }

  return false
}

/**
 * Given the ids currently selected and every candidate available (across
 * however many markets/matches are in play), returns the ids of
 * not-yet-selected candidates that conflict with at least one current
 * selection, e.g. for an Odds Selector's `disabledIds`. Same-match
 * scoping is baked into the comparison, not left to caller discipline.
 */
export function getConflictingIds(selectedIds: string[], candidates: ConflictCandidate[]): Set<string> {
  const selected = candidates.filter((candidate) => selectedIds.includes(candidate.id))
  const conflicting = new Set<string>()
  for (const candidate of candidates) {
    if (selectedIds.includes(candidate.id)) continue
    if (selected.some((sel) => conflicts(sel, candidate))) {
      conflicting.add(candidate.id)
    }
  }
  return conflicting
}

/**
 * Convenience wrapper for consumers who only have already-built
 * `BetSlipPick[]` in hand (e.g. loaded from storage, no live `Market`
 * data around). Checks every pick against every other pick already in
 * the slip and returns the ids of any that conflict with each other, for
 * e.g. BetSlip's `conflictingPickIds`. Picks missing `matchId`/`betType`/
 * `code` (built by hand rather than via the Bet Slip Adapter) are skipped.
 */
export function getConflictingPickIds(picks: BetSlipPick[]): Set<string> {
  const candidates: ConflictCandidate[] = picks
    .filter((pick) => pick.matchId && pick.betType && pick.code)
    .map((pick) => ({
      id: pick.id,
      matchId: pick.matchId!,
      betType: pick.betType!,
      code: pick.code!,
      threshold: pick.threshold,
    }))

  const conflicting = new Set<string>()
  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      if (conflicts(candidates[i], candidates[j])) {
        conflicting.add(candidates[i].id)
        conflicting.add(candidates[j].id)
      }
    }
  }
  return conflicting
}
