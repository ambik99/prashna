// Keeps every app file on the device so Prashna works offline after the
// first visit. Files are always served from the cache.
//
// New versions: whenever the app opens or comes back to the screen online,
// it asks this worker to check for a new version. The whole set is
// downloaded again in the background and compared with the stored files, so
// no one has to bump a version number. A changed set is kept aside, whole,
// and open windows are told so they can offer a Refresh (update-notice.js).
// The app left open keeps using the files it started with; the kept-aside
// version takes over the next time the app page loads (Refresh, or opening
// Prashna again). Nothing ever reloads the app by itself.
//
// List every file in www/app here (except this one). The offline browser
// tests fail if a file is missing.

// The files the app runs from.
const CACHE_NAME = "prashna-v1";
// A downloaded new version, waiting for the app page to load again.
const NEXT_CACHE_NAME = "prashna-next";
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

// Cache changes run one at a time, so a page load never takes over a new
// version that is only half stored.
let cacheWork = Promise.resolve();
function oneAtATime(task) {
  cacheWork = cacheWork.then(task, task);
  return cacheWork;
}

// Downloads every app file. Throws if any file fails (for example offline).
function downloadAppFiles(cacheMode) {
  return Promise.all(
    APP_FILES.map(async (file) => {
      const request = new Request(file, { cache: cacheMode });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`${file}: ${response.status}`);
      // Keep a plain copy: a response the server reached through a redirect
      // can't answer a page load, and the bytes are needed for comparing.
      const bytes = await response.arrayBuffer();
      return { url: request.url, bytes, status: response.status, headers: response.headers };
    }),
  );
}

function sameBytes(stored, downloaded) {
  if (stored.byteLength !== downloaded.byteLength) return false;
  const storedView = new Uint8Array(stored);
  const downloadedView = new Uint8Array(downloaded);
  return storedView.every((byte, i) => byte === downloadedView[i]);
}

// Whether a cache holds exactly these files, byte for byte.
async function holdsSameFiles(cache, files) {
  const keys = await cache.keys();
  if (keys.length !== files.length) return false;
  for (const { url, bytes } of files) {
    const stored = await cache.match(url);
    if (!stored || !sameBytes(await stored.arrayBuffer(), bytes)) return false;
  }
  return true;
}

// Replaces a cache's contents with these files.
async function fillCache(cacheName, files) {
  const cache = await caches.open(cacheName);
  await Promise.all(files.map(({ url, bytes, status, headers }) => cache.put(url, new Response(bytes, { status, headers }))));
  const current = new Set(files.map(({ url }) => url));
  const stale = (await cache.keys()).filter((request) => !current.has(request.url));
  await Promise.all(stale.map((request) => cache.delete(request)));
}

// Downloads the app and stores it. The first download becomes the app's
// files; later ones that differ from the newest stored version are kept
// aside as the next version. Returns true when a new version was kept aside.
async function downloadNewVersion(cacheMode) {
  const files = await downloadAppFiles(cacheMode);
  return oneAtATime(async () => {
    const running = await caches.open(CACHE_NAME);
    if ((await running.keys()).length === 0) {
      await fillCache(CACHE_NAME, files);
      return false;
    }
    const newest = (await caches.has(NEXT_CACHE_NAME)) ? await caches.open(NEXT_CACHE_NAME) : running;
    if (await holdsSameFiles(newest, files)) return false;
    // Replace any earlier waiting version as a whole.
    await caches.delete(NEXT_CACHE_NAME);
    await fillCache(NEXT_CACHE_NAME, files);
    return true;
  });
}

// Makes the waiting new version, if any, the files the app runs from.
function takeOverNextVersion() {
  return oneAtATime(async () => {
    if (!(await caches.has(NEXT_CACHE_NAME))) return;
    const next = await caches.open(NEXT_CACHE_NAME);
    const files = [];
    for (const request of await next.keys()) {
      const response = await next.match(request);
      files.push({ url: request.url, bytes: await response.arrayBuffer(), status: response.status, headers: response.headers });
    }
    await fillCache(CACHE_NAME, files);
    await caches.delete(NEXT_CACHE_NAME);
  });
}

// Tells every open Prashna window that a Refresh will open a new version.
async function announceNewVersion() {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) client.postMessage({ type: "new-version-available" });
}

async function checkForNewVersion(cacheMode) {
  if (await downloadNewVersion(cacheMode)) await announceNewVersion();
}

self.addEventListener("install", (event) => {
  // Skip the browser's HTTP cache so the stored copies are current. A new
  // version of this worker is itself a new version of the app, so open
  // windows hear about it like any other.
  event.waitUntil(checkForNewVersion("reload").then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  const kept = [CACHE_NAME, NEXT_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !kept.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only the app's own files; Import from Link and other sites go straight to the network.
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;

  // Opening the app, with or without a query string, always gets the app
  // page, and is when a waiting new version takes over.
  const opensApp = APP_PAGE_PATHS.includes(new URL(request.url).pathname);
  const key = opensApp ? APP_PAGE : request;
  const ready = opensApp && request.mode === "navigate" ? takeOverNextVersion() : Promise.resolve();
  event.respondWith(
    ready
      .catch(() => {})
      .then(() => caches.match(key, { ignoreSearch: true, cacheName: CACHE_NAME }))
      .then((cached) => cached || fetch(request)),
  );
});

// The app asks for a check each time it opens or comes back to the screen.
// The server answers unchanged files with "not modified", so this is cheap;
// offline it simply fails.
self.addEventListener("message", (event) => {
  if (event.data?.type === "check-for-new-version") event.waitUntil(checkForNewVersion("no-cache").catch(() => {}));
});
