import { cn } from "@/lib/utils"

export type FormResult = "W" | "D" | "L"

export interface TeamFormIndicatorProps {
  /** Recent results, ordered oldest to newest (most recent last). */
  results: FormResult[]
  className?: string
}

const resultStyles: Record<FormResult, string> = {
  W: "bg-emerald-600 text-white dark:bg-emerald-500",
  D: "bg-muted text-muted-foreground",
  L: "bg-destructive/80 text-destructive-foreground",
}

export function TeamFormIndicator({
  results,
  className,
}: TeamFormIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {results.map((result, index) => (
        <span
          key={index}
          className={cn(
            "flex size-5 items-center justify-center rounded-full text-[0.65rem] font-semibold",
            resultStyles[result]
          )}
        >
          {result}
        </span>
      ))}
    </div>
  )
}
