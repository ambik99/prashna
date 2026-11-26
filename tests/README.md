# Browser tests

The tests drive the real app in a browser with [Playwright](https://playwright.dev), the way a teacher uses it. They check only what a teacher can observe: the preview, the marks summary, downloaded files, and what survives a reload.

## Running them

First time only:

```
npm install
npm run test:install-browsers
```

Then:

```
npm test
```

`npm test` builds the site into `dist/`, type-checks, runs the unit tests (Vitest), then runs these browser tests against `dist/` with a local server it starts automatically. To run only the browser tests against the last build, use `npm run test:browser`. To look at the site yourself, run `npm run build` and `npm run serve`, then open http://localhost:4173/ for the Landing Page, or http://localhost:4173/app/ for the app. See `docs/development.md` for the project layout.

## Writing tests

- Act like a teacher: click, type, choose options, open and close the app.
- Find elements by their role, label or visible text, never by CSS classes or IDs, so layout and code changes don't break tests.
- Assert on what the teacher sees, using known-good values (a worked example or a fixture file), not values recomputed the way the app computes them.
- Use the glossary's terms (`CONTEXT.md`) in test names.

## Offline

`offline.spec.mjs` visits the app once, turns the network off and checks the app still works. It also checks that every file in `www/app/` is in the offline cache, so a new app file must be added to the list in `www/app/sw.js`.

`update-notice.spec.mjs` simulates a new deployment by changing what the server answers for the app page (`context.route`), then checks the "New version available" notice appears without the app reloading itself.

`sub-folder.spec.mjs` runs in its own project against the site served from `/prashna/`, the way the beta site on GitHub Pages is served (see `docs/beta-site.md`). It fails if a link assumes the site root.

The app icons are generated: change `scripts/make-icons.mjs` and run `node scripts/make-icons.mjs`.

The Landing Page's screenshots (`www/images/`) are real captures of the app: after changing how the app looks, run `node scripts/make-screenshots.mjs` (needs ffmpeg).

## Fixtures

`fixtures/paper-saved-by-v10.json` is a Paper file saved by version 10.0 of the tool before the redesign. Never regenerate it: it proves Papers that teachers saved earlier still load.
