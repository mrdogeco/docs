import type { Recommendation, Match } from "@mrdoge/protocol"
import type {
  AIRecommendationCardProps,
  RecommendationConfidence,
} from "@/registry/mrdoge-ui/ai-recommendation-card/ai-recommendation-card"

// `Recommendation.match` is optional (depends on the `select` used when
// fetching) but the card needs competition/home/away — require it here so
// the type system forces the caller to request `select: { match: true }`
// rather than silently rendering with missing data.
type RecommendationWithMatch = Recommendation & { match: Match }

function toConfidence(confidence: Recommendation["confidence"]): RecommendationConfidence {
  switch (confidence) {
    case "High":
      return "high"
    case "Medium":
      return "medium"
    case "Low":
      return "low"
  }
}

// A fully resolved human label ("Over 2.5 goals") needs a joined
// Market/BetItem lookup this adapter doesn't have — `outcome` is a raw
// code (same convention as BetItem.code elsewhere in this codebase), still
// meaningful to anyone familiar with the market even without the join.
function toPickLabel(rec: Recommendation): string {
  return rec.point != null ? `${rec.outcome} ${rec.point}` : rec.outcome
}

/**
 * Maps a real `ai.recommendations.list()`/`.get()` response (with `match`
 * selected) to AIRecommendationCard's props. If the SDK's shape changes,
 * this fails to compile.
 */
export function recommendationToProps(rec: RecommendationWithMatch): AIRecommendationCardProps {
  return {
    competition: rec.match.competition.name,
    home: rec.match.homeTeam.name,
    away: rec.match.awayTeam.name,
    pick: toPickLabel(rec),
    odds: rec.odds.toFixed(2),
    confidence: toConfidence(rec.confidence),
    edgePercentage: rec.edgePercentage,
    kellyFraction: rec.kellyFraction,
    rationale: rec.rationale,
    riskFactors: rec.riskFactors,
    result: rec.settled && rec.result ? rec.result : undefined,
  }
}
