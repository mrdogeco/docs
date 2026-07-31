import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import Image from "next/image"
import { SiGithub, SiReddit, SiX, SiInstagram } from "react-icons/si"
import { FaLinkedin } from "react-icons/fa"

const NAV_TITLE = {
  title: (
    <>
      <Image
        src="/logo/light.svg"
        alt="Mr. Doge"
        width={108}
        height={24}
        className="dark:hidden"
      />
      <Image
        src="/logo/dark.svg"
        alt="Mr. Doge"
        width={108}
        height={24}
        className="hidden dark:block"
      />
    </>
  ),
  url: "/",
}

const SDK_GITHUB = "https://github.com/mrdogeco/sdk"
const UI_GITHUB = "https://github.com/mrdogeco/ui"

function githubLink(url: string) {
  return {
    text: "GitHub",
    url,
    icon: <SiGithub className="size-4" />,
    type: "icon" as const,
    external: true,
  }
}

const OTHER_SOCIAL_LINKS: NonNullable<BaseLayoutProps["links"]> = [
  {
    text: "Reddit",
    url: "https://www.reddit.com/r/mrdoge/",
    icon: <SiReddit className="size-4" />,
    type: "icon",
    external: true,
  },
  {
    text: "X",
    url: "https://x.com/mrdogeapp",
    icon: <SiX className="size-3.5" />,
    type: "icon",
    external: true,
  },
  {
    text: "LinkedIn",
    url: "https://www.linkedin.com/company/mrdoge/",
    icon: <FaLinkedin className="size-5" />,
    type: "icon",
    external: true,
  },
  {
    text: "Instagram",
    url: "https://www.instagram.com/mrdoge.ai/",
    icon: <SiInstagram className="size-4" />,
    type: "icon",
    external: true,
  },
]

/**
 * Home layout (`/`, `/ui`) — nav links + a single GitHub icon, no other
 * social icons. `variant` picks which repo the GitHub icon points at.
 */
export function baseOptions(variant: "sdk" | "ui" = "sdk"): BaseLayoutProps {
  return {
    nav: NAV_TITLE,
    links: [
      { text: "Documentation", url: "/docs" },
      { text: "Components", url: "/ui" },
      { text: "Pricing", url: "/#pricing" },
      githubLink(variant === "ui" ? UI_GITHUB : SDK_GITHUB),
    ],
  }
}

/**
 * Docs layout — root-aware. The SDK root shows Developers/Pricing; the UI
 * root doesn't (those are SDK-specific). The GitHub icon always points at
 * whichever repo matches the currently active root.
 */
export function docsOptions(isUiRoot: boolean): BaseLayoutProps {
  return {
    nav: NAV_TITLE,
    links: [
      ...(isUiRoot
        ? []
        : [
            { text: "Developers", url: "/" },
            { text: "Pricing", url: "/#pricing" },
          ]),
      githubLink(isUiRoot ? UI_GITHUB : SDK_GITHUB),
      ...OTHER_SOCIAL_LINKS,
    ],
  }
}
