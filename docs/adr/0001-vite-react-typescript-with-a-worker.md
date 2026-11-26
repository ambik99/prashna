# Vite, React and TypeScript, with a Cloudflare Worker

Prashna began as plain HTML, CSS and JavaScript with no build step. By late 2026 the editor was one 1,800-line file that was getting hard to change safely, and AI Generated Papers needed a server, because the AI model's key cannot be sent to the browser. We decided to rewrite the app in Vite + React + TypeScript and to add one Cloudflare Worker for `/api/*`. Everything lives in one repo with npm workspaces and goes out in a single `wrangler deploy`.

## Considered Options

- **Next.js**: rejected. The editor runs entirely in the browser from data on the device and must work offline, so server rendering and server components add nothing. On Cloudflare it needs an adapter, and its routing conflicts with Prashna's own service worker.
- **Restructuring into plain ES modules with no build step**: this would have tidied the code, but it would not give typed data contracts across the app, saved files, the Question Bank and AI output.
- **Converting step by step inside the old DOM code**: rejected. For an app this size, running both systems side by side costs more than a rewrite that uses the browser tests as the check for parity.

## Consequences

- The app stays at `/app/`, because installed copies point there.
- One Zod `Paper` schema, with a `version` field and upgrades from older versions, checks saved Papers, the Question Bank, imported files and AI output.
- The app keeps its own CSS. `paper.css` controls the printed A4 layout and is read by the Word export, so it is not rewritten in utility classes.
- The service worker comes from `vite-plugin-pwa` in `injectManifest` mode, so Prashna keeps its own update logic and the Update Notice. `/api/*` is never cached.
- An Android build later can wrap the same web app (Capacitor or a TWA).
