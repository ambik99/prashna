/// <reference lib="webworker" />
// The offline copy: keeps every app file on the device so Prashna works
// offline after the first visit. Files are always served from the cache.
//
// New versions: whenever the app opens or comes back to the screen online,
// it asks this worker to check for a new version. The worker reads the
// deployed app's file list (files.json), downloads the whole set again in the
// background and compares it with the stored files, so no one has to bump a
// version number. A changed set is kept aside, whole, and open windows are
// told so they can offer a Refresh (UpdateNotice.tsx).
//
// A deployment also changes sw.js, so the browser installs a new worker too,
// and its install does the same check. Either path alone finds the new
// version. Each check that finds one waiting tells open windows again, so a
// message lost while the app was still starting doesn't hide it.
// The app left open keeps using the files it started with; the kept-aside
// version takes over the next time the app page loads (Refresh, or opening
// Prashna again). Nothing ever reloads the app by itself.
//
// The list of app files is written in at build time by vite-plugin-pwa
// (self.__WB_MANIFEST): every file of the built app except this one and
// files.json. The build writes the same list to files.json (vite.config.ts):
// this worker's own list names the files of the build it came with, which a
// later build may have renamed, so a check reads the deployed list instead.

export {};

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string } | string> };

// The files the app runs from.
const CACHE_NAME = "prashna-v1";
// A downloaded new version, waiting for the app page to load again.
const NEXT_CACHE_NAME = "prashna-next";
// The deployed app's file list, written by the build next to sw.js.
const FILE_LIST = "./files.json";

// Every file to store for a build: the app page and the build's file list.
function appFilesOf(list: string[]): string[] {
  return ["./", ...list.map((url) => `./${url}`)];
}
// The files of the build this worker came with.
const OWN_APP_FILES = appFilesOf(self.__WB_MANIFEST.map((entry) => (typeof entry === "string" ? entry : entry.url)));

// The files of the build deployed now. Throws if the list can't be read (for example offline).
async function deployedAppFiles(): Promise<string[]> {
  const response = await fetch(new Request(FILE_LIST, { cache: "no-cache" }));
  if (!response.ok) throw new Error(`${FILE_LIST}: ${response.status}`);
  const list: unknown = await response.json();
  if (!Array.isArray(list) || !list.every((url) => typeof url === "string")) throw new Error(`${FILE_LIST}: not a file list`);
  return appFilesOf(list);
}

type StoredFile = { url: string; bytes: ArrayBuffer; status: number; headers: Headers };
// The app's one page, which every visit to /app/ opens.
const APP_PAGE = new URL("./", self.registration.scope).href;
const APP_PAGE_PATHS = [new URL(APP_PAGE).pathname, new URL("index.html", APP_PAGE).pathname];

// Cache changes run one at a time, so a page load never takes over a new
// version that is only half stored. While a new worker installs, the old one
// still answers the app, so both can be checking at once: a lock shared by
// every worker of this site keeps them in turn. Browsers without the lock
// keep this worker's own changes in turn.
const CACHE_LOCK = "prashna-cache";
let cacheWork: Promise<unknown> = Promise.resolve();
function oneAtATime<T>(task: () => Promise<T>): Promise<T> {
  const locked = () => ("locks" in self.navigator ? self.navigator.locks.request(CACHE_LOCK, task) : task());
  const run = cacheWork.then(locked, locked);
  cacheWork = run;
  return run;
}

// Downloads these app files. Throws if any file fails (for example offline).
function downloadAppFiles(appFiles: string[], cacheMode: RequestCache): Promise<StoredFile[]> {
  return Promise.all(
    appFiles.map(async (file) => {
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

function sameBytes(stored: ArrayBuffer, downloaded: ArrayBuffer): boolean {
  if (stored.byteLength !== downloaded.byteLength) return false;
  const storedView = new Uint8Array(stored);
  const downloadedView = new Uint8Array(downloaded);
  return storedView.every((byte, i) => byte === downloadedView[i]);
}

// Whether a cache holds exactly these files, byte for byte.
async function holdsSameFiles(cache: Cache, files: StoredFile[]): Promise<boolean> {
  const keys = await cache.keys();
  if (keys.length !== files.length) return false;
  for (const { url, bytes } of files) {
    const stored = await cache.match(url);
    if (!stored || !sameBytes(await stored.arrayBuffer(), bytes)) return false;
  }
  return true;
}

// Replaces a cache's contents with these files.
async function fillCache(cacheName: string, files: StoredFile[]): Promise<void> {
  const cache = await caches.open(cacheName);
  await Promise.all(files.map(({ url, bytes, status, headers }) => cache.put(url, new Response(bytes, { status, headers }))));
  const current = new Set(files.map(({ url }) => url));
  const stale = (await cache.keys()).filter((request) => !current.has(request.url));
  await Promise.all(stale.map((request) => cache.delete(request)));
}

// Downloads the app and stores it. The first download becomes the app's
// files; later ones that differ from the newest stored version are kept
// aside as the next version. Returns true when a new version was kept aside.
async function downloadNewVersion(appFiles: string[], cacheMode: RequestCache): Promise<boolean> {
  const files = await downloadAppFiles(appFiles, cacheMode);
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
function takeOverNextVersion(): Promise<void> {
  return oneAtATime(async () => {
    if (!(await caches.has(NEXT_CACHE_NAME))) return;
    const next = await caches.open(NEXT_CACHE_NAME);
    const files: StoredFile[] = [];
    for (const request of await next.keys()) {
      const response = await next.match(request);
      if (!response) continue;
      files.push({ url: request.url, bytes: await response.arrayBuffer(), status: response.status, headers: response.headers });
    }
    await fillCache(CACHE_NAME, files);
    await caches.delete(NEXT_CACHE_NAME);
  });
}

// Tells every open Prashna window that a Refresh will open a new version.
// fresh: the version was downloaded just now, rather than told again.
async function announceNewVersion(fresh: boolean) {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) client.postMessage({ type: "new-version-available", fresh });
}

// Downloads these files and, if a new version is waiting (downloaded now or
// earlier), tells open windows.
async function checkForNewVersion(appFiles: () => Promise<string[]>, cacheMode: RequestCache): Promise<void> {
  const fresh = await downloadNewVersion(await appFiles(), cacheMode);
  if (fresh || (await caches.has(NEXT_CACHE_NAME))) await announceNewVersion(fresh);
}

self.addEventListener("install", (event) => {
  // Skip the browser's HTTP cache so the stored copies are current. A new
  // version of this worker is itself a new version of the app, so open
  // windows hear about it like any other.
  event.waitUntil(checkForNewVersion(async () => OWN_APP_FILES, "reload").then(() => self.skipWaiting()));
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
  if (event.data?.type === "check-for-new-version") {
    event.waitUntil(checkForNewVersion(deployedAppFiles, "no-cache").catch(() => {}));
  }
});
