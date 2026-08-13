import { defineDocs, defineConfig } from "fumadocs-mdx/config"
import { pageSchema } from "fumadocs-core/source/schema"
import { z } from "zod"

export const docs = defineDocs({
  dir: "content/docs",
})

// Flat, chronological content — no meta.json/sidebar tree needed, so
// `meta` is intentionally omitted. Own baseUrl in lib/blog-source.ts,
// not merged into the docs collection above.
export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      date: z.string(),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
      /** Falls back to the auto-generated OG image (see lib/seo.ts's ogImagePath) when omitted. */
      image: z.string().optional(),
    }),
  },
})

export default defineConfig()
