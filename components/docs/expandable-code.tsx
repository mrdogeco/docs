"use client"

import { useState } from "react"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { cn } from "@/lib/utils"

export function ExpandableCode({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative border-t">
      <div className={cn("overflow-hidden", !expanded && "max-h-40")}>
        <DynamicCodeBlock
          lang={lang}
          code={code}
          codeblock={{ className: "my-0 rounded-none border-none border-t-0 shadow-none" }}
        />
      </div>
      <div
        className={cn(
          "flex justify-center",
          expanded
            ? "border-t py-3"
            : "absolute inset-x-0 bottom-0 bg-gradient-to-t from-fd-background via-fd-background/90 to-transparent pt-16 pb-4"
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md border bg-fd-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-fd-accent"
        >
          {expanded ? "Hide Code" : "View Code"}
        </button>
      </div>
    </div>
  )
}
