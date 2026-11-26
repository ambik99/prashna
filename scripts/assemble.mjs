// Puts the built site together in dist/, the folder Cloudflare and the beta
// site serve: the Landing Page at the root and the app at app/.
//
// While Prashna moves to React and Astro (#45), each part is served either
// from the current files in www/ or from its new build. Switch a part over by
// changing SOURCES: the app in #48, the Landing Page in #50.

import { cp, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** @type {{ landing: "www" | "astro", app: "www" | "react" }} */
const SOURCES = { landing: "www", app: "www" };

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

if (SOURCES.landing === "www") {
  // Everything in www/ except the app, which is added below.
  await cp(path("www"), DIST, { recursive: true, filter: (src) => src !== path("www/app") });
} else {
  await mustExist(path("apps/landing/dist"), "Run `npm run build`.");
  await cp(path("apps/landing/dist"), DIST, { recursive: true });
}

if (SOURCES.app === "www") {
  await cp(path("www/app"), `${DIST}/app`, { recursive: true });
} else {
  await mustExist(path("apps/app/dist"), "Run `npm run build`.");
  await cp(path("apps/app/dist"), `${DIST}/app`, { recursive: true });
}

console.log(`Assembled dist/ (Landing Page from ${SOURCES.landing}, app from ${SOURCES.app}).`);
