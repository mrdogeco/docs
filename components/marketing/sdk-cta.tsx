import Link from "next/link"
import { SiGithub } from "react-icons/si"

import { Button } from "@/components/ui/button"
import { BrandedCta } from "./branded-cta"

export function SdkCta() {
  return (
    <BrandedCta
      title="Start shipping."
      description="Seven days free. Five minutes to first odds. Read the docs and start building."
    >
      <Button
        asChild
        size="lg"
        className="rounded-full bg-black px-6 py-3 text-white shadow-lg shadow-black/30 hover:bg-black/90"
      >
        <Link href="/docs">Read the docs</Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-full border-black/20 bg-white/30 px-5 py-3 text-black backdrop-blur hover:bg-white/50 hover:text-black"
      >
        <Link
          href="https://github.com/mrdogeco/sdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub />
          Star on GitHub
        </Link>
      </Button>
    </BrandedCta>
  )
}
