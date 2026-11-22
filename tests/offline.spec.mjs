import { test, expect } from "@playwright/test";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { TEMPLATES, addQuestion, loadTemplate, moreMenuButton, preview } from "./helpers.mjs";

// Every file the app is made of, as URLs under /app/. The service worker
// script itself is left out: the browser always checks it on the network.
async function appFiles() {
  const root = fileURLToPath(new URL("../www/app/", import.meta.url));
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name !== "sw.js")
    .map((entry) => {
      const relative = `${entry.parentPath ?? entry.path}/${entry.name}`.slice(root.length).replaceAll("\\", "/");
      return `/app/${relative.replace(/^\//, "")}`;
    });
}

// The pixel size of an image as the browser decodes it.
const imageSize = (page, src) =>
  page.evaluate(
    (url) =>
      new Promise((done, fail) => {
        const img = new Image();
        img.onload = () => done(`${img.naturalWidth}x${img.naturalHeight}`);
        img.onerror = () => fail(new Error(`${url} did not load`));
        img.src = url;
      }),
    src,
  );

test.describe("Prashna as an installed app", () => {
  test("the app is named Prashna and opens straight into /app/", async ({ page, request }) => {
    await page.goto("/app/");
    await expect(page).toHaveTitle("Prashna");

    const manifestUrl = await page.locator('link[rel="manifest"]').getAttribute("href");
    const manifest = await (await request.get(new URL(manifestUrl, page.url()).href)).json();
    expect(manifest).toMatchObject({
      name: "Prashna",
      short_name: "Prashna",
      start_url: "/app/",
      scope: "/app/",
      display: "standalone",
    });
  });

  test("the प्र icon comes in every size Android, iOS and browser tabs ask for", async ({ page, request }) => {
    await page.goto("/app/");
    const manifestUrl = new URL(await page.locator('link[rel="manifest"]').getAttribute("href"), page.url());
    const { icons } = await (await request.get(manifestUrl.href)).json();

    const declared = icons.map((icon) => `${icon.sizes} ${icon.purpose}`);
    expect(declared).toEqual(
      expect.arrayContaining(["192x192 any", "512x512 any", "192x192 maskable", "512x512 maskable"]),
    );
    for (const icon of icons) {
      expect(await imageSize(page, new URL(icon.src, manifestUrl).href)).toBe(icon.sizes);
    }

    const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    expect(await imageSize(page, appleIcon)).toBe("180x180");
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute("content", "Prashna");

    const tabIcons = page.locator('link[rel="icon"]');
    await expect(tabIcons).not.toHaveCount(0);
    for (const link of await tabIcons.all()) {
      const sizes = await link.getAttribute("sizes");
      expect(await imageSize(page, await link.getAttribute("href"))).toBe(sizes);
    }
  });
});

test.describe("working offline", () => {
  // The offline cache is what these tests check, so let the service worker run.
  test.use({ serviceWorkers: "allow" });

  // One online visit, then the network goes off.
  test.beforeEach(async ({ page, context }) => {
    await page.goto("/app/");
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((done) => navigator.serviceWorker.addEventListener("controllerchange", done, { once: true }));
      }
    });
    await context.setOffline(true);
  });

  test("Prashna opens with the network off after one visit", async ({ page }) => {
    await page.reload();
    await expect(page.getByRole("heading", { name: "Prashna" })).toBeVisible();
    await expect(preview(page)).toBeVisible();

    // The installed app opens at /app/ itself, and the fonts come from the cache too.
    await page.goto("/app/");
    await expect(preview(page)).toBeVisible();
    expect(await page.evaluate(() => document.fonts.ready.then(() => document.fonts.check('16px "Inter"')))).toBe(true);
  });

  test("every app file is available with the network off", async ({ page }) => {
    await page.reload();
    const missing = await page.evaluate(async (urls) => {
      const failed = [];
      for (const url of urls) {
        const response = await fetch(url).catch(() => null);
        if (!response || !response.ok) failed.push(url);
      }
      return failed;
    }, await appFiles());
    expect(missing).toEqual([]);
  });

  test("a teacher can design and export a Paper with the network off", async ({ page }) => {
    await page.reload();
    await loadTemplate(page, TEMPLATES.starter);
    await addQuestion(page, { section: "Section A", marks: 1, text: "Written while offline" });
    await expect(preview(page)).toContainText("Written while offline");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Word (.doc)" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.doc$/);

    // Work done offline is still there after reopening the app offline.
    await page.reload();
    await expect(preview(page)).toContainText("Written while offline");
    await expect(await moreMenuButton(page, "Install App")).toBeVisible();
  });
});
