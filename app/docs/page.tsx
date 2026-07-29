import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Documentation — mrdoge-ui",
  description: "Installation and usage for mrdoge-ui components.",
}

const SDK_EXAMPLE = `import { createClient } from "@mrdoge/client"
import { EventCard } from "@/components/event-card"

const mrdoge = createClient({ token })
const match = await mrdoge.matches.get(matchId)

<EventCard
  competition={match.competition.name}
  status={match.status}
  home={{ name: match.home.name }}
  away={{ name: match.away.name }}
  homeScore={match.score?.home}
  awayScore={match.score?.away}
  odds={match.odds.map(toOddsOption)}
/>`

export default function DocsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          mrdoge-ui is a set of React components for building sports betting
          interfaces: event cards, odds selectors, bet slips, match timelines,
          and related building blocks. Components are distributed as source
          code through a shadcn/ui-compatible registry, not as an installable
          package. There is no dependency on any particular data provider —
          every component takes plain props.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Installation</h2>
        <p className="text-sm text-muted-foreground">
          Works in any project with Tailwind CSS and the shadcn/ui CLI
          configured. Install a component with:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          <code>npx shadcn@latest add https://mrdoge.co/r/event-card.json</code>
        </pre>
        <p className="text-sm text-muted-foreground">
          This copies the component and its dependencies into your project
          under <code className="text-xs">components/</code>. You own the
          resulting code and can modify it freely.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Components</h2>
        <p className="text-sm text-muted-foreground">
          Event Card, Odds Selector, Live Indicator, Bet Slip, Match
          Timeline, Team Form Indicator, and Competition Header. Each is
          listed on the{" "}
          <Link href="/" className="underline underline-offset-4">
            homepage
          </Link>{" "}
          with a live preview and its install command.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Use with the Mr. Doge SDK</h2>
        <p className="text-sm text-muted-foreground">
          mrdoge-ui components accept plain props, so they work with any data
          source. They pair directly with{" "}
          <a
            href="https://mrdoge.ai"
            className="underline underline-offset-4"
          >
            @mrdoge/client
          </a>
          , which provides typed, real-time sports data over HTTP and
          WebSocket:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
          <code>{SDK_EXAMPLE}</code>
        </pre>
      </section>
    </div>
  )
}
