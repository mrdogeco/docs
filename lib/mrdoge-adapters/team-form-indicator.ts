import type { TeamForm, TeamFormResult } from "@mrdoge/protocol"
import type {
  TeamFormIndicatorProps,
  TeamFormMatchEntry,
  FormResult,
} from "@/registry/mrdoge-ui/team-form-indicator/team-form-indicator"

function toFormResult(result: TeamFormResult): FormResult {
  switch (result) {
    case "win":
      return "W"
    case "draw":
      return "D"
    case "loss":
      return "L"
    case "unknown":
      return "U"
  }
}

// summary.form is a plain string[] on the wire (not the TeamFormResult
// enum) — already W/D/L-coded per its own doc comment, but not
// type-guaranteed, so fall back to "U" for anything unrecognized rather
// than casting blindly.
function toFormResultFromCode(code: string): FormResult {
  return code === "W" || code === "D" || code === "L" ? code : "U"
}

/**
 * Maps a real `teams.form()` response to TeamFormIndicator's props. The SDK
 * returns both `summary.form` and `matches` most-recent-first; the
 * component wants oldest-to-newest (most recent last) — both get reversed
 * together so `results[i]`/`matches[i]` still refer to the same game.
 */
export function teamFormToProps(form: TeamForm): TeamFormIndicatorProps {
  const matches: TeamFormMatchEntry[] = form.matches
    .map((match) => ({
      opponent: match.opponent.name,
      isHome: match.isHome,
      scoreFor: match.score.for,
      scoreAgainst: match.score.against,
      result: toFormResult(match.result),
    }))
    .reverse()

  return {
    results: form.summary.form.map(toFormResultFromCode).reverse(),
    matches,
  }
}
