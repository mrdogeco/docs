import type { SportName } from "@mrdoge/protocol"
import type { SportOption } from "@/registry/mrdoge-ui/sport-picker/sport-picker"

// The component's own Sport id is kebab-case (matching this registry's
// convention elsewhere, e.g. match-timeline's "yellow-card"), not the
// wire format's snake_case — this table is the one place that
// conversion happens, keyed by the real SportName enum so a new sport
// added to the SDK shows up here as a real type error, not silently.
const SPORT_LABELS: Record<SportName, { id: string; label: string }> = {
  soccer: { id: "soccer", label: "Soccer" },
  basketball: { id: "basketball", label: "Basketball" },
  american_football: { id: "american-football", label: "American Football" },
  baseball: { id: "baseball", label: "Baseball" },
  ice_hockey: { id: "ice-hockey", label: "Ice Hockey" },
  volleyball: { id: "volleyball", label: "Volleyball" },
  handball: { id: "handball", label: "Handball" },
  tennis: { id: "tennis", label: "Tennis" },
}

export function sportNamesToOptions(sports: SportName[]): SportOption[] {
  return sports.map((sport) => SPORT_LABELS[sport])
}

export const allSportOptions: SportOption[] = Object.values(SPORT_LABELS)
