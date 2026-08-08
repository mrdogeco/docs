import Link from "next/link"
import { SiGithub } from "react-icons/si"

import { Button } from "@/components/ui/button"
import { bungee } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { FluidMorphCard } from "./fluid-morph-card"

// Same font + gradient treatment as mrdoge.ai/developers' hero title —
// Bungee display font, uppercase, tight leading. Only the second line
// gets the warm gradient fill; the first stays plain white.
const TITLE_CLASSNAME = cn(bungee.className, "uppercase leading-[0.88] tracking-tight")

export function SdkHero() {
  return (
    <FluidMorphCard
      titleAs="h1"
      title={
        <>
          The odds in
          <br />
          <span className="bg-gradient-to-br from-[#FADFAD] via-[#FAAF45] to-[#EC4899] bg-clip-text text-transparent">
            your favor.
          </span>
        </>
      }
      titleClassName={TITLE_CLASSNAME}
      description="Matches, live odds, stats, AI predictions and insights. Native WebSocket support. Typed end to end."
    >
      <Button asChild size="lg" className="rounded-full bg-white px-6 py-3 text-black shadow-lg shadow-black/30 hover:bg-white/90">
        <Link href="/docs">Read the docs</Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="rounded-full border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur hover:bg-white/20 hover:text-white"
      >
        <Link href="https://github.com/mrdogeco/sdk" target="_blank" rel="noopener noreferrer">
          <SiGithub />
          Star on GitHub
        </Link>
      </Button>
    </FluidMorphCard>
  )
}
