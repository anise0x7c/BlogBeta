## Stack

1. Astro 7 static site
2. Svelte 5 islands
3. Tailwind v4
4. PageFind Astro integration
5. Package manager is **pnpm** (`pnpm-lock.yaml`) — do not use npm/yarn. Requires Node >= 22.12.0.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install deps (also builds native modules via `pnpm-workspace.yaml` allowBuilds: esbuild, sharp) |
| `pnpm dev` | Dev server at `localhost:4321` |
| `pnpm build` | Production build to `./dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm astro check` | Typecheck `.astro` + Svelte files — **not exposed as a script**, call the CLI directly |

There are no `lint`, `test`, or `format` scripts — don't look for one.

**Dev server (OpenCode):** always run in background — a foreground server blocks the session. Since Astro 7, `astro dev`/`astro preview` auto-background when an AI agent is detected; `--background` forces it regardless. A lock file at `.astro/dev.json` (or `.astro/preview.json`) records URL/port/PID.

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`. Poll the dev server's `/_astro/status` endpoint (returns `{"ok": true}`) to confirm it's ready before fetching pages.

## Tailwind v4

Configured the v4 way: the `@tailwindcss/vite` plugin in `astro.config.mjs` plus `@import "tailwindcss"` in `src/styles/global.css`. There is **no `tailwind.config.js`** by design — do not create one. Theme/customization goes via CSS `@theme` in global styles.

## Notes

- Generated Astro types live in `.astro/` (gitignored). Run `astro dev` or `astro check` to (re)generate them before TypeScript resolves cleanly.
- `README.md` is unmodified Astro starter boilerplate with a stale file tree; trust `src/` over it.
- Astro docs: the **astro-docs MCP server** (`opencode.json`) provides current docs and is the primary source — prefer it over training-data recall. Static fallback: https://docs.astro.build (consult routing, components, content collections, styling, and i18n before working on those areas).

## MoreGuideline
This file only provides the most important informations and should always kept simple, so for more detailed docs in the local repository, read files under `/docs/` instead, and always take a quick look on it (ls) when a fresh session starts.
