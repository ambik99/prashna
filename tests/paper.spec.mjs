import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// A Paper file saved by version 10.0 of the tool before any redesign work began.
const FIXTURE_V10 = fileURLToPath(new URL("./fixtures/paper-saved-by-v10.json", import.meta.url));

// Template names exactly as the tool lists them.
const STARTER_TEMPLATE = "Starter Sample (8 Marks)";
const UNIT_TEST_II_TEMPLATE = "Unit Test-II Format (20 Marks)";
const UNIT_TEST_TEMPLATE = "Unit Test Pattern (40 Marks)";

// The Paper preview, as a teacher sees it beside the editor.
const preview = (page) => page.getByRole("region", { name: "Question Paper Preview" });
// The marks summary above the editor (Section totals and Target Marks).
const marksSummary = (page) => page.getByRole("region", { name: "Section Marks Breakdown" });

async function loadTemplate(page, name) {
  await page.getByLabel("Load CBSE Template").selectOption({ label: name });
}

async function chooseTargetMarks(page, label) {
  await page.getByLabel("Target Total Marks").selectOption({ label });
}

// Clicks Save Paper and returns the downloaded Paper file's contents.
async function savePaper(page) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Save Paper (.json)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const path = await download.path();
  return { path, contents: JSON.parse(await readFile(path, "utf8")) };
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

test("Section totals and Target Marks add up for a loaded Template", async ({ page }) => {
  // This Template has one Question each in Sections A (1 mark), B (3) and E (4): 8 marks.
  await loadTemplate(page, STARTER_TEMPLATE);

  const summary = marksSummary(page);
  await expect(summary).toContainText("Section A: 1/20Q (1 / 20M)");
  await expect(summary).toContainText("Section B: 1/5Q (3 / 10M)");
  await expect(summary).toContainText("Section E: 1/3Q (4 / 12M)");
  await expect(summary).toContainText("Total: 8 Marks");
  await expect(preview(page)).toContainText("Max. Marks: 8");

  // The Template's Target Marks of 80 leaves 72 to go.
  await expect(summary).toContainText("72 marks remaining");

  await chooseTargetMarks(page, "Target: 20 Marks");
  await expect(summary).toContainText("12 marks remaining");

  await chooseTargetMarks(page, "No Target");
  await expect(summary).not.toContainText("remaining");
});

test("a saved Paper file loads back exactly", async ({ page }) => {
  await loadTemplate(page, UNIT_TEST_II_TEMPLATE);
  await page.getByLabel("School Name").fill("Round Trip Vidyalaya");
  await chooseTargetMarks(page, "Target: 50 Marks");
  const paper = preview(page);
  await expect(paper).toContainText("Round Trip Vidyalaya");
  const saved = await savePaper(page);

  // Replace the Paper with something else, then load the saved file.
  await loadTemplate(page, STARTER_TEMPLATE);
  await expect(paper).not.toContainText("Round Trip Vidyalaya");

  await loadPaper(page, saved.path);
  await expect(paper).toContainText("Round Trip Vidyalaya");
  await expect(paper).toContainText("Unit Test-II (2026–27)");
  await expect(paper).toContainText("Max. Marks: 6");
  // 50 Target Marks minus the Template's 6 marks.
  await expect(marksSummary(page)).toContainText("44 marks remaining");

  // Everything in the file came back: saving again gives the same file.
  const resaved = await savePaper(page);
  expect(resaved.contents).toEqual(saved.contents);
});

test("a Paper file saved by the original tool still loads", async ({ page }) => {
  await loadPaper(page, FIXTURE_V10);

  const paper = preview(page);
  await expect(paper).toContainText("Fixture High School, Jalpaiguri");
  await expect(paper).toContainText("Pre-Board Examination (2026–27)");
  await expect(paper).toContainText("Class 10 — Science");
  await expect(paper).toContainText("Max. Marks: 16");

  // Section totals from the file: A has 2 Questions (2 marks), B 2, C 3, D 5, E 4.
  const summary = marksSummary(page);
  await expect(summary).toContainText("Section A: 2/20Q (2 / 20M)");
  await expect(summary).toContainText("Section D: 1/4Q (5 / 20M)");
  await expect(summary).toContainText("Total: 16 Marks");

  // One Question of each type: MCQ, Assertion–Reason, Standard (with an Alternative Question), Case-Study.
  await expect(paper).toContainText("Which of the following is an amphoteric oxide?");
  await expect(paper).toContainText("Silver chloride turns grey in sunlight.");
  await expect(paper).toContainText("Explain esterification and saponification reaction");

  await page.getByRole("button", { name: "Show Marking Scheme" }).click();
  await expect(paper).toContainText("P = 1/f (in m), SI unit Dioptre (D); P = +4 D.");

  // Nothing in the file is lost: saving again keeps every original field.
  const original = JSON.parse(await readFile(FIXTURE_V10, "utf8"));
  const resaved = await savePaper(page);
  expect(resaved.contents).toMatchObject(original);
});

test("the Paper survives closing and reopening the app", async ({ page }) => {
  await loadTemplate(page, UNIT_TEST_TEMPLATE);
  await page.getByLabel("School Name").fill("Reload Proof School");
  await page.getByLabel("Subject", { exact: true }).fill("Physics");
  await expect(preview(page)).toContainText("Reload Proof School");
  const beforeReload = await savePaper(page);

  await page.reload();

  await expect(page.getByLabel("School Name")).toHaveValue("Reload Proof School");
  const paper = preview(page);
  await expect(paper).toContainText("Reload Proof School");
  await expect(paper).toContainText("Class 10 — Physics");
  await expect(paper).toContainText("Max. Marks: 12");

  // The whole Paper, Questions included, is still there.
  const afterReload = await savePaper(page);
  expect(afterReload.contents).toEqual(beforeReload.contents);
});
