import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Deliberately no named competitors: we don't have verified, current
// pricing/feature data for any specific provider, and getting a
// competitor's own product wrong in a public comparison is a real
// accuracy (and legal) risk. "Typical sports data APIs" instead
// describes well-known patterns in this space generally, not any one
// company's actual offering.
const ROWS = [
  {
    feature: "Typed SDK (Node, browser, React Native)",
    others: "Often just raw REST, no typed client",
  },
  {
    feature: "Native WebSocket support for live data",
    others: "Rare, most require polling",
  },
  {
    feature: "AI picks with reasoning, not just a number",
    others: "Rare, usually a bare probability or none",
  },
  {
    feature: "Open-source, copy-paste UI components (mrdoge-ui)",
    others: "Rare, you build the UI yourself from raw JSON",
  },
  {
    feature: "Easy documentation: real examples, one-click copy as markdown",
    others: "Often sparse, outdated, or missing real examples",
  },
  {
    feature: "Free trial, no sales call required",
    others: "Uncommon, usually an enterprise sales process",
  },
]

export function PricingComparisonTable() {
  return (
    <section id="comparison" className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Comparison
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          How Mr. Doge stacks up
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          General patterns we see across sports data APIs, not any one
          provider&apos;s actual product.
        </p>
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Feature
              </th>
              <th scope="col" className="p-0 text-center">
                <Image src="/assets/mrdoge-logo-light.svg" alt="Mr. Doge" width={90} height={20} className="mx-auto dark:hidden" />
                <Image src="/assets/mrdoge-logo-dark.svg" alt="Mr. Doge" width={90} height={20} className="mx-auto hidden dark:block" />
              </th>
              <th scope="col" className="p-4 text-left font-medium text-muted-foreground">
                Other sports data APIs
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ROWS.map((row) => (
              <tr key={row.feature}>
                <td className="p-4 text-foreground">{row.feature}</td>
                <td className="p-4 text-center">
                  <span
                    className={cn(
                      "mx-auto flex size-6 items-center justify-center rounded-full",
                      "bg-gradient-to-br from-[#EC4899] to-[#FAAF45] text-white",
                    )}
                  >
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{row.others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
