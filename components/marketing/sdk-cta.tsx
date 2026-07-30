import Link from "next/link"
import { SiGithub } from "react-icons/si"

import { Button } from "@/components/ui/button"

export function SdkCta() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Start shipping.
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Seven days free. Five minutes to first odds. Read the docs and start
        building.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/docs">Read the docs</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link
            href="https://github.com/mrdogeco/sdk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
            Star on GitHub
          </Link>
        </Button>
      </div>
    </section>
  )
}
