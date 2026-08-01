<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo/dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/logo/light.svg">
    <img src="public/logo/light.svg" alt="Mr. Doge" width="240" />
  </picture>
</p>

<p align="center">
  Free, open-source UI components for sports betting apps — copy-paste via shadcn/ui, real Mr. Doge SDK integration built in.
</p>

<p align="center">
  <a href="https://mrdoge.co">mrdoge.co</a> •
  <a href="https://mrdoge.co/ui">Docs</a> •
  <a href="https://x.com/mrdogeapp">@mrdogeapp</a>
</p>

The mrdoge.co codebase: Mr. Doge SDK docs and marketing, and mrdoge-ui — a
free, open-source component library for sports betting apps, distributed
as source code through a shadcn/ui-compatible registry. Components take
plain props — no dependency on any particular data provider. Hooks are
the one exception: they're a real, opinionated integration with the Mr.
Doge SDK specifically, for anyone who wants live data working out of the
box instead of wiring their own.

The developer dashboard (auth, billing, API keys) is not part of this
repo — it stays private, wherever it currently lives.

## Installation

Requires a project with Tailwind CSS and the shadcn/ui CLI configured
(`npx shadcn@latest init`). Then install a component with:

```bash
npx shadcn@latest add https://mrdoge.co/r/match-card.json
```

## Components

| Component | Description |
| --- | --- |
| `match-card` | Compact match row with teams, score or kickoff time, status, and an optional odds row |
| `odds-selector` | Selectable price buttons for a market, with price movement and suspended states |
| `odds-board` | Every market for a match at once, each with its own Odds Selector |
| `live-indicator` | Status pill for a match: scheduled, live, paused, intermission, interrupted, or finished |
| `bet-slip` | Panel for selected picks with stake input and computed potential payout |
| `match-timeline` | Chronological feed of match events |
| `team-form-indicator` | Recent match results for a team, with optional per-match detail |
| `competition-header` | Banner for a competition: name, region, and stage |
| `entity-image` | Team or region logo, unstyled — falls back to initials when the image is missing |
| `settlement-badge` | Post-settlement outcome badge: won, lost, or push |
| `ai-recommendation-card` | AI-generated pick with confidence, edge, rationale, and risk factors |
| `sport-picker` | Icon-based sport filter |
| `region-accordion` | Collapsible region list, grouped by competition, with event counts |

See [mrdoge.co/ui](https://mrdoge.co/ui) for live previews, full usage,
and props for every component, or browse the source directly under
`registry/mrdoge-ui/`.

## Hooks

Real, working WebSocket integration with the Mr. Doge SDK — not
illustrative snippets. Unlike components, these depend on `@mrdoge/client`
/ `@mrdoge/node` directly and need a `MRDOGE_ODDS_API_KEY` set server-side.

| Hook | Description |
| --- | --- |
| `use-live-match` | Subscribes to a single match over WebSocket — score, status, and clock update in real time |
| `use-live-odds` | Subscribes to a single match's live odds over WebSocket (Business tier) |
| `use-trending-matches` | Today's most-viewed matches, ranked server-side by views. One-shot, not a subscription |
| `use-odds-movement` | Diffs each bet item's price against its previous snapshot to drive Odds Selector's up/down indicators. No SDK setup — pure client-side diff over whatever market `use-live-odds` gives you |

Installing any of the first three pulls in `mrdoge-client` (the browser SDK
client singleton) and `mrdoge-token-route` (a Next.js route that mints
short-lived tokens using `@mrdoge/node` — the browser never sees the raw
API key)
automatically.

## Development

```bash
pnpm install
pnpm dev       # localhost:3001
pnpm build     # production build
```

Registry JSON (served from `public/r/`) is generated from `registry.json`
with:

```bash
pnpm dlx shadcn@latest build
```

Run this after adding or editing a component so the built output in
`public/r/` stays in sync with `registry.json`.

## Use with the Mr. Doge SDK

mrdoge-ui components accept plain props, so they work with any data
source. Real integration code lives in `lib/sdk-adapters/` — one pure
mapper function per component, taking an actual `@mrdoge/protocol` type
and returning that component's props. If the SDK's response shape
changes, the adapter fails to compile instead of silently going stale.
Each component's own doc page has a "Use with the Mr. Doge SDK" section
showing its adapter as a live example.

## Contributing

Bug reports and pull requests welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
