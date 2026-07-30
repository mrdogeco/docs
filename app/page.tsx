import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { SdkHero } from "@/components/marketing/sdk-hero"
import { SdkFeatures } from "@/components/marketing/sdk-features"
import { SdkQuickstart } from "@/components/marketing/sdk-quickstart"
import { SdkPricing } from "@/components/marketing/sdk-pricing"
import { SdkCta } from "@/components/marketing/sdk-cta"

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <SdkHero />
      <SdkFeatures />
      <SdkQuickstart />
      <SdkPricing />
      <SdkCta />
    </HomeLayout>
  )
}
