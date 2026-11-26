# Hosting

Prashna is served by Cloudflare as a Worker with static files:

- Landing Page: https://prashna.ambik99.workers.dev/
- App: https://prashna.ambik99.workers.dev/app/

The Cloudflare project is connected to the GitHub repo. Every push to `main` deploys, and every pull request gets its own preview link, posted as a comment on the pull request. Wrangler runs `npm run build` first (the `build` block in `wrangler.jsonc`) and uploads the built site in `dist/` with the Worker (see `docs/development.md`).

`wrangler.jsonc` holds the settings: folder URLs open their `index.html` (and `/app/index.html` redirects to `/app/`), missing files answer 404, and only `/api/*` runs the Worker; everything else is served straight from `dist/`.

Cloudflare tells browsers to check every file for changes on each visit, so the app's Update Notice appears on open copies soon after a deploy.

The browser tests serve `dist/` the same way (`scripts/serve.mjs`).

## The old beta address

Before Cloudflare, a beta copy was published on GitHub Pages at https://ambik99.github.io/prashna/. It is no longer published. Browsers keep an installed app and its saved work separately for each address, so nothing a tester saved there appears on the Cloudflare address. A Paper moves across with Save Paper there and Load Paper here. The Question Bank can't be saved as a file, so Questions a tester wants to keep must be inserted into a Paper and moved with it.
