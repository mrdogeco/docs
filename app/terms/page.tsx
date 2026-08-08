import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { LegalPage } from "@/components/legal/legal-page"
import { Footer } from "@/components/marketing/footer"
import { buildMetadata } from "@/lib/seo"
import { termsData } from "@/content/legal/terms"

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Mr. Doge API",
  description:
    "Review Mr. Doge's Terms of Service covering API usage, subscription billing, limitations, data accuracy, and your responsibilities when building with our sports odds platform.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <LegalPage data={termsData} />
      <Footer />
    </HomeLayout>
  )
}
