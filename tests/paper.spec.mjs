import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";

const FIXTURE_V10 = fileURLToPath(new URL("./fixtures/paper-saved-by-v10.json", import.meta.url));

// The Paper preview, as a teacher sees it beside the editor.
const preview = (page) => page.getByRole("region", { name: "Question Paper Preview" });
// The marks summary above the editor (Section totals and Target Marks).
const marksSummary = (page) => page.getByRole("region", { name: "Section Marks Breakdown" });

async function loadTemplate(page, name) {
  await page.getByLabel("Load CBSE Template").selectOption({ label: name });
}

// Clicks Save Paper and returns the path of the downloaded Paper file.
async function savePaper(page) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Save Paper (.json)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  return download.path();
}

// Clicks Load Paper and picks the given file in the file chooser.
async function loadPaper(page, filePath) {
  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: "Load Paper" }).click(),
  ]);
  await chooser.setFiles(filePath);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Paper Details typed in the editor appear in the preview", async ({ page }) => {
  await page.getByLabel("School Name").fill("Sunrise Public School, Siliguri");
  await page.getByLabel("Examination Title").fill("Periodic Test I (2026–27)");
  await page.getByLabel("Class", { exact: true }).selectOption("Class 9");
  await page.getByLabel("Subject", { exact: true }).fill("Mathematics");
  await page.getByLabel("Time Allowed").fill("1½ Hours");
  await page.getByLabel("General Instructions").fill("Answer all questions in the space provided.");

  const paper = preview(page);
  await expect(paper).toContainText("Sunrise Public School, Siliguri");
  await expect(paper).toContainText("Periodic Test I (2026–27)");
  await expect(paper).toContainText("Class 9 — Mathematics");
  await expect(paper).toContainText("Time: 1½ Hours");
  await expect(paper).toContainText("Answer all questions in the space provided.");
});

test("Section totals and Target Marks add up for the Starter Sample", async ({ page }) => {
  // The Starter Sample has one Question each in Sections A (1 mark), B (3) and E (4): 8 marks.
  await loadTemplate(page, "Starter Sample (8 Marks)");

  const summary = marksSummary(page);
  await expect(summary).toContainText("Section A: 1/20Q (1 / 20M)");
  await expect(summary).toContainText("Section B: 1/5Q (3 / 10M)");
  await expect(summary).toContainText("Section E: 1/3Q (4 / 12M)");
  await expect(summary).toContainText("Total: 8 Marks");
  await expect(preview(page)).toContainText("Max. Marks: 8");

  // Target Marks of 80 (the Starter Sample's default) leaves 72 to go.
  await expect(summary).toContainText("72 marks remaining");

  await page.getByLabel("Target Total Marks").selectOption({ label: "Target: 20 Marks" });
  await expect(summary).toContainText("12 marks remaining");

  await page.getByLabel("Target Total Marks").selectOption({ label: "No Target" });
  await expect(summary).not.toContainText("remaining");
});

test("a saved Paper file loads back exactly", async ({ page }) => {
  await loadTemplate(page, "Unit Test-II Format (20 Marks)");
  await page.getByLabel("School Name").fill("Round Trip Vidyalaya");
  const paper = preview(page);
  await expect(paper).toContainText("Round Trip Vidyalaya");
  const savedPaper = await paper.innerText();
  const savedFile = await savePaper(page);

  // Replace the Paper with something else, then load the saved file.
  await loadTemplate(page, "Starter Sample (8 Marks)");
  await expect(paper).not.toContainText("Round Trip Vidyalaya");

  await loadPaper(page, savedFile);
  await expect(paper).toContainText("Round Trip Vidyalaya");
  await expect(paper).toContainText("Unit Test-II (2026–27)");
  await expect(paper).toContainText("Max. Marks: 6");
  expect(await paper.innerText()).toBe(savedPaper);
  await expect(marksSummary(page)).toContainText("14 marks remaining");
});

test("a Paper file saved by the original tool still loads", async ({ page }) => {
  // Saved by version 10.0 of the tool before any redesign work began.
  await loadPaper(page, FIXTURE_V10);

  const paper = preview(page);
  await expect(paper).toContainText("Fixture High School, Jalpaiguri", { ignoreCase: true });
  await expect(paper).toContainText("Pre-Board Examination (2026–27)");
  await expect(paper).toContainText("Class 10 — Science");
  await expect(paper).toContainText("Max. Marks: 16");
  // One Question of each type in the file: MCQ, Assertion–Reason, Standard, Case-Study.
  await expect(paper).toContainText("Which of the following is an amphoteric oxide?");
  await expect(paper).toContainText("Silver chloride turns grey in sunlight.");
  await expect(paper).toContainText("Al2O3");
});

test("the Paper survives closing and reopening the app", async ({ page }) => {
  await loadTemplate(page, "Unit Test Pattern (40 Marks)");
  await page.getByLabel("School Name").fill("Reload Proof School");
  await page.getByLabel("Subject", { exact: true }).fill("Physics");
  await expect(preview(page)).toContainText("Reload Proof School");

  await page.reload();

  await expect(page.getByLabel("School Name")).toHaveValue("Reload Proof School");
  const paper = preview(page);
  await expect(paper).toContainText("Reload Proof School");
  await expect(paper).toContainText("Class 10 — Physics");
  await expect(paper).toContainText("Max. Marks: 12");
});
