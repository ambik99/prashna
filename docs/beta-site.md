# Beta site on GitHub Pages

Until Cloudflare Pages is connected (#6), the site is published for beta testing at:

- Landing Page: https://ambik99.github.io/prashna/
- App: https://ambik99.github.io/prashna/app/

Every push to `main` publishes the `www` folder through `.github/workflows/beta-site.yml`. The repo's Actions tab shows each publish. The app's Update Notice appears on open copies after a publish (see #15).

## Owner's one-time setup

Only the repo owner can do these.

1. If the account doesn't have GitHub Pro, make the repo public: Settings → General → Danger Zone → Change visibility. GitHub Pages on a free account works only for public repos.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Run the workflow once: Actions → Beta site → Run workflow (or push to `main`).

## For testing, not for teachers

Browsers keep an installed app and its saved work (the current Paper and the Question Bank) separately for each site address. Anything installed or saved on the `github.io` address won't appear on the Cloudflare address, and a tester who used both will have Prashna installed twice. Share the beta address only with testers, and tell teachers about Prashna once it is on Cloudflare.

## Sub-folder

GitHub Pages serves the site from `/prashna/`, not from the root, so every link in `www` must be relative (`app/`, `./`), never `/app/`. The browser tests check this: `tests/sub-folder.spec.mjs` runs against the site served from `/prashna/` (`node scripts/serve.mjs 4174 /prashna/`).
