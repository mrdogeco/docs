import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { HomeGallery } from "@/components/home-gallery"
import { Footer } from "@/components/marketing/footer"

export default function Home() {
  return (
    <HomeLayout {...baseOptions("ui")}>
      <HomeGallery />
      <Footer />
    </HomeLayout>
  )
}
