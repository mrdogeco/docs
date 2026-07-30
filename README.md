# mrdoge-co

The mrdoge.co codebase: Mr. Doge SDK docs and marketing, mrdoge-ui's docs and
showcase, and the developer dashboard. Private — the public-facing component
source lives in the separate `mrdoge-ui` repo and is mirrored here for the
registry build (see below).

## Installation

Requires a project with Tailwind CSS and the shadcn/ui CLI configured
(`npx shadcn@latest init`). Then install a component with:

```bash
npx shadcn@latest add https://mrdoge.co/r/event-card.json
```

## Components

| Component | Description |
| --- | --- |
| `event-card` | Match card with teams, live status, and a primary odds row |
| `odds-selector` | Selectable price buttons with movement and suspended states |
| `live-indicator` | Status pill: scheduled, live, or finished |
| `bet-slip` | Selected picks, stake input, and computed potential payout |
| `match-timeline` | Chronological feed of match events |
| `team-form-indicator` | Recent match results for a team |
| `competition-header` | Banner for a competition: name, region, and stage |

See `/docs` in the showcase app for full usage, or `registry/mrdoge-ui/`
for the component source.

## Development

```bash
pnpm install
pnpm dev       # showcase app at localhost:3000
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

mrdoge-ui components accept plain props, so they work with any data source.
They pair directly with [`@mrdoge/client`](https://mrdoge.ai), which provides
typed, real-time sports data over HTTP and WebSocket. See `/docs` for an
example.
