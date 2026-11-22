import { test, expect } from "@playwright/test";
import { preview } from "./helpers.mjs";

// The light and dark theme toggle on the Landing Page and in the app.
// Page backgrounds, as DESIGN.md and the stylesheets define them.
const BACKGROUND = {
  landing: { light: "rgb(248, 248, 248)", dark: "rgb(17, 18, 20)" },
  app: { light: "rgb(246, 244, 239)", dark: "rgb(17, 19, 24)" },
};

const darkTheme = (page) => page.getByRole("button", { name: "Dark theme" });
const background = (page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe("following the device", () => {
  test("a device set to light shows the light theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "false");
    expect(await background(page)).toBe(BACKGROUND.landing.light);
  });

  test("a device set to dark shows the dark theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/app/");
    await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "true");
    expect(await background(page)).toBe(BACKGROUND.app.dark);
  });

  test("switching the device's setting switches the page until a theme is chosen", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "true");
    expect(await background(page)).toBe(BACKGROUND.landing.dark);
  });
});

test("choosing the dark theme switches the Landing Page at once", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await darkTheme(page).click();
  await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "true");
  expect(await background(page)).toBe(BACKGROUND.landing.dark);

  // A chosen theme no longer follows the device.
  await page.emulateMedia({ colorScheme: "light" });
  expect(await background(page)).toBe(BACKGROUND.landing.dark);
});

test("the chosen theme is remembered and shared by the Landing Page and the app", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await darkTheme(page).click();
  await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "false");

  await page.reload();
  await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "false");
  expect(await background(page)).toBe(BACKGROUND.landing.light);

  await page.goto("/app/");
  await expect(darkTheme(page)).toHaveAttribute("aria-pressed", "false");
  expect(await background(page)).toBe(BACKGROUND.app.light);

  await darkTheme(page).click();
  await page.goto("/");
  expect(await background(page)).toBe(BACKGROUND.landing.dark);
});

test("the chosen theme shows before the page has loaded, with no flash of the other", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/app/");
  await darkTheme(page).click();

  // Record the background as soon as the page's content is in place
  // (DOMContentLoaded), the earliest a test can look.
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      window.__firstBackground = getComputedStyle(document.body).backgroundColor;
    });
  });
  await page.reload();
  expect(await page.evaluate(() => window.__firstBackground)).toBe(BACKGROUND.app.dark);
});

test("the Paper preview stays white in the dark theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/app/");
  await darkTheme(page).click();
  const sheet = preview(page).getByText("General Instructions").first();
  const sheetBackground = await sheet.evaluate((el) => {
    for (let node = el; node; node = node.parentElement) {
      const color = getComputedStyle(node).backgroundColor;
      if (color !== "rgba(0, 0, 0, 0)") return color;
    }
    return null;
  });
  expect(sheetBackground).toBe("rgb(255, 255, 255)");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the Landing Page shows no toggle and stays readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner").getByRole("button")).toHaveText(["Get the App"]);
    expect(await background(page)).toBe(BACKGROUND.landing.light);
  });
});
