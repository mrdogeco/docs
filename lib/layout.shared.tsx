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

// Its own app on its own subdomain, not a route under this domain.
// `icon: false` (not just omitted) suppresses SidebarItem's own
// icon-less-external fallback — it renders `icon ?? (external && <ExternalLink/>)`,
// so only an explicit non-nullish icon value opts out.
const DASHBOARD_LINK = { text: "Dashboard", url: "https://dashboard.mrdoge.co", external: true, icon: false }

// Same fumadocs-ui ThemeSwitch used everywhere on this site — buttons
// don't get a pointer cursor by default here (no Tailwind preflight rule
// for it), so every render needs the override explicitly.
const THEME_SWITCH = { className: "cursor-pointer" }

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
      ...(variant === "ui" ? [] : [DASHBOARD_LINK]),
      githubLink(variant === "ui" ? UI_GITHUB : SDK_GITHUB),
    ],
    themeSwitch: THEME_SWITCH,
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
            DASHBOARD_LINK,
          ]),
      githubLink(isUiRoot ? UI_GITHUB : SDK_GITHUB),
      ...OTHER_SOCIAL_LINKS,
    ],
    themeSwitch: THEME_SWITCH,
  }
}
