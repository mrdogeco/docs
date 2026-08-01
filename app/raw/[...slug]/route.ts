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
  return source.generateParams()
}
