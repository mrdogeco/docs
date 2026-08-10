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

/** Path to this page's generated OG image — see app/og/route.tsx. */
export function ogImagePath({ title, description }: { title: string; description: string }): string {
  const params = new URLSearchParams({ title, description })
  return `/og?${params.toString()}`
}

interface BuildMetadataInput {
  title: string
  description: string
  path?: string
  /** Relative path (or full URL) to a hand-made image, overriding the auto-generated OG image. */
  image?: string
}

export function buildMetadata({ title, description, path = "/", image }: BuildMetadataInput): Metadata {
  const pageUrl = absoluteUrl(path)
  const imageUrl = absoluteUrl(image ?? ogImagePath({ title, description }))

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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteMetadata.name} preview` }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteMetadata.twitter,
      creator: siteMetadata.twitter,
      title,
      description,
      images: [imageUrl],
    },
  }
}
