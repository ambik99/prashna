// Keeps every app file on the device so Prashna works offline after the
// first visit. Files are served from the cache straight away and refreshed
// from the network in the background, so a new release shows up on the
// next visit without anyone having to bump a version.
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
  "./fonts.css",
  "./tokens.css",
  "./paper.css",
  "./styles.css",
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // Skip the browser's HTTP cache so the stored copies are current.
      .then((cache) => cache.addAll(APP_FILES.map((file) => new Request(file, { cache: "reload" }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Fetches a fresh copy and stores it for next time.
async function refresh(request) {
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only the app's own files; Import from Link and other sites go straight to the network.
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;

  // Opening the app, with or without a query string, always gets the app page.
  const { pathname } = new URL(request.url);
  const opensApp = pathname === new URL(APP_PAGE).pathname || pathname === new URL("index.html", APP_PAGE).pathname;
  const key = opensApp ? APP_PAGE : request;
  const fresh = refresh(key);

  event.respondWith(caches.match(key).then((cached) => cached || fresh));
  // Keep the worker alive until the background refresh has been stored; offline it just fails.
  event.waitUntil(fresh.catch(() => {}));
});
