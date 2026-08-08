import fs from "node:fs"
import { source } from "@/lib/source"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page?.absolutePath) {
    return new Response("Not found", { status: 404 })
  }

  const content = fs.readFileSync(page.absolutePath, "utf-8")

  return new Response(content, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  })
}

export function generateStaticParams() {
  // /raw/[...slug] requires at least one segment — source.generateParams()
  // includes the root index page (slug: []), which doesn't match a
  // required catch-all and fails the whole export otherwise.
  return source.generateParams().filter((p) => p.slug && p.slug.length > 0)
}
