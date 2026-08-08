import Image from "next/image"
import Link from "next/link"
import { SiGithub, SiReddit, SiX, SiInstagram } from "react-icons/si"
import { FaLinkedin, } from "react-icons/fa"
import { cn } from "@/lib/utils"
import { bungee } from "@/lib/fonts"

const LINK_GROUPS = [
  {
    group: "Product",
    items: [
      { title: "Documentation", href: "/docs" },
      { title: "Components", href: "/ui" },
      { title: "Pricing", href: "/pricing" },
    ],
  },
  {
    group: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "FAQs", href: "/faqs" },
    ],
  },
  {
    group: "Legal",
    items: [
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com/mrdogeco", icon: SiGithub },
  { label: "Reddit", url: "https://www.reddit.com/r/mrdoge/", icon: SiReddit },
  { label: "X", url: "https://x.com/mrdogeapp", icon: SiX, size: "size-3.5" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/mrdoge/", icon: FaLinkedin, size: "size-5" },
  { label: "Instagram", url: "https://www.instagram.com/mrdoge.ai/", icon: SiInstagram },
]

export function Footer() {
  return (
    <footer className="dark sm:mt-24 border-t bg-background text-foreground">
      <div className="mx-auto max-w-(--fd-layout-width) px-4 pt-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" aria-label="Home" className="block size-fit">
              <Image
                src="/assets/mrdoge-logo-light.svg"
                alt="Mr. Doge"
                width={108}
                height={24}
                className="dark:hidden"
              />
              <Image
                src="/assets/mrdoge-logo-dark.svg"
                alt="Mr. Doge"
                width={108}
                height={24}
                className="hidden dark:block"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The go-to developer ecosystem for sports apps.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 md:col-span-3">
            {LINK_GROUPS.map((group) => (
              <div key={group.group} className="space-y-4 text-sm">
                <span className="block font-medium">{group.group}</span>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-muted-foreground duration-150 hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-(--fd-layout-width) px-4">
        <div className="my-6 flex flex-wrap items-center justify-between gap-6 border-t py-6">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mr. Doge
          </span>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, url, icon: Icon, size = "size-4" }) => (
              <Link
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon className={size} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-(--fd-layout-width) space-y-3 px-4 pb-12">
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          The Mr. Doge SDK provides sports data, odds, and AI-generated
          recommendations as statistical output, not guarantees of any
          outcome. Past model performance is not indicative of future
          results. If you build products on top of this data, including
          real-money betting products, you are responsible for complying
          with the gambling and gaming laws of every jurisdiction you
          operate in. Mr. Doge does not itself accept, hold, or process
          real-money wagers. Gambling can be addictive: if you or someone
          you know is struggling, please seek help.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          Team, league, and competition names, crests, and other
          identifying marks surfaced through the SDK and mrdoge-ui belong
          to their respective owners. Mr. Doge is not affiliated with,
          endorsed by, or sponsored by any league, club, or sports
          organization. These marks appear solely for editorial
          identification, to help end users recognize the matches, teams,
          and competitions the data covers. The same posture applies to
          any product built on top of this data.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          The sunglasses in the hero are based on a{" "}
          <Link
            href="https://sketchfab.com/3d-models/rayban-sunglasses-6c37ef3c6bd2481d94324b3555259e03"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            3D model
          </Link>{" "}
          by{" "}
          <Link
            href="https://sketchfab.com/aayushveni"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            aayushveni
          </Link>
          , licensed under{" "}
          <Link
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            CC BY 4.0
          </Link>
          .
        </p>
      </div>

      {/* Giant edge-to-edge wordmark. Full-bleed on purpose (outside the
          layout-width container above) so it spans the actual footer
          width, not just its content column. font-size alone (even with
          vw units) only approximates a target width — different text
          renders at different natural widths, so it never lines up
          exactly edge to edge. `textLength` + `lengthAdjust` stretch the
          glyphs themselves to an exact width instead, and the SVG's own
          width:100% scaling makes that responsive at every breakpoint. */}
      <div aria-hidden className="mx-auto max-w-(--fd-layout-width) overflow-hidden select-none">
        <svg viewBox="0 0 1000 220" className="block h-auto w-full">
          <text
            x="0"
            y="180"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className={cn(bungee.className, "fill-foreground/15 text-[190px] font-extrabold")}
          >
            MR. DOGE
          </text>
        </svg>
      </div>
    </footer>
  )
}
