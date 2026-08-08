import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"
import { fetchShowcaseMatch } from "@/lib/mrdoge-server"
import { FINISHED_MATCH_ID } from "@/components/docs/sample-data"
import { HomeGallery } from "@/components/home-gallery"
import { Footer } from "@/components/marketing/footer"

export const metadata: Metadata = buildMetadata({
  title: "mrdoge-ui | Open-Source React Components for Sports Betting Apps",
  description:
    "Open-source, copy-paste React components for sports betting apps: event cards, odds selectors, bet slips, and match data displays.",
  path: "/ui",
})

// Fetched once at build time (this route has no dynamic APIs, so it's
// statically rendered) — the gallery ships with real match data baked in
// instead of a client-side fetch or loading state.
export default async function Home() {
  const showcase = await fetchShowcaseMatch(FINISHED_MATCH_ID)

  return (
    <HomeLayout {...baseOptions("ui")}>
      <HomeGallery showcase={showcase} />
      <Footer />
    </HomeLayout>
  )
}
