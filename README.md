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
| `bet-slip` | Panel for selected picks with stake input and computed potential payout |
| `match-timeline` | Chronological feed of match events |
| `ai-recommendation-card` | AI-generated pick with confidence, edge, rationale, and risk factors |
| `region-accordion` | Collapsible region list, grouped by competition, with event counts |
| `live-indicator` | Status pill for a match: scheduled, live, paused, intermission, interrupted, or finished |
| `settlement-badge` | Post-settlement outcome badge: won, lost, or push |
| `team-form-indicator` | Recent match results for a team, with optional per-match detail |
| `sport-picker` | Icon-based sport filter |
| `entity-image` | Team or region logo, unstyled — falls back to initials when the image is missing |

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
| `use-live-odds` | Subscribes to a single match's live odds over WebSocket (Business tier) — returns every matching market |
| `use-trending-matches` | Today's most-viewed matches, ranked server-side by views. One-shot, not a subscription |
| `use-odds-movement` | Diffs each bet item's price against its previous snapshot to color Odds Selector's price green/red as it changes. No SDK setup — pure client-side diff over whatever market `use-live-odds` gives you |

Installing any of the first three pulls in `mrdoge-client` (the browser SDK
client singleton) and `mrdoge-token-route` (a Next.js route that mints
short-lived tokens using `@mrdoge/node` — the browser never sees the raw
API key)
automatically.

## Adapters

| Adapter | Description |
| --- | --- |
| `mrdoge-match-card-adapter` | Maps a real `matches.get()`/`odds.list()` response onto Match Card's props |
| `mrdoge-odds-selector-adapter` | Pairs Over/Under markets into `OddsLine[]` and picks a representative line |

Mr. Doge SDK's own adapters — the ones used throughout every example on
the docs site. Small, pure functions from a real `@mrdoge/protocol`
response to a component's plain props, type-checked so a schema change
fails to compile instead of silently going stale. Bringing a different
data provider? Open a PR with your own — see
[mrdoge.co/ui](https://mrdoge.co/ui) for the pattern.

## Development

```bash
pnpm install
pnpm dev       # localhost:3001
pnpm build     # production build
pnpm test      # unit tests (Vitest)
```

Registry JSON (served from `public/r/`) is generated from `registry.json`
with:

```bash
pnpm dlx shadcn@latest build
```

Run this after adding or editing a component so the built output in
`public/r/` stays in sync with `registry.json`.

## Contributing

Bug reports and pull requests welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
