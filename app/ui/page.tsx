import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { HomeGallery } from "@/components/home-gallery"

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <HomeGallery />
    </HomeLayout>
  )
}
