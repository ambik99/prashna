import { test, expect } from "@playwright/test";
import { moreMenuButton, preview } from "./helpers.mjs";

// Get the App behaves differently on each kind of device. The browser's own
// install prompt can't be opened in a test, so these tests stand in a prompt
// that records being shown, the way Chrome and Edge offer one.
async function offerInstallPrompt(page, outcome = "accepted") {
  await page.evaluate((choice) => {
    window.__installPromptShown = 0;
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {
      window.__installPromptShown += 1;
    };
    event.userChoice = Promise.resolve({ outcome: choice, platform: "web" });
    window.dispatchEvent(event);
  }, outcome);
}

const installPromptsShown = (page) => page.evaluate(() => window.__installPromptShown);

test.describe("desktop Chrome or Edge, with an install prompt", () => {
  test("Get the App opens the browser's install prompt", async ({ page }) => {
    await page.goto("/app/");
    await offerInstallPrompt(page);

    await (await moreMenuButton(page, "Get the App")).click();

    expect(await installPromptsShown(page)).toBe(1);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

// A phone: narrow viewport, touch, mobile browser.
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

test.describe("Android Chrome, with an install prompt", () => {
  test.use({
    ...phone,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  });

  test("Get the App in the More sheet opens the browser's install prompt", async ({ page }) => {
    await page.goto("/app/");
    await offerInstallPrompt(page);

    await page.getByRole("button", { name: "More", exact: true }).tap();
    await page.getByRole("button", { name: "Get the App", exact: true }).tap();

    expect(await installPromptsShown(page)).toBe(1);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("iPhone Safari", () => {
  test.use({
    ...phone,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  });

  test("Get the App shows the two steps to add Prashna to the Home Screen", async ({ page }) => {
    await page.goto("/app/");

    await page.getByRole("button", { name: "More", exact: true }).tap();
    await page.getByRole("button", { name: "Get the App", exact: true }).tap();

    const guide = page.getByRole("dialog", { name: "Add Prashna to your Home Screen" });
    await expect(guide).toBeVisible();
    const steps = guide.getByRole("listitem");
    await expect(steps).toHaveCount(2);
    await expect(steps.nth(0)).toContainText("Share");
    await expect(steps.nth(0).getByRole("img", { name: "Share button" })).toBeVisible();
    await expect(steps.nth(1)).toContainText("Add to Home Screen");
    await expect(steps.nth(1).getByRole("img", { name: "Add to Home Screen" })).toBeVisible();

    await expect(guide).not.toContainText("Download");

    await guide.getByRole("button", { name: "Got it" }).tap();
    await expect(guide).toBeHidden();
  });
});

test.describe("a browser that can't install apps", () => {
  test.use({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0" });

  test("Get the App suggests Chrome or Safari, and the app keeps working here", async ({ page }) => {
    await page.goto("/app/");

    await (await moreMenuButton(page, "Get the App")).click();

    const hint = page.getByRole("dialog", { name: "Get the App in Chrome or Safari" });
    await expect(hint).toBeVisible();
    await expect(hint).toContainText("Chrome");
    await expect(hint).toContainText("Safari");
    await expect(hint).toContainText("keep using Prashna here");
    await expect(hint).not.toContainText("Download");

    await hint.getByRole("button", { name: "Got it" }).click();
    await expect(hint).toBeHidden();
    await page.getByLabel("School Name").fill("Still Working School");
    await expect(preview(page)).toContainText("Still Working School");
  });
});

test.describe("running as an installed app", () => {
  // Opened from the home screen or app list, the app runs standalone. Chromium
  // can't emulate that display mode, so these tests stand in what an
  // installed app reports: Android and computers through the display-mode
  // media query, iPhone and iPad through navigator.standalone.
  test("Get the App is hidden on Android or a computer", async ({ page }) => {
    await page.addInitScript(() => {
      const realMatchMedia = window.matchMedia.bind(window);
      window.matchMedia = (query) =>
        /display-mode:\s*standalone/.test(query) ? { ...realMatchMedia(query), matches: true, media: query } : realMatchMedia(query);
    });
    await page.goto("/app/");

    await (await moreMenuButton(page, "Save Paper (.json)")).waitFor();
    await expect(page.getByRole("button", { name: "Get the App", exact: true })).toBeHidden();
  });

  test("Get the App is hidden on an iPhone", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "standalone", { value: true }));
    await page.goto("/app/");

    await (await moreMenuButton(page, "Save Paper (.json)")).waitFor();
    await expect(page.getByRole("button", { name: "Get the App", exact: true })).toBeHidden();
  });

  test("Get the App hides once the teacher installs Prashna from the prompt", async ({ page }) => {
    await page.goto("/app/");
    await offerInstallPrompt(page);
    await (await moreMenuButton(page, "Get the App")).click();
    await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));

    await (await moreMenuButton(page, "Save Paper (.json)")).waitFor();
    await expect(page.getByRole("button", { name: "Get the App", exact: true })).toBeHidden();
  });
});
