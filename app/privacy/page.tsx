import type { Metadata } from "next"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { LegalPage } from "@/components/legal/legal-page"
import { Footer } from "@/components/marketing/footer"
import { buildMetadata } from "@/lib/seo"
import { privacyData } from "@/content/legal/privacy"

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Mr. Doge API",
  description:
    "Understand how Mr. Doge collects, stores, and protects account information, API usage data, and analytics to power our sports odds platform.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <LegalPage data={privacyData} />
      <Footer />
    </HomeLayout>
  )
}
