"use client"

import { cn } from "@/lib/utils"
import {
  OddsSelector,
  type OddsOption,
} from "@/registry/mrdoge-ui/odds-selector/odds-selector"

export interface OddsBoardMarket {
  id: string
  /** Human-readable market name, e.g. "Match Winner", "Total Goals". */
  label: string
  options: OddsOption[]
  selectedOptionId?: string
}

export interface OddsBoardProps {
  markets: OddsBoardMarket[]
  onSelectOption?: (marketId: string, optionId: string) => void
  className?: string
}

export function OddsBoard({
  markets,
  onSelectOption,
  className,
}: OddsBoardProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {markets.map((market) => (
        <div key={market.id} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {market.label}
          </span>
          <OddsSelector
            options={market.options}
            selectedId={market.selectedOptionId}
            onSelect={(optionId) => onSelectOption?.(market.id, optionId)}
          />
        </div>
      ))}
    </div>
  )
}
