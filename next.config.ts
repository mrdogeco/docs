import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  images: {
    // Next 16 turns on an allowlist for ALL local next/image sources as
    // soon as localPatterns is defined at all, not just paths with a
    // query string (the "breaking change" framing in the migration docs
    // undersells this) — every local image src in the app needs a match
    // here or it 400s.
    // - /og: our generated-OG-image route (app/og/route.tsx).
    //   title/description always come from our own content, never
    //   arbitrary user input, so allowing any search params is safe.
    // - /assets/**: every static logo/screenshot/blog-cover image in
    //   public/assets/ (confirmed via repo-wide grep — nothing else
    //   uses next/image with a local src today).
    localPatterns: [{ pathname: "/og" }, { pathname: "/assets/**" }],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
