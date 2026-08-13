import type { MetadataRoute } from "next"
import { source } from "@/lib/source"
import { blogSource } from "@/lib/blog-source"
import { absoluteUrl } from "@/lib/seo"

const staticRoutes = ["/", "/ui", "/blog", "/pricing", "/about", "/faqs", "/terms", "/privacy"]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }))

  const docEntries: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogSource.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    lastModified: new Date(page.data.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticEntries, ...docEntries, ...blogEntries]
}
