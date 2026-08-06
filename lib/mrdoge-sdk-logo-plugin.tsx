import Image from "next/image"
import type { LoaderPlugin } from "fumadocs-core/source"

const MRDOGE_SDK_LOGO = (
  <>
    <Image
      src="/assets/mrdoge-sdk-light.svg"
      alt="Mr. Doge SDK"
      width={200}
      height={50}
      className="dark:hidden w-30 h-5 -ml-0.5 scale-[0.94]"
    />
    <Image
      src="/assets/mrdoge-sdk-dark.svg"
      alt="Mr. Doge SDK"
      width={200}
      height={50}
      className="hidden dark:block w-30 h-5 -ml-0.5 scale-[0.94]"
    />
  </>
)

/** Renders the "Mr. Doge SDK" sidebar folder as its wordmark logo instead of an icon + text label. */
export function mrdogeSdkLogoPlugin(): LoaderPlugin {
  return {
    name: "mrdoge-sdk-logo",
    transformPageTree: {
      folder(node, folderPath) {
        if (folderPath.endsWith("mrdoge-sdk") || node.name === "Mr. Doge SDK") {
          node.name = MRDOGE_SDK_LOGO
          node.icon = undefined
        }
        return node
      },
    },
  }
}
