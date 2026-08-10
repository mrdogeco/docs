<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/assets/mrdoge-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/assets/mrdoge-logo-light.svg">
    <img src="public/assets/mrdoge-logo-light.svg" alt="Mr. Doge" width="240" />
  </picture>
</p>

<p align="center">
  Free, open-source UI components for sports apps: copy-paste via shadcn/ui, real Mr. Doge SDK integration built in.
</p>

<p align="center">
  <a href="https://mrdoge.co">mrdoge.co</a> •
  <a href="https://mrdoge.co/ui">Docs</a> •
  <a href="https://x.com/mrdogeapp">@mrdogeapp</a>
</p>

mrdoge-ui is a free, open-source component library for sports apps —
match cards, odds selectors, bet slips, stats, and more — distributed as
source code through a shadcn/ui-compatible registry. Components take
plain props, with no dependency on any particular data provider. Hooks
are the one exception: a real, opinionated integration with the Mr. Doge
SDK, for anyone who wants live data working out of the box instead of
wiring their own.

This repo also hosts mrdoge.co itself: the Mr. Doge SDK's docs and
marketing site. The developer dashboard (auth, billing, API keys) is not
part of this repo; it stays private, wherever it currently lives.

## Install a component

Requires a project with Tailwind CSS and the shadcn/ui CLI configured
(`npx shadcn@latest init`). Then:

```bash
npx shadcn@latest add https://mrdoge.co/r/match-card.json
```

**[mrdoge.co/ui](https://mrdoge.co/ui)** has the full component list,
live previews, props, and install commands for everything — components,
hooks, and adapters. That's the source of truth; this README doesn't
duplicate it.

## Development

```bash
pnpm install
pnpm dev       # localhost:3001
pnpm build     # production build
pnpm test      # unit tests (Vitest)
```

Registry JSON (served from `public/r/`) is generated from `registry.json`
with `pnpm dlx shadcn@latest build` — run this after adding or editing a
component so the built output stays in sync.

## Contributing

Bug reports and pull requests welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
