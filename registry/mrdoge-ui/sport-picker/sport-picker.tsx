"use client"

import type { ComponentType } from "react"
import {
  PiSoccerBall,
  PiBasketball,
  PiFootball,
  PiBaseball,
  PiHockey,
  PiVolleyball,
  PiTennisBall,
} from "react-icons/pi"
import { MdSportsHandball } from "react-icons/md"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SportOption {
  /** Kebab-case sport id, e.g. "soccer", "american-football", "ice-hockey". */
  id: string
  label: string
}

export interface SportPickerProps {
  sports: SportOption[]
  selected?: string
  onSelect?: (sportId: string) => void
  className?: string
}

// Phosphor (react-icons/pi) covers 7 of 8 sports; handball has no Phosphor
// icon, so it falls back to Material Design — same fallback mrdoge-ai uses.
const sportIcon: Record<string, ComponentType<{ className?: string }>> = {
  soccer: PiSoccerBall,
  basketball: PiBasketball,
  "american-football": PiFootball,
  baseball: PiBaseball,
  "ice-hockey": PiHockey,
  volleyball: PiVolleyball,
  handball: MdSportsHandball,
  tennis: PiTennisBall,
}

export function SportPicker({
  sports,
  selected,
  onSelect,
  className,
}: SportPickerProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {sports.map((sport) => {
        const Icon = sportIcon[sport.id]
        const isSelected = sport.id === selected

        return (
          <Button
            key={sport.id}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect?.(sport.id)}
            className="gap-1.5"
          >
            {Icon && <Icon className="size-4" />}
            {sport.label}
          </Button>
        )
      })}
    </div>
  )
}
