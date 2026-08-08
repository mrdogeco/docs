import { MarkdownCopyButton, ViewOptionsPopover } from "fumadocs-ui/layouts/docs/page"

export function PageActions({ slug }: { slug: string[] }) {
  const markdownUrl = `/raw/${slug.join("/")}`

  return (
    <div className="flex items-center gap-2">
      <MarkdownCopyButton markdownUrl={markdownUrl}>Copy</MarkdownCopyButton>
      <ViewOptionsPopover markdownUrl={markdownUrl} />
    </div>
  )
}
