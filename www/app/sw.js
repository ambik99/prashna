const CACHE_NAME = "cbse-paper-designer-v17-pwa";
const ASSETS = [
  "./",
  "./index.html",
  "./fonts.css",
  "./tokens.css",
  "./styles.css",
  "./fonts/inter.woff2",
  "./fonts/newsreader.woff2",
  "./fonts/newsreader-italic.woff2",
  "./fonts/noto-sans-devanagari.woff2",
  "./fonts/noto-sans-bengali.woff2",
  "./confirm.js",
  "./app.js",
  "./layout.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
