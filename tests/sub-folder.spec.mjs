import { test, expect } from "@playwright/test";
import { preview, waitForOfflineCopy } from "./helpers.mjs";

// The beta site on GitHub Pages lives in a sub-folder
// (https://ambik99.github.io/prashna/), not at the site root. These tests run
// in the "sub-folder" project, whose server serves the site at /prashna/ and
// nothing at the root, so any link that assumes the root fails here.
// Addresses below are relative to /prashna/.

const SITE = "/prashna/";

// Every response the page gets that isn't OK, as "status url".
function recordFailures(page) {
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  return failures;
}

test("the Landing Page and the app work from the sub-folder", async ({ page }) => {
  const failures = recordFailures(page);
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Try it in your browser" }).first().click();
  await expect(page).toHaveURL(new RegExp(`${SITE}app/$`));
  await expect(preview(page)).toBeVisible();
  expect(failures).toEqual([]);
});

test("the installed app opens at the app in the sub-folder", async ({ page, request }) => {
  await page.goto("app/");
  const manifestUrl = new URL(await page.locator('link[rel="manifest"]').getAttribute("href"), page.url());
  const manifest = await (await request.get(manifestUrl.href)).json();

  // The browser reads these addresses relative to the manifest file.
  const startUrl = new URL(manifest.start_url, manifestUrl);
  expect(startUrl.pathname).toBe(`${SITE}app/`);
  expect(new URL(manifest.scope, manifestUrl).pathname).toBe(`${SITE}app/`);
  expect(new URL(manifest.id, startUrl).pathname).toBe(`${SITE}app/`);

  const opened = await request.get(startUrl.href);
  expect(opened.ok()).toBe(true);
});

test.describe("offline from the sub-folder", () => {
  test.use({ serviceWorkers: "allow" });

  test("Prashna opens with the network off after one visit", async ({ page, context }) => {
    await page.goto("app/");
    await waitForOfflineCopy(page);
    await context.setOffline(true);

    await page.reload();
    await expect(preview(page)).toBeVisible();
  });
});
