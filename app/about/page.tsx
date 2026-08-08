import type { Metadata } from "next"
import Link from "next/link"
import { Target, Zap, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BrandedCta } from "@/components/marketing/branded-cta"
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
// expire" as the core positioning — that's no longer true (the SDK
// moved to Stripe subscription tiers with a 7-day trial), so this is a
// rewrite of the narrative, not just a find-and-replace, to avoid
// asserting something false about how billing works.
const values = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "Developer-first",
    description: "Built by builders, for builders. We obsess over DX with clean docs, predictable performance, and fast support.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Innovation",
    description: "We merge AI predictions with live markets so your product can surface actionable insights, not just raw numbers.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Reliability",
    description: "99.9% uptime targets, low-latency infrastructure, and resilient pipelines keep your experiences live.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Transparency",
    description: "Every tier's price and limits are public on the pricing page, and we give 30 days notice before any change.",
  },
]

export default function AboutPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <section className="mx-auto w-full max-w-4xl px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          About <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Mr. Doge</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We&apos;re building the most developer-friendly sports odds API — live data, AI-powered insights, and transparent subscription pricing.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Our story</h2>
        <div className="mt-6 flex flex-col gap-5 text-muted-foreground">
          <p>
            Mr. Doge started as an AI-powered sports betting analysis app. Building it meant wiring together live odds feeds, event data, and an
            AI recommendation pipeline from scratch — and we kept hearing the same thing from other developers: there wasn&apos;t a good, simple
            way to get that data without building it themselves too.
          </p>
          <p>
            So we opened it up. The same odds feed, match data, and AI recommendation engine that power our own app are now available as the Mr.
            Doge SDK — typed, with native WebSocket support for live data, and a free 7-day trial on every plan so you can see if it fits before
            paying anything.
          </p>
          <p>
            Our mission is the same one we started with: give developers a sports data platform that&apos;s fast, reliable, and priced clearly —
            from indie projects to production apps handling real traffic.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Our values</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="flex flex-col gap-3 pt-2">
                <div className="text-foreground">{value.icon}</div>
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <BrandedCta
        title="Join developers shipping odds-powered products"
        description="Create your workspace, mint an API key, and start your 7-day free trial — no charge until it ends."
      >
        <Button asChild size="lg" className="rounded-full bg-black px-6 py-3 text-white shadow-lg shadow-black/30 hover:bg-black/90">
          <Link href="/docs">Get started</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full border-black/20 bg-white/30 px-5 py-3 text-black backdrop-blur hover:bg-white/50 hover:text-black">
          <Link href="mailto:support@mrdoge.co">Talk to us</Link>
        </Button>
      </BrandedCta>

      <Footer />
    </HomeLayout>
  )
}
