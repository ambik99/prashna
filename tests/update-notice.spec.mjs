import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname } from "node:path";
import { fileURLToPath } from "node:url";
import { waitForOfflineCopy } from "./helpers.mjs";

// The app page as a new deployment would serve it: the same page with a
// different title, so a teacher can tell which version is open.
const NEW_TITLE = "Prashna (new version)";
// The new deployment's Paper styles carry this mark, which the Word export embeds.
const NEW_PAPER_STYLES = "/* new version of the Paper styles */";

const APP_PAGE = /\/app\/(index\.html)?(\?.*)?$/;

// Simulates deploying a changed app: from now on the server answers the app
// page and the Paper styles with their new versions. The offline copy's
// background download goes through these routes too.
async function deployNewVersion(context, title = NEW_TITLE) {
  await context.route(APP_PAGE, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace("<title>Prashna</title>", `<title>${title}</title>`);
    await route.fulfill({ response, body });
  });
  await context.route(/\/app\/paper\.css(\?.*)?$/, async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, body: `${await response.text()}\n${NEW_PAPER_STYLES}\n` });
  });
}

// The built app's files (dist/app/, from `npm run build`).
const builtFile = (name) => readFile(fileURLToPath(new URL(`../dist/app/${name}`, import.meta.url)));

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".txt": "text/plain" };

// Serves dist/app/ at /app/, as Cloudflare does, with answers a test can
// change to simulate a deployment. Playwright's routes can't change sw.js
// (the browser fetches a service worker's script itself), so a real
// deployment needs a server whose files really change. Each server has its
// own address, so each test starts with its own offline copy.
async function startSite() {
  const changed = new Map();
  const server = createServer(async (req, res) => {
    let path = req.url.split("?")[0];
    if (path.endsWith("/")) path += "index.html";
    const answer = changed.get(path) ?? { body: await builtFile(path.replace(/^\/app\//, "")).catch(() => null) };
    if (!path.startsWith("/app/") || answer.body === null) {
      res.writeHead(404, { "content-type": "text/plain" });
      return res.end("Not found");
    }
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream", "cache-control": "no-cache" });
    res.end(answer.body);
  });
  await new Promise((done) => server.listen(0, "localhost", done));
  return { url: `http://localhost:${server.address().port}/app/`, changed, close: () => new Promise((done) => server.close(done)) };
}

// Deploys a new build the way a real one differs: the build renames its
// hashed bundle, so the new app page loads assets/index-<new hash>.js and the
// old name is gone (404). Either the deployed file list (files.json, read by
// the open app's own check) or sw.js (installed by the browser as a new
// worker) names the new bundle, so each way of finding a new version is
// tested alone.
async function deployRenamedBuild(site, { foundBy }) {
  const page = (await builtFile("index.html")).toString();
  const oldBundle = page.match(/assets\/index-[\w-]+\.js/)[0];
  const newBundle = "assets/index-newbuild.js";
  const renamed = async (name) => (await builtFile(name)).toString().replaceAll(oldBundle, newBundle);

  const newPage = (await renamed("index.html")).replace("<title>Prashna</title>", `<title>${NEW_TITLE}</title>`);
  site.changed.set("/app/index.html", { body: newPage });
  site.changed.set(`/app/${oldBundle}`, { body: null });
  site.changed.set(`/app/${newBundle}`, { body: await builtFile(oldBundle) });
  const names = foundBy === "app check" ? "files.json" : "sw.js";
  site.changed.set(`/app/${names}`, { body: await renamed(names) });
}

// Holds back the offline copy's messages to the app, as if they arrived
// while the app was still starting. Listeners run in the order they were
// added, so this one is added before the app's. Returns a function that
// lets messages through again.
async function loseMessages(page) {
  await page.addInitScript(() => {
    window.__dropMessages = true;
    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (window.__dropMessages) event.stopImmediatePropagation();
    });
  });
  await page.reload();
  return () => page.evaluate(() => (window.__dropMessages = false));
}

// The teacher switches to another app and comes back to Prashna.
async function returnToApp(page) {
  await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
}

const updateNotice = (page) => page.getByRole("status").filter({ hasText: "New version available" });

test.describe("update notice", () => {
  // The offline copy is what notices a new deployment, so let it run.
  test.use({ serviceWorkers: "allow" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/app/");
    await waitForOfflineCopy(page);
  });

  test("a new deployment shows the notice without reloading the app", async ({ page, context }) => {
    // Half-typed work that a reload would lose.
    await page.getByLabel("Question Text").fill("Half-typed question");
    let reloads = 0;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) reloads++;
    });

    await deployNewVersion(context);
    await returnToApp(page);

    await expect(updateNotice(page)).toBeVisible();
    await expect(updateNotice(page).getByRole("button", { name: "Refresh" })).toBeVisible();

    // Ignoring the notice leaves the session as it was.
    await page.waitForTimeout(500);
    expect(reloads).toBe(0);
    await expect(page).toHaveTitle("Prashna");
    await expect(page.getByLabel("Question Text")).toHaveValue("Half-typed question");
  });

  test("an app left open keeps using its own version until Refresh", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);
    await expect(updateNotice(page)).toBeVisible();

    // The Word export still uses the Paper styles of the version that is open.
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Word (.doc)" }).click(),
    ]);
    const wordFile = await readFile(await download.path(), "utf8");
    expect(wordFile).toContain(".paper-sheet");
    expect(wordFile).not.toContain(NEW_PAPER_STYLES);
  });

  test("choosing Refresh opens the new version", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);

    await updateNotice(page).getByRole("button", { name: "Refresh" }).click();
    await expect(page).toHaveTitle(NEW_TITLE);
    await expect(updateNotice(page)).toBeHidden();
  });

  test("the notice can be put away until later", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);

    await updateNotice(page).getByRole("button", { name: "Later" }).click();
    await expect(updateNotice(page)).toBeHidden();
    await expect(page).toHaveTitle("Prashna");
  });

  test("a version put away until later stays away, and a newer one brings the notice back", async ({ page, context }) => {
    await deployNewVersion(context);
    await returnToApp(page);
    await updateNotice(page).getByRole("button", { name: "Later" }).click();

    await returnToApp(page);
    await page.waitForTimeout(1500);
    await expect(updateNotice(page)).toBeHidden();

    await deployNewVersion(context, "Prashna (newer version)");
    await returnToApp(page);
    await expect(updateNotice(page)).toBeVisible();
    await updateNotice(page).getByRole("button", { name: "Refresh" }).click();
    await expect(page).toHaveTitle("Prashna (newer version)");
  });

  test("no notice when nothing new has been deployed", async ({ page }) => {
    await returnToApp(page);
    await page.reload();
    await returnToApp(page);
    // Give the background check time to finish.
    await page.waitForTimeout(1500);
    await expect(updateNotice(page)).toBeHidden();
  });
});

// A real deployment, served by a server whose files change (see startSite).
test.describe("update notice after a real deployment", () => {
  test.use({ serviceWorkers: "allow" });
  let site;

  test.beforeEach(async ({ page }) => {
    site = await startSite();
    await page.goto(site.url);
    await waitForOfflineCopy(page);
  });
  test.afterEach(() => site.close());

  for (const foundBy of ["app check", "new worker"]) {
    test(`a deployment that renames the app's files is found by the ${foundBy} alone`, async ({ page }) => {
      await deployRenamedBuild(site, { foundBy });
      await returnToApp(page);
      await expect(updateNotice(page)).toBeVisible();
      await expect(page).toHaveTitle("Prashna");

      await updateNotice(page).getByRole("button", { name: "Refresh" }).click();
      await expect(page).toHaveTitle(NEW_TITLE);
      // The new version runs from its renamed bundle.
      await expect(page.getByLabel("Question Text")).toBeVisible();
      await expect(updateNotice(page)).toBeHidden();
    });
  }

  test("a notice missed while the app was starting is shown when the teacher comes back", async ({ page }) => {
    const letMessagesThrough = await loseMessages(page);
    await deployRenamedBuild(site, { foundBy: "app check" });
    await returnToApp(page);
    // The new version is downloaded, but its message never reached the app.
    await expect.poll(() => page.evaluate(() => caches.has("prashna-next"))).toBe(true);
    await page.waitForTimeout(500);
    await expect(updateNotice(page)).toBeHidden();

    await letMessagesThrough();
    await returnToApp(page);
    await expect(updateNotice(page)).toBeVisible();
  });
});
