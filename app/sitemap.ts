import type { MetadataRoute } from "next"
import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/seo"

const staticRoutes = ["/", "/ui", "/about", "/faqs", "/terms", "/privacy"]

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

  return [...staticEntries, ...docEntries]
}
