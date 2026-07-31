"use client"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface RegionAccordionCompetition {
  id: string
  name: string
  eventCount?: number
}

export interface RegionAccordionRegion {
  id: string
  name: string
  eventCount?: number
  competitions: RegionAccordionCompetition[]
}

export interface RegionAccordionProps {
  regions: RegionAccordionRegion[]
  onSelectCompetition?: (regionId: string, competitionId: string) => void
  className?: string
}

export function RegionAccordion({
  regions,
  onSelectCompetition,
  className,
}: RegionAccordionProps) {
  return (
    <Accordion type="multiple" className={cn(className)}>
      {regions.map((region) => (
        <AccordionItem key={region.id} value={region.id}>
          <AccordionTrigger>
            <span className="flex w-full items-center justify-between gap-2 pr-2">
              <span>{region.name}</span>
              {region.eventCount !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {region.eventCount}
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-1">
              {region.competitions.map((competition) => (
                <li key={competition.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectCompetition?.(region.id, competition.id)
                    }
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span>{competition.name}</span>
                    {competition.eventCount !== undefined && (
                      <span className="text-xs">{competition.eventCount}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
