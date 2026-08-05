import type { Region, Competition } from "@mrdoge/protocol"
import type { RegionAccordionProps } from "@/registry/mrdoge-ui/region-accordion/region-accordion"

/**
 * Maps real `regions.list()` + `competitions.list()` responses to
 * RegionAccordion's props. Region.competitionIds only gives IDs, not full
 * Competition objects, so competitions come from a separate call and get
 * grouped by regionId here. If the SDK's shape changes, this fails to
 * compile.
 */
export function regionsToProps(
  regions: Region[],
  competitions: Competition[],
): RegionAccordionProps {
  return {
    regions: regions.map((region) => ({
      id: String(region.id),
      name: region.name,
      eventCount: region.eventCount,
      competitions: competitions
        .filter((competition) => competition.regionId === region.id)
        .map((competition) => ({
          id: String(competition.id),
          name: competition.name,
          eventCount: competition.eventCount,
        })),
    })),
  }
}
