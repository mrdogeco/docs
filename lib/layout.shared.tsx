import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Mr. Doge",
      url: "/",
    },
    githubUrl: "https://github.com/mrdogeco/sdk",
    links: [
      {
        text: "Developers",
        url: "/",
      },
      {
        text: "Pricing",
        url: "/#pricing",
      },
    ],
  }
}
