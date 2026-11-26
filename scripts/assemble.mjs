// Puts the built site together in dist/, the folder Cloudflare and the beta
// site serve: the Landing Page at the root and the app at app/.
//
// The app is the React build (apps/app). Until the Landing Page moves to
// Astro (#50), it is served from the current files in www/; switch it over by
// changing LANDING.

import { cp, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** @type {"www" | "astro"} */
const LANDING = "www";

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

if (LANDING === "www") {
  await cp(path("www"), DIST, { recursive: true });
} else {
  await mustExist(path("apps/landing/dist"), "Run `npm run build`.");
  await cp(path("apps/landing/dist"), DIST, { recursive: true });
}

await mustExist(path("apps/app/dist"), "Run `npm run build`.");
await cp(path("apps/app/dist"), `${DIST}/app`, { recursive: true });

console.log(`Assembled dist/ (Landing Page from ${LANDING}, app from apps/app).`);
