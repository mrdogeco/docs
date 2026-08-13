import { Feed } from "feed"
import { blogSource } from "@/lib/blog-source"
import { absoluteUrl, ogImagePath, siteMetadata } from "@/lib/seo"

export function GET() {
  const posts = [...blogSource.getPages()].sort((a, b) => (a.data.date < b.data.date ? 1 : -1))

  const feed = new Feed({
    title: `${siteMetadata.name} Blog`,
    description: "Tutorials, comparisons, and behind-the-scenes posts on building sports apps with the Mr. Doge SDK.",
    id: absoluteUrl("/blog"),
    link: absoluteUrl("/blog"),
    language: "en",
    favicon: absoluteUrl("/favicon.ico"),
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteMetadata.name}`,
    feedLinks: {
      rss: absoluteUrl("/rss.xml"),
    },
  })

  for (const post of posts) {
    feed.addItem({
      title: post.data.title,
      id: absoluteUrl(post.url),
      link: absoluteUrl(post.url),
      description: post.data.description,
      date: new Date(post.data.date),
      image: absoluteUrl(post.data.image ?? ogImagePath({ title: post.data.title, description: post.data.description })),
      category: post.data.tags?.map((tag) => ({ name: tag })),
      author: post.data.author ? [{ name: post.data.author }] : undefined,
    })
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
