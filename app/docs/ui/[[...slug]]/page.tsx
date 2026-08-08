import { source } from "@/lib/source"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page"
import { notFound } from "next/navigation"
import { getMDXComponents } from "@/components/mdx"
import { PageActions } from "@/components/docs/page-actions"
import type { Metadata } from "next"
import { createRelativeLink } from "fumadocs-ui/mdx"

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

// This route only ever receives the slug *after* "ui" (Next.js strips the
// static "ui" segment before handing off to this catch-all). The page
// tree indexes pages by their full path, "ui" included, so prepend it back.
function fullSlug(slug?: string[]) {
  return ["ui", ...(slug ?? [])]
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const page = source.getPage(fullSlug(params.slug))
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <DocsTitle>{page.data.title}</DocsTitle>
        <PageActions slug={page.slugs} />
      </div>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter((p) => p.slug?.[0] === "ui")
    .map((p) => ({ slug: p.slug?.slice(1) ?? [] }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(fullSlug(params.slug))
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
