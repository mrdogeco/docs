"use client"

import { useState } from "react"
import { EventCard } from "@/registry/mrdoge-ui/event-card/event-card"
import { sampleOdds } from "@/components/docs/sample-data"

export function EventCardDemo() {
  const [selectedOddsId, setSelectedOddsId] = useState<string | undefined>("home")

  return (
    <EventCard
      competition="Brasileirão Série A"
      status="live"
      elapsed="63'"
      home={{ name: "Palmeiras" }}
      away={{ name: "Flamengo" }}
      homeScore={2}
      awayScore={1}
      odds={sampleOdds}
      selectedOddsId={selectedOddsId}
      onSelectOdds={setSelectedOddsId}
    />
  )
}
