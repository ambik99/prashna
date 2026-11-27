import { test, expect } from "@playwright/test";
import { preview } from "./helpers.mjs";

// The Landing Page at the site root introduces Prashna and leads teachers to
// Get the App or Try it in your browser. The app itself stays at /app/.

const headline = (page) => page.getByRole("heading", { level: 1 });
const getTheApp = (page) => page.getByRole("button", { name: "Get the App" }).first();

// Chrome and Edge offer an install prompt; tests stand in one that records
// being shown (see get-the-app.spec.mjs).
async function offerInstallPrompt(page) {
  await page.evaluate(() => {
    window.__installPromptShown = 0;
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {
      window.__installPromptShown += 1;
    };
    event.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" });
    window.dispatchEvent(event);
  });
}

test("the site root shows the Landing Page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/$/);
  await expect(page).toHaveTitle(/Prashna/);
  // The second line of the headline changes every few seconds; screen
  // readers hear the first one.
  await expect(headline(page)).toHaveAccessibleName("Set question papers in minutes, not evenings.");
  await expect(page.getByText("Made by a CBSE teacher")).toBeVisible();
  await expect(getTheApp(page)).toBeVisible();
  await expect(page.getByRole("link", { name: "Try it in your browser" }).first()).toBeVisible();
});

test("the Landing Page has every section, in order", async ({ page }) => {
  await page.goto("/");

  const steps = page.getByRole("tablist", { name: "How it works" }).getByRole("tab");
  expect(await steps.evaluateAll((tabs) => tabs.map((t) => t.getAttribute("aria-label")))).toEqual([
    "Set up",
    "Add questions",
    "Preview",
    "Print",
  ]);
  const headings = await page.getByRole("main").getByRole("heading", { level: 2 }).allTextContents();
  expect(headings.map((h) => h.trim())).toEqual([
    "Everything a CBSE Paper needs, in one place.",
    "Print it, or take it to Word.",
    "Your papers stay on your device.",
    "Made by a teacher",
    "Questions teachers ask",
    "Set your next Paper in minutes.",
  ]);
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("not affiliated with CBSE");
});

test("Try it in your browser opens the app", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Try it in your browser" }).first().click();

  await expect(page).toHaveURL(/\/app\/$/);
  await expect(preview(page)).toBeVisible();
});

test("Get the App opens the browser's install prompt where there is one", async ({ page }) => {
  await page.goto("/");
  await offerInstallPrompt(page);

  await getTheApp(page).click();

  expect(await page.evaluate(() => window.__installPromptShown)).toBe(1);
});

test("once Prashna is installed, Get the App becomes Open app", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));

  await expect(page.getByRole("button", { name: "Get the App" })).toHaveCount(0);
  await page.getByRole("link", { name: "Open app" }).first().click();
  await expect(page).toHaveURL(/\/app\/$/);
});

test("the product tour shows a real screenshot for each step", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause tour" }).click();

  const steps = [
    ["Set up", "Prashna on a computer"],
    ["Add questions", "Prashna on a phone: editing a Question"],
    ["Preview", "Prashna on a phone: the Paper preview"],
    ["Print", "The printed Paper"],
  ];
  for (const [step, imageName] of steps) {
    await page.getByRole("tab", { name: step }).click();
    await expect(page.getByRole("tab", { name: step })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText(step, { exact: true }).first()).toBeVisible();
    const image = page.getByRole("tabpanel", { name: step }).getByRole("img", { name: imageName, exact: false });
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
});

test("the tour's arrows step through How it works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause tour" }).click();

  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByRole("tab", { name: "Add questions" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Previous step" }).click();
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByRole("tab", { name: "Print" })).toHaveAttribute("aria-selected", "true");
});

test("the maker's quote and details are shown", async ({ page }) => {
  await page.goto("/");

  const maker = page.getByRole("region", { name: "Made by a teacher" });
  await expect(maker.getByText("Stay hungry, stay foolish.")).toBeVisible();
  await expect(maker.getByText("Ambik Mojumder", { exact: true })).toBeVisible();
  await expect(maker.getByText("Computer Science Faculty, Caesar School")).toBeVisible();
  await expect(maker.getByText("Placeholder", { exact: false })).toHaveCount(0);
  // The contact email is still to come.
  await expect(page.getByRole("contentinfo").getByText("Placeholder", { exact: false })).toBeVisible();
});

test.describe("launch animation", () => {
  // Once per browser session, the Prashna logo rises in with the maker's
  // credit beneath it, then gives way to the page.
  const credit = (page) => page.getByText("Created by Ambik Mojumder");

  test("plays on the first visit and goes away by itself", async ({ page }) => {
    await page.goto("/");

    await expect(credit(page)).toBeVisible();
    await expect(credit(page)).toBeHidden({ timeout: 3000 });
    await expect(headline(page)).toBeVisible();
    await expect(getTheApp(page)).toBeVisible();
  });

  test("does not play again in the same session", async ({ page }) => {
    await page.goto("/");
    await expect(credit(page)).toBeHidden({ timeout: 3000 });

    await page.reload();
    expect(await credit(page).isVisible()).toBe(false);
  });

  test("a click skips it", async ({ page }) => {
    await page.goto("/");
    await expect(credit(page)).toBeVisible();

    await page.mouse.click(20, 20);
    await expect(credit(page)).toBeHidden({ timeout: 500 });
  });

  test("does not play under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    expect(await credit(page).isVisible()).toBe(false);
    await expect(headline(page)).toBeVisible();
  });
});

test.describe("on a phone", () => {
  test.use({
    viewport: { width: 360, height: 780 },
    hasTouch: true,
    isMobile: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  });

  test("the Landing Page fits the screen with no sideways scrolling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
  });

  test("Get the App on an iPhone shows the Add to Home Screen guide", async ({ page }) => {
    await page.goto("/");

    await getTheApp(page).tap();

    const guide = page.getByRole("dialog", { name: "Add Prashna to your Home Screen" });
    await expect(guide).toBeVisible();
    await guide.getByRole("button", { name: "Got it" }).tap();
    await expect(guide).toBeHidden();
  });
});
