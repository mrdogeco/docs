import type { Metadata } from "next"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Footer } from "@/components/marketing/footer"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared"
import { buildMetadata } from "@/lib/seo"
import { faqPageJsonLd } from "@/lib/json-ld"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = buildMetadata({
  title: "FAQs | Mr. Doge API",
  description: "Find quick answers about subscriptions, billing, AI predictions, available sports, and support options inside the Mr. Doge developer platform.",
  path: "/faqs",
})

// Ported from old_mrdoge-co's (landing)/faqs/page.tsx, rewritten for the
// current Stripe subscription model (was pay-as-you-go credits). See
// content/legal/terms.ts's header comment for the same context. Also
// fixed a real factual error carried over from the old draft: AI
// recommendations are Business-tier only, not "starting from Growth"
// (confirmed against lib/sdk-tiers.ts's actual feature list).
const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I get started with Mr. Doge API?",
        answer:
          "Sign up for a free account, pick a plan, and start your 7-day free trial. A card is required, but you won't be charged until the trial ends. Create your first API key from the dashboard and start making requests using our documentation.",
      },
      {
        question: "Do I need a credit card to sign up?",
        answer:
          "Creating an account is free and doesn't require a card. Starting a subscription trial does: every plan includes a 7-day free trial, but a payment method is required upfront so the subscription can continue automatically once the trial ends.",
      },
      {
        question: "Can I switch plans later?",
        answer:
          "Cancelling and switching to a different tier is on the roadmap. Today, upgrading is one click from the billing page once you're off your trial; downgrading requires cancelling your current subscription and starting a new one on the lower tier.",
      },
    ],
  },
  {
    category: "Pricing & Billing",
    questions: [
      {
        question: "How does billing work?",
        answer:
          "Mr. Doge is billed as a monthly or annual subscription per tier (Starter, Growth, Business) through Stripe. Every plan includes a 7-day free trial; if you don't cancel before it ends, your card is charged the plan's price and the subscription renews automatically each period.",
      },
      {
        question: "What happens if I exceed my rate limit?",
        answer:
          "Requests beyond your tier's per-minute limit return a rate_limited error with a retryAfterMs value telling you exactly how long to wait. The SDK doesn't auto-retry, but the metadata makes it straightforward to implement backoff yourself.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Subscription charges are generally non-refundable, but if something went wrong on our end or you have concerns about a charge, contact support@mrdoge.co and we'll work with you to find a solution.",
      },
      {
        question: "Do you offer enterprise plans?",
        answer:
          "Yes. For custom rate limits, data redistribution rights, white-label use, dedicated infrastructure, or an SLA, contact us at support@mrdoge.co to discuss Enterprise terms.",
      },
    ],
  },
  {
    category: "API & Technical",
    questions: [
      {
        question: "What sports and markets do you cover?",
        answer:
          "We currently cover major sports including soccer, basketball, tennis, and more, across leagues and competitions worldwide, with real-time odds and stats for thousands of events. Check the docs for the full method reference.",
      },
      {
        question: "How often is odds data updated?",
        answer: "Live odds are pushed over WebSocket as they change, no polling needed. HTTP endpoints reflect the latest snapshot at request time.",
      },
      {
        question: "What are the API rate limits?",
        answer: "Rate limits are per-key, per-minute, shared across HTTP and WebSocket: 300 req/min on Starter, 1,000 on Growth, 5,000 on Business.",
      },
      {
        question: "Do you provide historical odds data?",
        answer: "Not yet. This is on our roadmap. The current API surfaces live and upcoming match data only.",
      },
      {
        question: "Can I use the API for commercial purposes?",
        answer:
          "Yes. The SDK is licensed for direct integration into your own applications, commercial or personal. Reselling or redistributing the raw data stream to third parties requires a separate Enterprise license. See the Terms of Service for details.",
      },
    ],
  },
  {
    category: "AI Features",
    questions: [
      {
        question: "What AI features do you offer?",
        answer:
          "The Business tier includes an AI recommendations endpoint: edge-and-confidence-scored picks with supporting rationale and risk factors, generated server-side from our odds and stats models.",
      },
      {
        question: "How accurate are the AI predictions?",
        answer:
          "Predictions are probabilistic, based on statistical models and historical data, not guarantees. Past performance doesn't guarantee future results. Use them as one input among many, not as a standalone signal.",
      },
      {
        question: "Are AI features included in all plans?",
        answer:
          "No. AI recommendations are exclusive to the Business tier. Starter and Growth cover discovery, live scores, and match state, but not odds or AI picks.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        question: "How can I get help if I have issues?",
        answer:
          "Community support is available to everyone. Growth and Business plans include priority email support. Enterprise customers get dedicated support terms as part of their contract.",
      },
      {
        question: "Do you have API documentation?",
        answer: "Yes, full documentation lives at mrdoge.co/docs, with quickstarts, guides per runtime, and a complete method reference, kept up to date as the SDK evolves.",
      },
      {
        question: "Where can I report bugs or request features?",
        answer: "Email us at support@mrdoge.co. We read every message and factor it into the roadmap.",
      },
    ],
  },
]

export default function FAQsPage() {
  return (
    <HomeLayout {...baseOptions()}>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Frequently asked questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about the Mr. Doge API. Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="mailto:support@mrdoge.co" className="text-foreground underline underline-offset-4">
              Contact support
            </Link>
            .
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-12">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-semibold tracking-tight">{category.category}</h2>
              <Accordion type="single" collapsible className="mt-4 flex flex-col gap-3">
                {category.questions.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question} className="rounded-xl border px-5">
                    <AccordionTrigger className="py-4 text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </HomeLayout>
  )
}
