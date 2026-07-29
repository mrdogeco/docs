"use client"

import type { ComponentType } from "react"
import { Minus, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type OddsMovement = "up" | "down" | "flat"

export interface OddsOption {
  id: string
  /** Selection label, e.g. "1", "X", "2" or "Home", "Away". */
  label: string
  /** Formatted price, e.g. "1.85". */
  price: string
  movement?: OddsMovement
  suspended?: boolean
}

export interface OddsSelectorProps {
  options: OddsOption[]
  selectedId?: string
  onSelect?: (id: string) => void
  className?: string
}

const movementIcon: Record<OddsMovement, ComponentType<{ className?: string }>> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

const movementColor: Record<OddsMovement, string> = {
  up: "text-emerald-600 dark:text-emerald-500",
  down: "text-destructive",
  flat: "text-muted-foreground",
}

export function OddsSelector({
  options,
  selectedId,
  onSelect,
  className,
}: OddsSelectorProps) {
  return (
    <div className={cn("grid auto-cols-fr grid-flow-col gap-2", className)}>
      {options.map((option) => {
        const MovementIcon = option.movement
          ? movementIcon[option.movement]
          : null
        const selected = option.id === selectedId

        return (
          <Button
            key={option.id}
            type="button"
            variant={selected ? "default" : "outline"}
            disabled={option.suspended}
            onClick={() => onSelect?.(option.id)}
            className="h-auto flex-col gap-0.5 py-1.5"
          >
            <span className="text-xs font-normal opacity-80">
              {option.label}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              {option.suspended ? "—" : option.price}
              {MovementIcon && !option.suspended ? (
                <MovementIcon
                  className={cn(
                    "size-3",
                    selected ? "opacity-90" : movementColor[option.movement!]
                  )}
                />
              ) : null}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
