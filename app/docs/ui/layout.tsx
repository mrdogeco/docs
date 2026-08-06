import { source } from "@/lib/source"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { docsOptions } from "@/lib/layout.shared"
import { MrDogePrefetch } from "@/components/docs/mrdoge-prefetch"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree()} {...docsOptions(true)}>
      <MrDogePrefetch />
      {children}
    </DocsLayout>
  )
}
