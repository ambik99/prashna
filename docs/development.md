# Development

The app is built with Vite + React + TypeScript and the Landing Page with Astro + Tailwind (spec #45, `docs/adr/`).

## Layout

| Folder | What it is |
|---|---|
| `apps/app/` | The app in Vite + React + TypeScript (`@prashna/app`), served at `/app/`. `public/` holds files served as they are at `/app/`, including those the Landing Page shares (`theme.js`, `get-app.js`, `tokens.css`, fonts, icons) and `paper.css`, which the Word export reads. `src/sw.ts` is the offline copy, built to `sw.js` with the list of built files written in. |
| `apps/landing/` | The Landing Page in Astro + Tailwind (`@prashna/landing`), served at the root. It loads the app's shared files from `app/` (theme, Get the App, fonts, `tokens.css`, icons). Its Tailwind theme (`src/styles.css`) switches off Tailwind's defaults and reads the `--landing-*` colours in `tokens.css`; spacing utilities are in pixels (`p-24` is 24px) and breakpoints are desktop first (`max-md:` is 860px and below, `max-sm:` 640px and below). Screenshots are in `public/images/`. |
| `packages/paper/` | The Paper schema (Zod) shared by the app and the Worker (`@prashna/paper`). `parsePaper` opens Papers from any earlier version. |
| `worker/` | The Cloudflare Worker. It answers `/api/*`; Cloudflare serves everything else from `dist/`. |
| `scripts/assemble.mjs` | Puts the served site together in `dist/`: the Landing Page at the root and the app at `app/`. |

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
