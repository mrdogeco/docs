"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Copy } from "lucide-react"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

const INSTALL_COMMAND = "npm i @mrdoge/node"

const CODE_SAMPLE = `import { MrDoge } from "@mrdoge/node";

const mrdoge = new MrDoge({
  apiKey: process.env.MRDOGE_API_KEY!,
});

// stream live matches
const sub = await mrdoge.matches.subscribeLive({
  sports: ["soccer"],
});

sub.on("match.upd", (match) => {
  // live scores, corners, cards, etc.
  console.log(match.stats);
});

// or pull today's AI picks
const { data } = await mrdoge.ai.recommendations.list({
  limit: 10,
  minOdds: 1.5,
});`

function InstallCommand() {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(INSTALL_COMMAND)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border bg-muted px-5 py-2.5 font-mono text-sm text-foreground/90 transition-colors hover:bg-muted/70"
    >
      <span>
        <span className="text-muted-foreground">$</span> {INSTALL_COMMAND}
      </span>
      {copied ? (
        <Check className="size-3.5 shrink-0" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
}

export function SdkQuickstart() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Quick start
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          From zero to a full app in five minutes.
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Install one package. Mint an API key. You&apos;re streaming.
        </p>
      </div>

      <div className="mt-8">
        <InstallCommand />
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <DynamicCodeBlock lang="ts" code={CODE_SAMPLE} codeblock={{ title: "index.ts" }} />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/docs"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          Full reference in the docs
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
