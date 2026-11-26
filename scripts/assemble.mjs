// Puts the built site together in dist/, the folder Cloudflare serves: the Landing Page (apps/landing, Astro) at the root and the app
// (apps/app, React) at app/.

import { cp, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const path = (relative) => fileURLToPath(new URL(`../${relative}`, import.meta.url));
const DIST = path("dist");

async function mustExist(folder, hint) {
  try {
    await stat(folder);
  } catch {
    throw new Error(`${folder} is missing. ${hint}`);
  }
}

await rm(DIST, { recursive: true, force: true });

await mustExist(path("apps/landing/dist"), "Run `npm run build`.");
await cp(path("apps/landing/dist"), DIST, { recursive: true });

await mustExist(path("apps/app/dist"), "Run `npm run build`.");
await cp(path("apps/app/dist"), `${DIST}/app`, { recursive: true });

console.log("Assembled dist/ (Landing Page from apps/landing, app from apps/app).");
