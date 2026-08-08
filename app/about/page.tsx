import type { Metadata } from "next"
import Image from "next/image"
import { Target, Zap, Shield, Users } from "lucide-react"
import { Footer } from "@/components/marketing/footer"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "About Mr. Doge | Sports Odds API Built for Developers",
  description: "Learn how Mr. Doge combines live sports odds, AI predictions, and transparent pricing to help builders ship confident betting and analytics experiences.",
  path: "/about",
})

// Ported from old_mrdoge-co's (landing)/about/page.tsx. The original
// story leaned on "we pioneered pay-as-you-go credits that never
// expire" as the core positioning. That's no longer true (the SDK
// moved to Stripe subscription tiers with a 7-day trial), so this is a
// rewrite of the narrative, not just a find-and-replace, to avoid
// asserting something false about how billing works.
const values = [
  {
    icon: Target,
    title: "Developer-first",
    description: "Built by builders, for builders. We obsess over DX with clean docs, predictable performance, and fast support.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We merge AI predictions with live markets so your product can surface actionable insights, not just raw numbers.",
  },
  {
    icon: Shield,
    title: "Reliability",
    description: "99.9% uptime targets, low-latency infrastructure, and resilient pipelines keep your experiences live.",
  },
  {
    icon: Users,
    title: "Transparency",
    description: "Every tier's price and limits are public on the pricing page, and we give 30 days notice before any change.",
  },
]

export default function AboutPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <section className="mx-auto w-full max-w-4xl px-6 pt-20 pb-16 text-center">
        <Image src="/assets/mrdoge-logo-light.svg" alt="Mr. Doge" width={160} height={36} className="mx-auto dark:hidden" />
        <Image src="/assets/mrdoge-logo-dark.svg" alt="Mr. Doge" width={160} height={36} className="mx-auto hidden dark:block" />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-6xl">
          Built by developers who got tired of building this themselves.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We&apos;re building the most developer-friendly sports odds API: live data, AI-powered insights, and transparent subscription pricing.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Our story</h2>
        <div className="mt-6 flex flex-col gap-5 text-muted-foreground">
          <p>
            Mr. Doge started as an AI-powered sports betting analysis app. Building it meant wiring together live odds feeds, event data, and an
            AI recommendation pipeline from scratch, and we kept hearing the same thing from other developers: there wasn&apos;t a good, simple
            way to get that data without building it themselves too.
          </p>
          <p>
            So we opened it up. The same odds feed, match data, and AI recommendation engine that power our own app are now available as the Mr.
            Doge SDK: typed, with native WebSocket support for live data, and a free 7-day trial on every plan so you can see if it fits before
            paying anything.
          </p>
          <p>
            Our mission is the same one we started with: give developers a sports data platform that&apos;s fast, reliable, and priced clearly,
            from indie projects to production apps handling real traffic.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Our values</h2>
        <div className="mt-8 grid grid-cols-1 divide-y overflow-hidden rounded-2xl border sm:grid-cols-2 sm:divide-x">
          {values.map((value) => (
            <div key={value.title} className="p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <value.icon className="size-4 text-muted-foreground" />
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </HomeLayout>
  )
}
