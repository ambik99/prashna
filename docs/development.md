# Development

Prashna is moving from plain files in `www/` to Vite + React + TypeScript for the app and Astro + Tailwind for the Landing Page (spec #45, `docs/adr/`). During the move both live in the repo.

## Layout

| Folder | What it is |
|---|---|
| `www/` | The current Landing Page and app, served as they are until their new versions replace them. |
| `apps/app/` | The app in Vite + React + TypeScript (`@prashna/app`). Replaces `www/app/` in #48. |
| `apps/landing/` | The Landing Page in Astro + Tailwind (`@prashna/landing`). Replaces the rest of `www/` in #50. |
| `packages/paper/` | The Paper schema (Zod) shared by the app and the Worker (`@prashna/paper`). `parsePaper` opens Papers from any earlier version. |
| `worker/` | The Cloudflare Worker. It answers `/api/*`; Cloudflare serves everything else from `dist/`. |
| `scripts/assemble.mjs` | Puts the served site together in `dist/`: the Landing Page at the root and the app at `app/`. Its `SOURCES` setting says whether each part comes from `www/` or from its new build. |

## Commands

```
npm install
npm run build          # builds apps/app and apps/landing, then assembles dist/
npm run typecheck
npm run test:unit      # Vitest: the Paper schema and the Worker
npm run test:browser   # Playwright, against dist/ (see tests/README.md)
npm test               # all of the above
npm run serve          # serves dist/ at http://localhost:4173/
npm run dev            # wrangler dev: dist/ plus the Worker, as on Cloudflare
```

## Deploying

Cloudflare runs `wrangler deploy` (or `wrangler preview` for pull requests). Wrangler runs `npm run build` first (the `build` block in `wrangler.jsonc`), then uploads `dist/` and the Worker. The beta site on GitHub Pages publishes the same `dist/` without the Worker (`docs/beta-site.md`).

Every path in the built site must be relative, because the beta site is served from `/prashna/`.
