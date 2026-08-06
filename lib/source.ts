import { docs } from "collections/server"
import { loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons"
import { mrdogeSdkLogoPlugin } from "@/lib/mrdoge-sdk-logo-plugin"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), mrdogeSdkLogoPlugin()],
})
