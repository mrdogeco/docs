import Link from "next/link"
import { Star } from "lucide-react"
import { SiGithub } from "react-icons/si"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getGithubStarCount } from "@/lib/github-stars"

export const SDK_GITHUB_URL = "https://github.com/mrdogeco/sdk"

type Props = {
  /** owner/repo to star and fetch the count for. Defaults to the SDK repo. */
  repo?: string
  /** Override the live count (useful for tests). */
  count?: number
  className?: string
}

export async function GithubStarButton({ repo = "mrdogeco/sdk", count, className }: Props) {
  const fetchedCount = count === undefined ? await getGithubStarCount(repo) : count

  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className={cn("rounded-full border-black/20 bg-white/30 py-3 pr-3 pl-5 text-black backdrop-blur hover:bg-white/50 hover:text-black", className)}
    >
      <Link href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">
        <SiGithub />
        Star on GitHub
        {fetchedCount !== null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2 py-0.5 text-xs font-semibold tabular-nums">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {formatStarCount(fetchedCount)}
          </span>
        )}
      </Link>
    </Button>
  )
}

/** 1234 -> "1.2k". Keeps the badge compact once we cross 1k. */
function formatStarCount(n: number): string {
  if (n < 1000) return String(n)
  const k = n / 1000
  return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`
}
