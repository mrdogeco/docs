import { MatchCard } from "@/registry/mrdoge-ui/match-card/match-card"

export function MatchCardLoadingDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <MatchCard loading />
      <MatchCard loading oddsLoading />
    </div>
  )
}
