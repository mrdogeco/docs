import { source } from "@/lib/source"
import { absoluteUrl, siteMetadata } from "@/lib/seo"

// The llms.txt convention (llmstxt.org): a curated index linking out to
// the real docs, not a full content dump — same source.getPages() call
// app/sitemap.ts already uses, just grouped and formatted as markdown
// links instead of a sitemap entry.
function toLink(page: { url: string; data: { title: string; description?: string } }): string {
  const description = page.data.description ? `: ${page.data.description}` : ""
  return `- [${page.data.title}](${absoluteUrl(page.url)})${description}`
}

export function GET() {
  const pages = source.getPages()
  const uiPages = pages.filter((page) => page.url.startsWith("/docs/ui"))
  const sdkPages = pages.filter((page) => !page.url.startsWith("/docs/ui"))

  const body = `# ${siteMetadata.name}

> Real-time sports odds, live match data, and AI-powered predictions via a typed SDK with native WebSocket support.

## SDK Docs

${sdkPages.map(toLink).join("\n")}

## UI Components (mrdoge-ui)

${uiPages.map(toLink).join("\n")}
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
