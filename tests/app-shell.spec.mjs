import { test, expect } from "@playwright/test";
import { fixture, loadPaper, preview } from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

test("empty Paper Details show placeholders on the Paper", async ({ page }) => {
  for (const label of ["School Name", "Examination Title", "Time Allowed", "General Instructions"]) {
    await page.getByLabel(label).fill("");
  }
  await page.getByLabel("Subject", { exact: true }).fill("");

  const paper = preview(page);
  await expect(paper).toContainText("School Name");
  await expect(paper).toContainText("Examination Title");
  await expect(paper).toContainText("Class 10 — Subject");
  await expect(paper).toContainText("Time: 3 Hours");
  await expect(paper).toContainText("All questions are compulsory.");
});

test("the school crest watermark can be shown or hidden", async ({ page }) => {
  // The crest is the only image on a Paper without diagrams.
  const crest = preview(page).locator("img");
  await expect(crest).toBeVisible();

  await page.getByLabel("Show School Crest Watermark").uncheck();
  await expect(crest).toBeHidden();

  await page.getByLabel("Show School Crest Watermark").check();
  await expect(crest).toBeVisible();
});

test.describe("loading files that aren't Paper files", () => {
  test("a file with other data is rejected and the Paper is kept", async ({ page }) => {
    await page.getByLabel("School Name").fill("Keep This School");

    await loadPaper(page, fixture("not-a-paper.json"), { confirm: false });

    await expect(page.getByText("Invalid paper file")).toBeVisible();
    await expect(preview(page)).toContainText("Keep This School");
  });

  test("a file that can't be read is rejected and the Paper is kept", async ({ page }) => {
    await page.getByLabel("School Name").fill("Keep This School");

    await loadPaper(page, fixture("not-json.json"), { confirm: false });

    await expect(page.getByText("Could not read JSON")).toBeVisible();
    await expect(preview(page)).toContainText("Keep This School");
  });
});

// Phone layout (bottom tab bar, bottom sheets): see phone.spec.mjs.

// Get the App on each kind of device: see get-the-app.spec.mjs.

// The site root shows the Landing Page: see landing-page.spec.mjs.
