// Shared steps for the browser tests, phrased the way a teacher uses the tool.
import { expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const fixture = (name) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

// Template names exactly as the tool lists them.
export const TEMPLATES = {
  starter: "Starter Sample (8 Marks)",
  unitTestII: "Unit Test-II Format (20 Marks)",
  unitTest: "Unit Test Pattern (40 Marks)",
  board: "Board Pattern Starter (Class X)",
};

// The Paper preview, as a teacher sees it beside the editor.
export const preview = (page) => page.getByRole("region", { name: "Question Paper Preview" });
// The marks summary above the editor (Section totals and Target Marks).
export const marksSummary = (page) => page.getByRole("region", { name: "Section Marks Breakdown" });

// The top bar's "More" menu holds the less frequent actions.
export async function openMoreMenu(page) {
  const more = page.getByRole("button", { name: "More", exact: true });
  if ((await more.getAttribute("aria-expanded")) !== "true") await more.click();
}

// A button inside the "More" menu (opening the menu first).
export async function moreMenuButton(page, name) {
  await openMoreMenu(page);
  return page.getByRole("button", { name, exact: true });
}

export async function loadTemplate(page, name) {
  await openMoreMenu(page);
  await page.getByLabel("Load CBSE Template").selectOption({ label: name });
}

export async function chooseTargetMarks(page, label) {
  await page.getByLabel("Target Total Marks").selectOption({ label });
}

// Clicks Save Paper and returns the downloaded Paper file's path and contents.
export async function savePaper(page) {
  await openMoreMenu(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Save Paper (.json)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const path = await download.path();
  return { path, contents: JSON.parse(await readFile(path, "utf8")) };
}

// Clicks a button that opens a file chooser and picks the given file.
export async function chooseFile(page, button, filePath) {
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), button.click()]);
  await chooser.setFiles(filePath);
}

export async function loadPaper(page, filePath) {
  await chooseFile(page, await moreMenuButton(page, "Load Paper"), filePath);
}

// The per-Question buttons in the preview, in Paper order (0 is the first Question).
export const questionButton = (page, name, index) =>
  preview(page).getByRole("button", { name, exact: true }).nth(index);

// Starts from a Paper with no Questions (the starter Template's details, Questions removed).
export async function startEmptyPaper(page) {
  await loadTemplate(page, TEMPLATES.starter);
  const remove = preview(page).getByRole("button", { name: "Remove", exact: true });
  while ((await remove.count()) > 0) await remove.first().click();
  await expect(preview(page)).toContainText("No questions added yet.");
}

// Fills the Add Question form and adds the Question to the Paper.
export async function addQuestion(
  page,
  { section, marks, type, text, options, assertion, reason, passage, subQuestions, alternative, markingScheme, scienceDivision },
) {
  if (section) await page.getByLabel("Section", { exact: true }).selectOption(section);
  if (scienceDivision) await page.getByLabel("Science Division", { exact: true }).selectOption(scienceDivision);
  if (type) await page.getByLabel("Question Type").selectOption({ label: type });
  if (marks !== undefined) await page.getByLabel("Marks", { exact: true }).fill(String(marks));
  if (text) await page.getByLabel("Question Text").fill(text);
  if (passage) await page.getByLabel("Case-Study Passage").fill(passage);
  if (subQuestions) await page.getByLabel("Sub-questions (one per line)").fill(subQuestions.join("\n"));
  if (options) {
    for (const [i, letter] of ["a", "b", "c", "d"].entries()) {
      await page.getByPlaceholder(`(${letter}) Option ${letter.toUpperCase()}`).fill(options[i]);
    }
  }
  if (assertion) await page.getByLabel("Assertion (A)").fill(assertion);
  if (reason) await page.getByLabel("Reason (R)").fill(reason);
  if (alternative) {
    await page.getByLabel('Include internal choice ("OR")').check();
    await page.getByLabel('Alternative ("OR") Question').fill(alternative);
  }
  if (markingScheme) await page.getByLabel("Answer / Marking Scheme (Optional)").fill(markingScheme);
  await page.getByRole("button", { name: "+ Add Question to Paper" }).click();
}
