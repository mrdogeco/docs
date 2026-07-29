"use client"

import { useState } from "react"
import { BetSlip } from "@/registry/mrdoge-ui/bet-slip/bet-slip"
import { samplePicks } from "@/components/docs/sample-data"

export function BetSlipDemo() {
  const [picks, setPicks] = useState(samplePicks)

  return (
    <BetSlip
      picks={picks}
      onRemovePick={(id) => setPicks((prev) => prev.filter((p) => p.id !== id))}
    />
  )
}
