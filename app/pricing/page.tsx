import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"
import { SdkPricing } from "@/components/marketing/sdk-pricing"
import { PricingComparisonTable } from "@/components/marketing/pricing-comparison-table"
import { Footer } from "@/components/marketing/footer"

export const metadata: Metadata = buildMetadata({
  title: "Pricing | Mr. Doge API",
  description: "Mr. Doge API pricing: Starter, Growth, and Business tiers, each with a 7-day free trial. Compare plans and see how we stack up.",
  path: "/pricing",
})

// Same <SdkPricing/> section as the homepage's #pricing anchor — this
// page exists for direct links/SEO ("mrdoge.co/pricing") and to host
// content that doesn't belong on the homepage, like the comparison table
// below.
export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <SdkPricing />
      <PricingComparisonTable />
      <Footer />
    </HomeLayout>
  )
}
