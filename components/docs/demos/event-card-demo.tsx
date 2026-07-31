"use client"

import { useState } from "react"
import { EventCard } from "@/registry/mrdoge-ui/event-card/event-card"
import { matchToEventCardProps } from "@/lib/sdk-adapters/event-card"
import { sampleMatch, sampleMarket } from "@/components/docs/sample-data"

export function EventCardDemo() {
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>("home")
  const props = matchToEventCardProps(sampleMatch, sampleMarket)

  return (
    <EventCard
      {...props}
      selectedOddsId={selectedOddsId}
      onSelectOdds={setSelectedOddsId}
    />
  )
}
