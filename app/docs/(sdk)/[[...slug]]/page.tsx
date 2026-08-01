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

export default async function Page(props: PageProps) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex items-start justify-between gap-4">
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

// The "ui" root has its own route (app/docs/ui/[[...slug]]) so it doesn't
// nest inside this layout — exclude it here to avoid both routes trying to
// statically generate the same paths.
export function generateStaticParams() {
  return source.generateParams().filter((p) => p.slug?.[0] !== "ui")
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
