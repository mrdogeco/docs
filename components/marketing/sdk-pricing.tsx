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
      "For production apps. Live match state and stats — no odds yet.",
    price: "$59.90",
    annualPrice: "$44.99",
    annualTotal: "$539.90",
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
      "For high-volume products. Live odds, AI recommendations, and per-match streams — everything included.",
    price: "$199.90",
    originalPrice: "$299.90",
    discountBadge: "Limited-time price",
    annualPrice: "$133.33",
    annualTotal: "$1,599.90",
    inheritsFrom: "Growth",
    features: [
      "Live odds feed (WebSocket)",
      "AI recommendations API",
      "Per-match subscriptions",
      "5,000 requests / min",
    ],
  },
]

// The real pricing CTAs go through /login -> Stripe checkout in mrdoge-ai.
// That auth/billing flow doesn't exist in this repo yet (dashboard
// migration is a separate task), so every tier links to /docs for now.
const PLACEHOLDER_CTA_HREF = "/docs"

export function SdkPricing() {
  const [frequency, setFrequency] = useState<Frequency>("monthly")
  const isMonthly = frequency === "monthly"

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Pricing
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          Try free for 7 days. Pay when you scale.
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
    </section>
  )
}

function TierCard({ tier, isMonthly }: { tier: Tier; isMonthly: boolean }) {
  const showDiscount = isMonthly && tier.originalPrice

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-6",
        tier.popular && "border-foreground",
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge>Most popular</Badge>
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
            <Badge variant="secondary">{tier.discountBadge}</Badge>
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
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
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
        <Link href={PLACEHOLDER_CTA_HREF}>
          Start 7-day trial
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}
