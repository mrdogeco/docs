# Contributing

Thanks for considering a contribution.

## Reporting issues

- Bugs in a component, hook, or the docs site → [open an issue](https://github.com/mrdogeco/docs/issues).
- Security vulnerabilities → email support@mrdoge.co privately, do **not** open a public issue.

## Building locally

```bash
pnpm install
pnpm dev       # localhost:3001
pnpm build     # production build
pnpm test      # unit tests (Vitest)
```

## Project layout

```
registry/mrdoge-ui/   Component and hook source: the actual registry
registry.json         Catalogs every registry item (deps, files, type)
public/r/             Built registry JSON, served to `shadcn add`
content/docs/         MDX docs (ui/ and (sdk)/ roots)
lib/sdk-adapters/      Real @mrdoge/protocol-typed mappers, one per
                       component/hook, shown on each doc page
components/docs/      Docs-site-only glue (demos, sample data), never
                       part of the public registry
```

Registry JSON in `public/r/` is generated, not hand-edited:

```bash
pnpm dlx shadcn@latest build
```

Run this after adding or editing anything under `registry/mrdoge-ui/` or
`registry.json`, before committing.

## Pull requests

- One logical change per PR.
- Add or update tests in `lib/sdk-adapters/` and hooks for any change to a
  pure function's behavior (e.g. `toOddsOptions`, `useOddsMovement`).
- Components take plain props: no dependency on any particular data
  provider. Hooks are the deliberate exception; keep new ones consistent
  with the existing convention (a single options object, matching the
  real SDK method it wraps).
- A component's "Use with the Mr. Doge SDK" doc section should show its
  actual adapter code from `lib/sdk-adapters/`, not an illustrative
  snippet; if the adapter changes, update the doc sample to match.

## Code style

- TypeScript, no raw `any`.
- Don't duplicate `@mrdoge/protocol` types; import them.

## License

By submitting a PR, you agree to license your contribution under
[MIT](./LICENSE).
