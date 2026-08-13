import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/layouts/docs/page"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata, ogImagePath } from "@/lib/seo"
import { blogPostingJsonLd } from "@/lib/json-ld"
import { JsonLd } from "@/components/json-ld"
import { blogSource } from "@/lib/blog-source"
import { getMDXComponents } from "@/components/mdx"
import { PostCta } from "@/components/blog/post-cta"
import { Footer } from "@/components/marketing/footer"

type PageProps = {
  params: Promise<{ slug: string[] }>
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params
  const page = blogSource.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const image = page.data.image ?? ogImagePath({ title: page.data.title, description: page.data.description })

  return (
    <HomeLayout {...baseOptions()}>
      <JsonLd
        data={blogPostingJsonLd({
          title: page.data.title,
          description: page.data.description,
          path: page.url,
          date: page.data.date,
          author: page.data.author,
          image,
        })}
      />
      <div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16">
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-muted">
          <Image src={image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
        <DocsTitle className="mt-8">{page.data.title}</DocsTitle>
        <p className="mb-6 text-sm text-muted-foreground">
          <time dateTime={page.data.date}>{formatDate(page.data.date)}</time>
          {page.data.author && <> · {page.data.author}</>}
        </p>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <MDX components={getMDXComponents()} />
        </DocsBody>
        <PostCta />
      </div>
      <Footer />
    </HomeLayout>
  )
}

export function generateStaticParams() {
  return blogSource.generateParams()
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const page = blogSource.getPage(params.slug)
  if (!page) notFound()

  return buildMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
  })
}
