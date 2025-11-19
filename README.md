<p align="center">
  <img src="./logo/light.svg" alt="Mr. Doge API" width="180" />
</p>

<p align="center">
  <strong>Mr. Doge API Documentation</strong><br/>
  Low-latency sports odds, live markets, and AI betting signals for developers
</p>

<p align="center">
  <a href="https://api.mrdoge.co"><code>api.mrdoge.co</code></a> •
  <a href="https://docs.mrdoge.co">Hosted Docs</a> •
  <a href="https://x.com/mrdogeapp">@mrdogeapp</a>
</p>

## TL;DR

- **SDK-first docs**: Every endpoint ships with live examples, auth snippets, and credit costs.
- **Real-time focus**: `/v2/matches/live` pulls from Redis + live tracking for sub-second odds.
- **AI extras**: Built-in MRDOGE Picks + value bet recommender with transparent credit pricing.
- **500 credits on signup**: Hit the API immediately—no billing setup required.

## Local Development

1. Install the Mintlify CLI:
   ```bash
   npm install -g mint
   ```
2. From `docs/`, run the dev server:
   ```bash
   mint dev
   ```
3. Preview at <http://localhost:3000>. Edits hot-reload instantly.

## Publishing Flow

- `main` branch → production docs (Mintlify GitHub App handles syncs).
- All PRs should include screenshots of new UI components or snippets when relevant.
- Use semantic commit messages (`docs:`, `fix:`, `feat:`) to keep the changelog clean.

## Contributing

1. Fork `mrdoge.co/docs` or create a feature branch.
2. Run `mint lint` before pushing to catch broken links or invalid frontmatter.
3. Open a PR tagged with `docs` plus a short summary (e.g., `docs: add live odds tutorial`).

Questions? Ping `support@mrdoge.co` or open a discussion on [r/mrdoge](https://www.reddit.com/r/mrdoge/).
