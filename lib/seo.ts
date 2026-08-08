import type { Metadata } from "next"

// Ported from old_mrdoge-co's lib/seo.ts. Same buildMetadata() shape
// (canonical URL + OpenGraph + Twitter card on every page). Dropped the
// `keywords` field the old version had: Google has ignored the meta
// keywords tag since ~2009, it's dead weight.
export const siteMetadata = {
  name: "Mr. Doge",
  url: "https://mrdoge.co",
  contact: "support@mrdoge.co",
  twitter: "@mrdogeapp",
}

export const absoluteUrl = (path = "/") => new URL(path, siteMetadata.url).toString()

interface BuildMetadataInput {
  title: string
  description: string
  path?: string
  /** Relative path under /public, e.g. "/og.png". Omit until a real one exists: no OG image beats a broken one. */
  image?: string
}

export function buildMetadata({ title, description, path = "/", image }: BuildMetadataInput): Metadata {
  const pageUrl = absoluteUrl(path)
  const imageUrl = image ? absoluteUrl(image) : undefined

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: siteMetadata.name,
      title,
      description,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteMetadata.name} preview` }] }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      site: siteMetadata.twitter,
      creator: siteMetadata.twitter,
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}
