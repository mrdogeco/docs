import Link from "next/link"
import { SiGithub } from "react-icons/si"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const TECH_BADGES = ["Node", "Browser", "React Native"]

export function SdkHero() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
      <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        Mr. Doge SDK
      </span>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        The odds in your favor.
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground">
        Matches, live odds, stats, AI predictions and insights. Native
        WebSocket support. Typed end to end.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {TECH_BADGES.map((badge) => (
          <Badge key={badge} variant="outline">
            {badge}
          </Badge>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/docs">Read the docs</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link
            href="https://github.com/mrdogeco/sdk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
            Star on GitHub
          </Link>
        </Button>
      </div>
    </section>
  )
}
