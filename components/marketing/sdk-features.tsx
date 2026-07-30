const FEATURES = [
  {
    title: "Built for speed",
    body: "~200ms first paint and low-latency live updates — fast by default. The SDK races HTTP cache against WebSocket on cold start, so your UI never waits for a handshake.",
  },
  {
    title: "HTTP + WebSocket, one client",
    body: "Reads route through HTTP when the socket isn't open; live subscriptions ride the WS once connected. One client, both transports.",
  },
  {
    title: "Typed end to end",
    body: "Schemas validate every request server-side and ship as TypeScript types to your client. Autocomplete from the first call to the last.",
  },
  {
    title: "Browser-safe by design",
    body: "Your API key stays on your server. The frontend authenticates via short-lived JWTs minted by a route you control. No bundled secrets, no key in your bundle, ever.",
  },
  {
    title: "More than odds",
    body: "Odds, scores, stats, and team form across hundreds of leagues. Plus AI picks that ship with confidence, edge, and the reasoning behind them.",
  },
  {
    title: "Localized everywhere",
    body: "Every call accepts a locale. Team names, competition titles, status labels, and timestamps come back in English, Spanish, or Portuguese. Set a client default or override per call.",
  },
]

export function SdkFeatures() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-3 text-center">
        <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          What&apos;s in the box
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">
          Everything the Mr. Doge app runs on.
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          The same SDK powers the consumer app, the developer dashboard, and
          your product. One source of truth, three transports.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-2xl border p-5">
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
