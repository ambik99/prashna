# Hosting

Prashna is served by Cloudflare as a Worker with static files:

- Landing Page: https://prashna.ambik99.workers.dev/
- App: https://prashna.ambik99.workers.dev/app/

The Cloudflare project is connected to the GitHub repo. Every push to `main` deploys, and every pull request gets its own preview link, posted as a comment on the pull request. Wrangler runs `npm run build` first (the `build` block in `wrangler.jsonc`) and uploads the built site in `dist/` with the Worker (see `docs/development.md`).

`wrangler.jsonc` holds the settings: folder URLs open their `index.html` (and `/app/index.html` redirects to `/app/`), missing files answer 404, and only `/api/*` runs the Worker; everything else is served straight from `dist/`.

Cloudflare tells browsers to check every file for changes on each visit, so the app's Update Notice appears on open copies soon after a deploy.

The browser tests serve `dist/` the same way (`scripts/serve.mjs`).

## AI Generated Papers

`POST /api/generate` (`worker/src/generate.ts`, `docs/adr/0002`) needs, once, in the Cloudflare dashboard or with Wrangler:

- **Gemini key** (paid tier): `npx wrangler secret put GEMINI_API_KEY`.
- **Turnstile**: Prashna's widget already exists. Its site key (public) is in `apps/app/src/aiPaper.ts`; put its secret key in the Worker with `npx wrangler secret put TURNSTILE_SECRET_KEY`. The app sends the action `generate`, and the Worker accepts a token only when Cloudflare confirms that action and a hostname listed in `TURNSTILE_HOSTNAMES` (`vars` in `wrangler.jsonc`). A new hostname (a custom domain, or the preview hostnames) must be added both to the widget's domains in the Cloudflare dashboard and to `TURNSTILE_HOSTNAMES`.
- **Limits**: nothing to set up. The `LIMITS` Durable Object in `wrangler.jsonc` is created on the first deploy. Each pull request preview gets its own, empty copy.

Pull request previews need the same two secrets to generate Papers.

For `npm run dev`, use Cloudflare's Turnstile test keys, which always pass. Put the secrets in `.dev.vars` (never committed), and build the app with the test site key (`VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run dev`):

```
GEMINI_API_KEY=...
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_HOSTNAMES=localhost,example.com
```

(The test secret reports the hostname `example.com` and no action; the Worker lets that through only for the test secret's results.)

Each attempt is logged with its cost, so the cost per Paper can be read off real generations.

## Logs

Workers Logs are on (`observability` in `wrangler.jsonc`, so a deploy keeps them on). Read them in the Cloudflare dashboard under the Worker's Observability tab, or live with `npx wrangler tail`. They hold:

- the Worker's own `generate attempt` lines: the attempt number, its cost, the model's finish reason, and the marks of the Paper it returned, or the error. No Paper text or IP address is logged.
- Cloudflare's invocation log for each `/api/*` request: the request and response and their metadata.

Static files (the Landing Page and the app) are served without running the Worker, so they aren't logged.

## The old beta address

Before Cloudflare, a beta copy was published on GitHub Pages at https://ambik99.github.io/prashna/. It is no longer published. Browsers keep an installed app and its saved work separately for each address, so nothing a tester saved there appears on the Cloudflare address. A Paper moves across with Save Paper there and Load Paper here. The Question Bank can't be saved as a file, so Questions a tester wants to keep must be inserted into a Paper and moved with it.
