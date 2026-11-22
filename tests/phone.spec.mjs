import { test, expect } from "@playwright/test";
import { answerConfirmation, confirmDialog, preview } from "./helpers.mjs";

// A phone: narrow viewport, touch, mobile browser.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

const tab = (page, name) => page.getByRole("tab", { name, exact: true });
const moreButton = (page) => page.getByRole("button", { name: "More", exact: true });
const bankPanel = (page) => page.getByRole("complementary", { name: "Question Bank" });

async function openMoreSheet(page) {
  if ((await moreButton(page).getAttribute("aria-expanded")) !== "true") await moreButton(page).tap();
  await expect(page.locator("#moreMenu")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

test("the bottom tab bar switches between Edit, Preview and Bank", async ({ page }) => {
  await expect(tab(page, "Edit")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("School Name")).toBeVisible();
  await expect(preview(page)).toBeHidden();

  await tab(page, "Preview").tap();
  await expect(tab(page, "Preview")).toHaveAttribute("aria-selected", "true");
  await expect(preview(page)).toBeVisible();
  await expect(page.getByLabel("School Name")).toBeHidden();

  await tab(page, "Bank").tap();
  await expect(tab(page, "Bank")).toHaveAttribute("aria-selected", "true");
  await expect(tab(page, "Preview")).toHaveAttribute("aria-selected", "false");
  await expect(bankPanel(page)).toBeVisible();

  await tab(page, "Edit").tap();
  await expect(bankPanel(page)).toBeHidden();
  await expect(tab(page, "Edit")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("School Name")).toBeVisible();
});

test("the tab bar stays at the bottom of the screen", async ({ page }) => {
  const bar = page.getByRole("navigation", { name: "Views" });
  await expect(bar).toBeInViewport();
  await page.getByLabel("Answer / Marking Scheme (Optional)").scrollIntoViewIfNeeded();
  await expect(bar).toBeInViewport();
  const box = await bar.boundingBox();
  expect(Math.round(box.y + box.height)).toBe(844);
});

test("every top bar and More action is reachable from the More sheet", async ({ page }) => {
  await openMoreSheet(page);
  const sheet = page.locator("#moreMenu");
  for (const name of [
    "Print / Save as PDF",
    "Export Word (.doc)",
    "Save Paper (.json)",
    "Load Paper",
    "Reset Sample",
    "Show Marking Scheme",
    "Print Marking Scheme",
    "Get the App",
  ]) {
    await expect(sheet.getByRole("button", { name, exact: true })).toBeVisible();
  }
  await expect(sheet.getByLabel("Load CBSE Template")).toBeVisible();
});

test("Print from the More sheet asks the browser to print", async ({ page }) => {
  await page.evaluate(() => {
    window.__printed = 0;
    window.print = () => { window.__printed += 1; };
  });
  await openMoreSheet(page);
  await page.getByRole("button", { name: "Print / Save as PDF" }).tap();
  expect(await page.evaluate(() => window.__printed)).toBe(1);
  await expect(page.locator("#moreMenu")).toBeHidden();
});

test("Export Word from the More sheet downloads the Paper", async ({ page }) => {
  await openMoreSheet(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export Word (.doc)" }).tap(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.doc$/);
});

test("the More sheet closes when the backdrop is tapped", async ({ page }) => {
  await openMoreSheet(page);
  await page.mouse.click(195, 60); // Above the sheet, on the backdrop.
  await expect(page.locator("#moreMenu")).toBeHidden();
  await expect(moreButton(page)).toHaveAttribute("aria-expanded", "false");
});

test("a confirmation opens as a bottom sheet and Cancel keeps the Paper", async ({ page }) => {
  await tab(page, "Preview").tap();
  await preview(page).getByRole("button", { name: "Remove", exact: true }).first().tap();
  const dialog = confirmDialog(page);
  await expect(dialog).toBeVisible();
  // It rises from the bottom edge (waiting for its slide-in to finish).
  await expect.poll(async () => {
    const box = await dialog.boundingBox();
    return Math.round(box.y + box.height);
  }).toBe(844);

  await answerConfirmation(page, "Cancel");
  await expect(preview(page)).toContainText("Which gas is evolved");
});

test("Questions from the Bank tab can be inserted into the Paper", async ({ page }) => {
  await tab(page, "Bank").tap();
  await bankPanel(page).getByRole("button", { name: "+ Insert", exact: true }).first().tap();
  await tab(page, "Preview").tap();
  await expect(preview(page)).toContainText("Silver chloride turns grey in sunlight.");
});

test("Edit on a Question in the preview goes back to the editor", async ({ page }) => {
  await tab(page, "Preview").tap();
  await preview(page).getByRole("button", { name: "Edit", exact: true }).first().tap();
  await expect(tab(page, "Edit")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "3. Edit Question" })).toBeInViewport();
});

test("nothing scrolls sideways, in the editor or the preview", async ({ page }) => {
  const sideways = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(await sideways()).toBeLessThanOrEqual(0);
  await tab(page, "Preview").tap();
  expect(await sideways()).toBeLessThanOrEqual(0);
  // The Paper fits the screen width.
  const paper = await preview(page).boundingBox();
  expect(paper.x).toBeGreaterThanOrEqual(0);
  expect(paper.x + paper.width).toBeLessThanOrEqual(390);
});

test("text fields are at least 16px so focusing one doesn't zoom the page", async ({ page }) => {
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("input:not([type=checkbox]):not([type=file]), select, textarea")]
      .filter((el) => el.offsetParent !== null)
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
      .map((el) => el.id),
  );
  expect(small).toEqual([]);
});

test("the page allows zooming and reaches under the notch", async ({ page }) => {
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).toContain("viewport-fit=cover");
  expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1\b/);
});

test("animations are reduced when the device asks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await moreButton(page).tap();
  const duration = await page.locator("#moreMenu").evaluate((el) => getComputedStyle(el).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
});
