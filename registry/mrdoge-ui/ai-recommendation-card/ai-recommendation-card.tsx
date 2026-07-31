import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  SettlementBadge,
  type SettlementResult,
} from "@/registry/mrdoge-ui/settlement-badge/settlement-badge"

export type RecommendationConfidence = "high" | "medium" | "low"

export interface AIRecommendationCardProps {
  competition: string
  home: string
  away: string
  /** Human-readable pick label, e.g. "Palmeiras to win", "Over 2.5 goals". */
  pick: string
  /** Formatted price, e.g. "1.85". */
  odds: string
  confidence: RecommendationConfidence
  /** Fraction, e.g. 0.05 for 5% — formatted as a percentage. */
  edgePercentage: number
  /** Fraction, formatted as a percentage — omitted when not shown. */
  kellyFraction?: number
  rationale: string[]
  riskFactors?: string[]
  /** Present only once the pick has settled. */
  result?: SettlementResult
  className?: string
}

function ConfidenceBadge({ confidence }: { confidence: RecommendationConfidence }) {
  if (confidence === "high") return <Badge>High confidence</Badge>
  if (confidence === "medium") return <Badge variant="secondary">Medium confidence</Badge>
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Low confidence
    </Badge>
  )
}

function formatPercentage(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function AIRecommendationCard({
  competition,
  home,
  away,
  pick,
  odds,
  confidence,
  edgePercentage,
  kellyFraction,
  rationale,
  riskFactors,
  result,
  className,
}: AIRecommendationCardProps) {
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">{competition}</span>
        {result ? <SettlementBadge result={result} /> : <ConfidenceBadge confidence={confidence} />}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {home} vs {away}
          </p>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="text-base font-semibold">{pick}</span>
            <span className="shrink-0 text-base font-semibold tabular-nums">{odds}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Edge <span className="font-medium text-foreground">{formatPercentage(edgePercentage)}</span>
          </span>
          {kellyFraction !== undefined && (
            <span>
              Kelly <span className="font-medium text-foreground">{formatPercentage(kellyFraction)}</span>
            </span>
          )}
        </div>

        {rationale.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm">
            {rationale.map((point, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {riskFactors && riskFactors.length > 0 && (
        <CardFooter className="flex-col items-start gap-1 border-t bg-transparent pt-3">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Risk factors
          </span>
          <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
            {riskFactors.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  )
}
