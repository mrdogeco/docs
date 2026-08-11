"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Frequency = "monthly" | "annual"

interface Tier {
  key: string
  label: string
  description: string
  price: string
  annualPrice: string
  annualTotal: string
  originalPrice?: string
  discountBadge?: string
  inheritsFrom?: string
  features: string[]
  popular?: boolean
  /** Stripe Price UUIDs (DB), checked out at dashboard.mrdoge.co/checkout/[priceId]. Keep in sync with mrdoge-dashboard's lib/sdk-prices.ts. */
  priceId: { monthly: string; annual: string }
}

const TIERS: Tier[] = [
  {
    key: "starter",
    label: "Starter",
    description:
      "For small projects and prototypes. Static match, team, and competition data.",
    price: "$29.90",
    annualPrice: "$24.99",
    annualTotal: "$299.90",
    priceId: { monthly: "abb7b0b7-1026-47a9-b475-4474e6bddc40", annual: "c7f1093e-5924-40ba-8896-aa1040305139" },
    features: [
      "Browse matches, teams, competitions",
      "Details & search",
      "300 requests / min",
      "Community support",
    ],
  },
  {
    key: "growth",
    label: "Growth",
    description:
      "For production apps. Live match state and stats, no odds yet.",
    price: "$59.90",
    annualPrice: "$44.99",
    annualTotal: "$539.90",
    priceId: { monthly: "3ad1e3df-5af4-40d5-ac5a-2d765f41845d", annual: "0c00a6bc-7473-4edd-8abc-3cc72cbee0b5" },
    inheritsFrom: "Starter",
    popular: true,
    features: [
      "Live scores & match state (WebSocket)",
      "Trending matches",
      "1,000 requests / min",
      "Priority support",
    ],
  },
  {
    key: "business",
    label: "Business",
    description:
      "For high-volume products. Live odds, AI recommendations, and per-match streams: everything included.",
    price: "$199.90",
    originalPrice: "$299.90",
    discountBadge: "Limited-time price",
    annualPrice: "$133.33",
    annualTotal: "$1,599.90",
    priceId: { monthly: "cf4011fc-4b87-4989-bad9-fa7ba9071983", annual: "3e851e6f-3688-4e48-97d0-7005bcec724f" },
    inheritsFrom: "Growth",
    features: [
      "Live odds feed (WebSocket)",
      "AI recommendations API",
      "Per-match subscriptions",
      "5,000 requests / min",
    ],
  },
]

const DASHBOARD_URL = "https://dashboard.mrdoge.co"

export function SdkPricing({ compareHref }: { compareHref?: string } = {}) {
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const isMonthly = frequency === "monthly"

  return (
    <section id="pricing" className="relative mx-auto w-full max-w-5xl px-6 pt-32 pb-16">
      {/* Same sunset radial backdrop as mrdoge.ai's pricing section — low
          enough opacity to read on both light and dark theme. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(236,72,153,0.08),transparent_70%)]"
      />
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Pricing
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          Try free for 7 days. Then pick the plan that fits.
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Every plan ships the same SDK. Tiers unlock request volume, live
          data, and AI recommendations.
        </p>
        <p className="text-sm text-muted-foreground">
          Every plan includes a 7-day free trial. Card required.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <div
          role="tablist"
          aria-label="Billing frequency"
          className="inline-flex items-center rounded-full border bg-muted p-1"
        >
          {(["monthly", "annual"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={frequency === f}
              onClick={() => setFrequency(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize",
                frequency === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <TierCard key={tier.key} tier={tier} isMonthly={isMonthly} />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm font-semibold tracking-wide uppercase">
            Enterprise
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Custom limits, data redistribution & relay rights, white-label,
            dedicated infrastructure, SLA, and security review.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="shrink-0">
          <Link href="mailto:support@mrdoge.co?subject=Enterprise%20SDK">
            Contact sales
            <ArrowRight />
          </Link>
        </Button>
      </div>

      {compareHref && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href={compareHref} className="font-medium text-foreground underline underline-offset-4 hover:no-underline">
            See how we compare to other sports data APIs
          </Link>
        </p>
      )}
    </section>
  )
}

function TierCard({ tier, isMonthly }: { tier: Tier; isMonthly: boolean }) {
  const showDiscount = isMonthly && tier.originalPrice

  const card = (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl p-6",
        tier.popular ? "bg-card" : "border",
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-r from-[#EC4899] to-[#FAAF45] px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-[#EC4899]/30">
            Most popular
          </div>
        </div>
      )}

      <div className="text-sm font-semibold tracking-wide uppercase">
        {tier.label}
      </div>

      {showDiscount && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground line-through">
            {tier.originalPrice}
          </span>
          {tier.discountBadge && (
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              {tier.discountBadge}
            </Badge>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex items-baseline gap-1",
          showDiscount ? "mt-1" : "mt-4",
        )}
      >
        <span className="text-3xl font-bold tracking-tight">
          {isMonthly ? tier.price : tier.annualPrice}
        </span>
        <span className="text-xs text-muted-foreground">/ month</span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {isMonthly
          ? "Billed monthly"
          : `Billed annually (${tier.annualTotal})`}
      </p>

      <p className="mt-3 text-sm text-muted-foreground">
        {tier.description}
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5 border-t pt-5">
        {tier.inheritsFrom && (
          <li className="text-sm font-medium">
            Everything in {tier.inheritsFrom}, plus
          </li>
        )}
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                tier.popular
                  ? "bg-gradient-to-br from-[#EC4899] to-[#FAAF45] text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Check className="size-2.5 stroke-[3]" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        variant={tier.popular ? "default" : "secondary"}
        size="lg"
        className="mt-6 w-full"
      >
        <Link href={`${DASHBOARD_URL}/checkout/${isMonthly ? tier.priceId.monthly : tier.priceId.annual}`}>
          Start 7-day trial
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )

  if (!tier.popular) return card

  return (
    <div className="relative">
      {/* Gradient border, via an inset -1px layer behind the card. */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#EC4899] via-[#FAAF45] to-[#FADFAD]"
      />
      {/* Outer glow. */}
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[1.75rem] bg-gradient-to-br from-[#EC4899]/30 via-[#FAAF45]/15 to-transparent blur-2xl"
      />
      {card}
    </div>
  )
}
