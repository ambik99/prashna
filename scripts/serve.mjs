// Minimal static server that serves the site the way Cloudflare does:
// files by path, and a folder's index.html for folder URLs. No dependencies.
//
// Usage: node scripts/serve.mjs [port] [base]
//   port defaults to the PORT env or 4173.
//   base serves the site from a sub-folder, the way GitHub Pages serves the
//   beta site at /prashna/; nothing outside it exists. Defaults to /.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ROOT = resolve(fileURLToPath(new URL("../www", import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 4173);
const BASE = `/${process.argv[3] || ""}/`.replace(/\/+/g, "/");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};

async function resolveFile(urlPath) {
  const path = urlPath.split("?")[0];
  if (!path.startsWith(BASE)) return null;
  const decoded = decodeURIComponent(path.slice(BASE.length - 1));
  const candidate = normalize(join(SITE_ROOT, decoded));
  if (candidate !== SITE_ROOT && !candidate.startsWith(SITE_ROOT + sep)) return null;
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) {
      const index = join(candidate, "index.html");
      await stat(index);
      return index;
    }
    return candidate;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, {
    "content-type": TYPES[extname(file)] || "application/octet-stream",
    "cache-control": "no-cache",
  });
  res.end(body);
}).listen(PORT, () => {
  console.log(`Serving ${SITE_ROOT} at http://localhost:${PORT}${BASE}`);
});
