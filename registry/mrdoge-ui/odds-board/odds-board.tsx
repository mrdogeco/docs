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
  /** Called with the pressed option's id, or `undefined` when pressing the already-selected option deselects it. */
  onSelectOption?: (marketId: string, optionId: string | undefined) => void
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
        <OddsSelector
          key={market.id}
          label={market.label}
          options={market.options}
          selectedId={market.selectedOptionId}
          onSelect={(optionId) => onSelectOption?.(market.id, optionId)}
        />
      ))}
    </div>
  )
}
