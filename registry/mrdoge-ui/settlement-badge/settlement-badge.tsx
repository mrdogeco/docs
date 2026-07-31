import { Check, X, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type SettlementResult = "won" | "lost" | "push"

export interface SettlementBadgeProps {
  result: SettlementResult
  className?: string
}

const resultConfig: Record<
  SettlementResult,
  { label: string; icon: typeof Check; className: string }
> = {
  won: {
    label: "Won",
    icon: Check,
    className: "border-transparent bg-emerald-600 text-white dark:bg-emerald-500",
  },
  lost: {
    label: "Lost",
    icon: X,
    className: "border-transparent bg-destructive/80 text-destructive-foreground",
  },
  push: {
    label: "Push",
    icon: Minus,
    className: "border-transparent bg-muted text-muted-foreground",
  },
}

export function SettlementBadge({ result, className }: SettlementBadgeProps) {
  const { label, icon: Icon, className: resultClassName } = resultConfig[result]

  return (
    <Badge className={cn("gap-1", resultClassName, className)}>
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}
