import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "mrdoge-ui",
      url: "/",
    },
    githubUrl: "https://github.com/mrdogeco/ui",
    links: [
      {
        text: "Documentation",
        url: "/docs",
      },
    ],
  }
}
