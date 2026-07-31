import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type FormResult = "W" | "D" | "L" | "U"

export interface TeamFormMatchEntry {
  opponent: string
  isHome: boolean
  scoreFor: number | null
  scoreAgainst: number | null
  result: FormResult
}

export interface TeamFormIndicatorProps {
  /** Recent results, ordered oldest to newest (most recent last). */
  results: FormResult[]
  /**
   * Optional per-result detail, same length/order as `results` — when
   * provided, each pill becomes a tooltip trigger showing the match.
   */
  matches?: TeamFormMatchEntry[]
  className?: string
}

const resultStyles: Record<FormResult, string> = {
  W: "bg-emerald-600 text-white dark:bg-emerald-500",
  D: "bg-muted text-muted-foreground",
  L: "bg-destructive/80 text-destructive-foreground",
  U: "bg-muted text-muted-foreground/60",
}

function pillClassName(result: FormResult) {
  return cn(
    "flex size-5 items-center justify-center rounded-full text-[0.65rem] font-semibold",
    resultStyles[result]
  )
}

export function TeamFormIndicator({
  results,
  matches,
  className,
}: TeamFormIndicatorProps) {
  if (!matches) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {results.map((result, index) => (
          <span key={index} className={pillClassName(result)}>
            {result}
          </span>
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1", className)}>
        {results.map((result, index) => {
          const match = matches[index]
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <span className={pillClassName(result)}>{result}</span>
              </TooltipTrigger>
              {match && (
                <TooltipContent>
                  {match.isHome ? "vs" : "@"} {match.opponent}
                  {match.scoreFor !== null && match.scoreAgainst !== null
                    ? ` ${match.scoreFor}–${match.scoreAgainst}`
                    : ""}
                </TooltipContent>
              )}
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
