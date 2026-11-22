// Keeps every app file on the device so Prashna works offline after the
// first visit. Files are always served from the cache. Whenever the app is
// opened or brought back to the screen online, it asks this worker to check
// for a new release: the whole set is downloaded again in the background and
// stored only once every file has arrived, so a release arrives as a whole
// rather than file by file. If any file differs from the stored copy, open
// windows are told so they can offer a Refresh (update-notice.js). Nothing
// ever reloads the app by itself, and no one has to bump a version: the
// files themselves are compared.
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
  "./update-notice.js",
  "./fonts.css",
  "./tokens.css",
  "./paper.css",
  "./styles.css",
  "./get-app.css",
  "./update-notice.css",
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

const sameBytes = (a, b) => {
  if (a.byteLength !== b.byteLength) return false;
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
};

// Downloads every app file and, if any differs from the cached set, replaces
// the cached set with them. Returns true when an earlier set was replaced by
// a different one (a new release), false when nothing changed or nothing was
// stored before. If any file fails (for example offline), the cached set is
// left as it was.
async function storeAppFiles(cacheMode) {
  const downloads = await Promise.all(
    APP_FILES.map(async (file) => {
      const request = new Request(file, { cache: cacheMode });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`${file}: ${response.status}`);
      // Store a plain copy: a response the server reached through a redirect
      // can't answer a page load, and the bytes are needed for the comparison.
      const body = await response.arrayBuffer();
      return { url: request.url, body, headers: response.headers, status: response.status };
    }),
  );
  const cache = await caches.open(CACHE_NAME);
  const stored = await cache.keys();
  const current = new Set(downloads.map(({ url }) => url));
  const changed = await Promise.all(
    downloads.map(async ({ url, body }) => {
      const cached = await cache.match(url);
      return !cached || !sameBytes(body, await cached.arrayBuffer());
    }),
  );
  const removed = stored.filter((request) => !current.has(request.url));
  if (!changed.includes(true) && removed.length === 0) return false;

  await Promise.all(
    downloads.map(({ url, body, headers, status }) => cache.put(url, new Response(body, { status, headers }))),
  );
  // Drop files that are no longer part of the app.
  await Promise.all(removed.map((request) => cache.delete(request)));
  return stored.length > 0;
}

// Tells every open Prashna window that a new release is stored and a
// Refresh will open it.
async function announceNewRelease() {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) client.postMessage({ type: "new-version-available" });
}

async function checkForNewRelease(cacheMode) {
  if (await storeAppFiles(cacheMode)) await announceNewRelease();
}

self.addEventListener("install", (event) => {
  // Skip the browser's HTTP cache so the first stored copies are current.
  // A new version of this worker is itself a new release, so open windows
  // hear about it like any other.
  event.waitUntil(checkForNewRelease("reload").then(() => self.skipWaiting()));
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
});

// The app asks for a check each time it opens or comes back to the screen.
// The server answers unchanged files with "not modified", so this is cheap;
// offline it simply fails.
self.addEventListener("message", (event) => {
  if (event.data?.type === "check-for-new-version") event.waitUntil(checkForNewRelease("no-cache").catch(() => {}));
});
