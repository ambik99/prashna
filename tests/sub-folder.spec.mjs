import { test, expect } from "@playwright/test";
import { preview, readManifest, waitForOfflineCopy } from "./helpers.mjs";

// The beta site on GitHub Pages lives in a sub-folder
// (https://ambik99.github.io/prashna/), not at the site root. These tests run
// in the "sub-folder" project, whose server serves the site at /prashna/ and
// nothing at the root, so any link that assumes the root fails here.
// Addresses below are relative to the sub-folder.

// The sub-folder the project serves the site from, e.g. "/prashna/".
const subFolder = (baseURL) => new URL(baseURL).pathname;

// Every response the page gets that isn't OK, as "status url".
function recordFailures(page) {
  const failures = [];
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  return failures;
}

test("the Landing Page and the app work from the sub-folder", async ({ page, baseURL }) => {
  const failures = recordFailures(page);
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Try it in your browser" }).first().click();
  await expect(page).toHaveURL(new RegExp(`${subFolder(baseURL)}app/$`));
  await expect(preview(page)).toBeVisible();
  expect(failures).toEqual([]);
});

test("the installed app opens at the app in the sub-folder", async ({ page, request, baseURL }) => {
  await page.goto("app/");
  const { url, manifest, installed } = await readManifest(page, request);

  const app = `${subFolder(baseURL)}app/`;
  expect(installed).toEqual({ opens: app, scope: app, identity: app });
  expect((await request.get(new URL(manifest.start_url, url).href)).ok()).toBe(true);
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
