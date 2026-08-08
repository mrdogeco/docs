// Docs live OUTSIDE the `[locale]` tree, so `Link` from `@/i18n/navigation`
// would throw "No intl context found" when rendered inside an MDX doc
// page. Plain next/link is the right primitive here: docs are
// English-only, no locale prefix to preserve.
import Link from "next/link";
import {
  SiNextdotjs,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiReact,
  SiCloudflareworkers,
} from "react-icons/si";
import { cn } from "@/lib/utils";

const LOGOS = {
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nest: SiNestjs,
  express: SiExpress,
  react: SiReact,
  "react-native": SiReact,
  cloudflare: SiCloudflareworkers,
} as const;

type FrameworkKey = keyof typeof LOGOS;

type Props = {
  framework: FrameworkKey;
  title: string;
  description?: string;
  href: string;
};

export function FrameworkCard({ framework, title, description, href }: Props) {
  const Icon = LOGOS[framework];
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-card p-5 no-underline transition-colors hover:border-fd-primary/40 hover:bg-card/80"
    >
      <Icon className="h-8 w-8 text-fd-foreground" />
      <div>
        <div className="text-base font-semibold text-fd-foreground">{title}</div>
        {description ? (
          <p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
        ) : null}
      </div>
    </Link>
  );
}

type GridProps = { children: React.ReactNode; className?: string };

export function FrameworkGrid({ children, className }: GridProps) {
  return (
    <div
      className={cn("not-prose mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {children}
    </div>
  );
}
