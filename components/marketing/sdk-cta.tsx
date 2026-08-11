import Link from "next/link"

import { Button } from "@/components/ui/button"
import { BrandedCta } from "./branded-cta"
import { GithubStarButton } from "./github-star-button"

export function SdkCta() {
  return (
    <BrandedCta
      title="Start shipping."
      description="Seven days free. Five minutes to first odds. Read the docs and start building."
    >
      <Button
        asChild
        size="lg"
        className="rounded-full bg-black px-6 py-3 text-white shadow-lg hover:bg-black/90"
      >
        <Link href="/docs">Read the docs</Link>
      </Button>


      <GithubStarButton />
    </BrandedCta>
  )
}
