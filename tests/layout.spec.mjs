import { test, expect } from "@playwright/test";
import { TEMPLATES, loadTemplate, marksSummary, preview } from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

test("Print and Export are always in the top bar", async ({ page }) => {
  const topBar = page.getByRole("banner");
  await expect(topBar.getByRole("button", { name: "Print / Save as PDF" })).toBeVisible();
  await expect(topBar.getByRole("button", { name: "Export Word (.doc)" })).toBeVisible();
});

test("the top bar shows Prashna and the Paper's title as it changes", async ({ page }) => {
  const topBar = page.getByRole("banner");
  await expect(topBar.getByRole("heading", { name: "Prashna" })).toBeVisible();

  await page.getByLabel("Examination Title").fill("Pre-Board Examination");
  await expect(topBar).toContainText("Pre-Board Examination · Class 10 — Science");

  await loadTemplate(page, TEMPLATES.unitTestII);
  await expect(topBar).not.toContainText("Pre-Board Examination");
});

test("the More menu holds the less frequent actions", async ({ page }) => {
  const more = page.getByRole("button", { name: "More", exact: true });
  const actions = ["Save Paper (.json)", "Load Paper", "Reset Sample", "Show Marking Scheme", "Print Marking Scheme", "Install App"];

  for (const name of actions) await expect(page.getByRole("button", { name, exact: true })).toBeHidden();
  await expect(page.getByLabel("Load CBSE Template")).toBeHidden();

  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  for (const name of actions) await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
  await expect(page.getByLabel("Load CBSE Template")).toBeVisible();

  // Clicking elsewhere closes it.
  await preview(page).click({ position: { x: 10, y: 10 } });
  await expect(more).toHaveAttribute("aria-expanded", "false");
});

test("the More menu works from the keyboard", async ({ page }) => {
  const more = page.getByRole("button", { name: "More", exact: true });
  await more.focus();
  await page.keyboard.press("Enter");

  // Focus moves into the menu, starting with the Template choice.
  await expect(page.getByLabel("Load CBSE Template")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Save Paper (.json)" })).toBeFocused();

  // Escape closes it and puts focus back on More.
  await page.keyboard.press("Escape");
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await expect(more).toBeFocused();
});

test("editor steps collapse and expand while the preview stays live", async ({ page }) => {
  const step = page.getByRole("button", { name: "1. Paper Details" });
  const school = page.getByLabel("School Name");

  await expect(step).toHaveAttribute("aria-expanded", "true");
  await step.click();
  await expect(step).toHaveAttribute("aria-expanded", "false");
  await expect(school).toBeHidden();

  await step.click();
  await school.fill("Expanded Again School");
  await expect(preview(page)).toContainText("Expanded Again School");
});

test("each editor step can be collapsed", async ({ page }) => {
  for (const name of ["1. Paper Details", "2. Sections", "3. Add a Question"]) {
    const step = page.getByRole("button", { name });
    await step.click();
    await expect(step).toHaveAttribute("aria-expanded", "false");
  }
});

test("editing a collapsed Add Question step opens it", async ({ page }) => {
  await page.getByRole("button", { name: "3. Add a Question" }).click();
  await preview(page).getByRole("button", { name: "Edit", exact: true }).first().click();

  await expect(page.getByRole("heading", { name: "3. Edit Question" })).toBeVisible();
  await expect(page.getByLabel("Question Text")).toBeVisible();
});

test("the marks summary stays visible while scrolling the editor", async ({ page }) => {
  await page.getByLabel("Answer / Marking Scheme (Optional)").scrollIntoViewIfNeeded();
  await expect(marksSummary(page)).toBeInViewport();
  await expect(page.getByLabel("Target Total Marks")).toBeInViewport();
});
