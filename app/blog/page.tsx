import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata, ogImagePath } from "@/lib/seo"
import { blogSource } from "@/lib/blog-source"
import { PostCard } from "@/components/blog/post-card"
import { Footer } from "@/components/marketing/footer"

const pageMetadata = buildMetadata({
  title: "Blog | Mr. Doge",
  description: "Tutorials, comparisons, and behind-the-scenes posts on building sports apps with real-time odds, live scores, and AI predictions.",
  path: "/blog",
})

export const metadata: Metadata = {
  ...pageMetadata,
  alternates: {
    ...pageMetadata.alternates,
    types: { "application/rss+xml": "/rss.xml" },
  },
}

export default function BlogIndexPage() {
  const posts = blogSource
    .getPages()
    .map((page) => ({
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
      tags: page.data.tags,
      image: page.data.image ?? ogImagePath({ title: page.data.title, description: page.data.description }),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <HomeLayout {...baseOptions()}>
      <section className="mx-auto w-full max-w-4xl px-6 pt-32 pb-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Tutorials, comparisons, and behind-the-scenes posts on building sports apps with the Mr. Doge SDK.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet — check back soon.</p>
          ) : (
            posts.map((post) => <PostCard key={post.url} post={post} />)
          )}
        </div>
      </section>

      <Footer />
    </HomeLayout>
  )
}
