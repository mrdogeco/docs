import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"
import { fetchShowcaseMatches } from "@/lib/mrdoge-server"
import { SHOWCASE_MATCH_IDS, MATCH_HIGHLIGHT_IDS } from "@/components/docs/sample-data"
import { HomeGallery } from "@/components/home-gallery"
import { Footer } from "@/components/marketing/footer"
import { GithubStarButton } from "@/components/marketing/github-star-button"

export const metadata: Metadata = buildMetadata({
  title: "mrdoge-ui | Open-Source React Components for Sports Apps",
  description:
    "Open-source, copy-paste React components for sports apps: event cards, odds selectors, bet slips, and match data displays.",
  path: "/ui",
})

// Fetched once at build time (this route has no dynamic APIs, so it's
// statically rendered). The gallery ships with real match data baked in
// instead of a client-side fetch or loading state. One combined fetch
// (single client, parallel requests) for both id lists, sliced back apart
// below.
export default async function Home() {
  const matches = await fetchShowcaseMatches([...SHOWCASE_MATCH_IDS, ...MATCH_HIGHLIGHT_IDS])
  const showcases = matches.slice(0, SHOWCASE_MATCH_IDS.length)
  const highlightMatches = matches.slice(SHOWCASE_MATCH_IDS.length)

  return (
    <HomeLayout {...baseOptions("ui")}>
      <HomeGallery
        showcases={showcases}
        highlightMatches={highlightMatches}
        githubButton={
          <GithubStarButton
            repo="mrdogeco/docs"
            className="rounded-lg bg-background text-foreground backdrop-blur-none hover:bg-muted hover:text-foreground"
          />
        }
      />
      <Footer />
    </HomeLayout>
  )
}
