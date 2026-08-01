import fs from "node:fs"
import path from "node:path"
import { ExpandableCode } from "@/components/docs/expandable-code"

function readSource(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf-8")
}

export function ExampleSection({
  file,
  children,
}: {
  /** Path (relative to repo root) of the demo file this example's "View Code" reveals. */
  file: string
  children: React.ReactNode
}) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border">
      <div className="flex items-center justify-center bg-background p-8">{children}</div>
      <ExpandableCode code={readSource(file)} />
    </div>
  )
}
