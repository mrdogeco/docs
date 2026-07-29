"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export interface BetSlipPick {
  id: string
  eventLabel: string
  market: string
  selection: string
  /** Decimal odds, e.g. 1.85. */
  price: number
}

export interface BetSlipProps {
  picks: BetSlipPick[]
  onRemovePick?: (id: string) => void
  className?: string
}

export function BetSlip({ picks, onRemovePick, className }: BetSlipProps) {
  const [stake, setStake] = useState("")

  const stakeValue = Number(stake)
  const combinedPrice = picks.reduce((total, pick) => total * pick.price, 1)
  const potentialPayout =
    stakeValue > 0 ? (stakeValue * combinedPrice).toFixed(2) : "0.00"

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <CardTitle>Bet slip</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {picks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No picks selected yet.
          </p>
        ) : (
          picks.map((pick, index) => (
            <div key={pick.id}>
              {index > 0 ? <Separator className="mb-3" /> : null}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {pick.eventLabel}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {pick.market} &middot; {pick.selection}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums">
                    {pick.price.toFixed(2)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove pick"
                    onClick={() => onRemovePick?.(pick.id)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      {picks.length > 0 ? (
        <CardFooter className="flex-col items-stretch gap-3 border-t pt-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="bet-slip-stake" className="text-sm text-muted-foreground">
              Stake
            </label>
            <Input
              id="bet-slip-stake"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="0.00"
              value={stake}
              onChange={(event) => setStake(event.target.value)}
              className="w-28 text-right"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Potential payout</span>
            <span className="font-semibold tabular-nums">{potentialPayout}</span>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  )
}
