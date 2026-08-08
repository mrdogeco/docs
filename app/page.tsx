import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"
import { fetchShowcaseMatches } from "@/lib/mrdoge-server"
import { SHOWCASE_MATCH_IDS } from "@/components/docs/sample-data"
import { SdkHero } from "@/components/marketing/sdk-hero"
import { SdkFeatures } from "@/components/marketing/sdk-features"
import { SdkQuickstart } from "@/components/marketing/sdk-quickstart"
import { SdkPricing } from "@/components/marketing/sdk-pricing"
import { SdkAppShowcase } from "@/components/marketing/sdk-app-showcase"
import { SdkComponentsTeaser } from "@/components/marketing/sdk-components-teaser"
import { SdkCta } from "@/components/marketing/sdk-cta"
import { Footer } from "@/components/marketing/footer"

export const metadata: Metadata = buildMetadata({
  title: "Mr. Doge | Sports Odds API with AI Predictions",
  description:
    "Real-time sports odds, live match data, and AI-powered predictions via a typed SDK with native WebSocket support for Node, browsers, and React Native. Free 7-day trial.",
  path: "/",
})

// Same build-time showcase fetch as /ui (see lib/mrdoge-server.ts). This
// route has no dynamic APIs either, so it stays statically rendered.
export default async function Home() {
  const showcases = await fetchShowcaseMatches(SHOWCASE_MATCH_IDS)

  return (
    <HomeLayout {...baseOptions()}>
      <SdkHero />
      <SdkFeatures />
      <SdkQuickstart />
      <SdkPricing compareHref="/pricing#comparison" />
      <SdkAppShowcase />
      <SdkComponentsTeaser showcases={showcases} />
      <SdkCta />
      <Footer />
    </HomeLayout>
  )
}
