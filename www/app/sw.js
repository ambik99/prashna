// Keeps every app file on the device so Prashna works offline after the
// first visit. Files are always served from the cache. Each time the app is
// opened online, the whole set is downloaded again in the background and
// stored only once every file has arrived, so a release arrives as a whole
// rather than file by file, and it shows up on the next visit without
// anyone having to bump a version.
//
// List every file in www/app here (except this one). The offline browser
// tests fail if a file is missing.

const CACHE_NAME = "prashna-v1";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app.js",
  "./confirm.js",
  "./layout.js",
  "./get-app.js",
  "./fonts.css",
  "./tokens.css",
  "./paper.css",
  "./styles.css",
  "./get-app.css",
  "./fonts/inter.woff2",
  "./fonts/newsreader.woff2",
  "./fonts/newsreader-italic.woff2",
  "./fonts/noto-sans-devanagari.woff2",
  "./fonts/noto-sans-bengali.woff2",
  "./fonts/LICENSE-inter.txt",
  "./fonts/LICENSE-newsreader.txt",
  "./fonts/LICENSE-noto-sans-bengali.txt",
  "./fonts/LICENSE-noto-sans-devanagari.txt",
  "./icon-16.png",
  "./icon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
];

// The app's one page, which every visit to /app/ opens.
const APP_PAGE = new URL("./", self.registration.scope).href;
const APP_PAGE_PATHS = [new URL(APP_PAGE).pathname, new URL("index.html", APP_PAGE).pathname];

// Downloads every app file and replaces the cached set with them. If any file
// fails (for example offline), the cached set is left as it was.
async function storeAppFiles(cacheMode) {
  const downloads = await Promise.all(
    APP_FILES.map(async (file) => {
      const request = new Request(file, { cache: cacheMode });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`${file}: ${response.status}`);
      // A response the server reached through a redirect can't answer a page
      // load, so store a plain copy.
      const stored = response.redirected
        ? new Response(await response.blob(), { status: response.status, headers: response.headers })
        : response;
      return [request.url, stored];
    }),
  );
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(downloads.map(([url, response]) => cache.put(url, response)));
  // Drop files that are no longer part of the app.
  const current = new Set(downloads.map(([url]) => url));
  const stored = await cache.keys();
  await Promise.all(stored.filter((request) => !current.has(request.url)).map((request) => cache.delete(request)));
}

self.addEventListener("install", (event) => {
  // Skip the browser's HTTP cache so the first stored copies are current.
  event.waitUntil(storeAppFiles("reload").then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only the app's own files; Import from Link and other sites go straight to the network.
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;

  // Opening the app, with or without a query string, always gets the app page.
  const opensApp = APP_PAGE_PATHS.includes(new URL(request.url).pathname);
  const key = opensApp ? APP_PAGE : request;
  event.respondWith(caches.match(key, { ignoreSearch: true }).then((cached) => cached || fetch(request)));

  // Each launch checks for a new release. The server answers unchanged files
  // with "not modified", so this is cheap; offline it simply fails.
  if (request.mode === "navigate") event.waitUntil(storeAppFiles("no-cache").catch(() => {}));
});
