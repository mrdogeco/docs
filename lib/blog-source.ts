import { blog } from "collections/server"
import { loader } from "fumadocs-core/source"

// Own loader/baseUrl, deliberately not merged into lib/source.ts's
// `source` — blog posts are a flat list, not a docs sidebar tree, and a
// separate baseUrl means routes work directly with no prefix-stripping
// (see app/docs/ui/[[...slug]]/page.tsx's fullSlug() trick, which this
// avoids needing entirely).
export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
})
