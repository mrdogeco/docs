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
});`

// Same TypeScript glyph Fumadocs injects automatically for ```ts code
// fences in MDX (see fumadocs-core's rehype-code icon transformer) — this
// code block is a standalone client component outside MDX, so it doesn't
// get that transform for free and needs the icon passed in by hand.
function TsIcon() {
  return (
    // Fumadocs' own MDX code blocks size this icon at size-3.5 when icon
    // is passed as a raw HTML string (their [&_svg]:size-3.5 wrapper);
    // ours goes in as a React node instead, which skips that wrapper, so
    // the size has to be set explicitly here to match.
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  )
}

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
        <DynamicCodeBlock lang="ts" code={CODE_SAMPLE} codeblock={{ title: "index.ts", icon: <TsIcon /> }} />
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
