"use client"

import { useState } from "react"
import { OddsSelector } from "@/registry/mrdoge-ui/odds-selector/odds-selector"
import { sampleOdds } from "@/components/docs/sample-data"

export function OddsSelectorDemo() {
  const [selectedId, setSelectedId] = useState<string | undefined>("home")

  return (
    <OddsSelector
      options={sampleOdds}
      selectedId={selectedId}
      onSelect={setSelectedId}
      className="w-full max-w-xs"
    />
  )
}
