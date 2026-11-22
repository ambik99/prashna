import { test, expect } from "@playwright/test";
import { TEMPLATES, loadTemplate, marksSummary, preview } from "./helpers.mjs";

const marksPerQuestion = (page, section) => page.getByLabel(`${section} marks per question`);
const numberOfQuestions = (page, section) => page.getByLabel(`${section} number of questions`);

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
  // One Question each in Sections A (1 mark), B (3) and E (4): 8 marks.
  await loadTemplate(page, TEMPLATES.starter);
});

test("a Section's marks per question and number of questions set its planned marks", async ({ page }) => {
  await marksPerQuestion(page, "Section C").selectOption({ label: "4M/Q" });
  await numberOfQuestions(page, "Section C").selectOption({ label: "2 Qs" });

  // 2 Questions at 4 marks each: 8 marks planned, none added yet.
  await expect(marksSummary(page)).toContainText("Section C: 0/2Q (0 / 8M)");
});

test("a Section with custom marks shows no planned marks", async ({ page }) => {
  await marksPerQuestion(page, "Section C").selectOption({ label: "Custom" });
  await numberOfQuestions(page, "Section C").selectOption({ label: "2 Qs" });

  await expect(marksSummary(page)).toContainText("Section C: 0/2Q (0)");
});

test("a Section that is not in use is left out of the Paper and its totals", async ({ page }) => {
  const paper = preview(page);
  await expect(paper).toContainText("Section B");
  await expect(paper).toContainText("Max. Marks: 8");

  await numberOfQuestions(page, "Section B").selectOption({ label: "Not in use" });

  // Section B's 3-mark Question no longer counts: 8 - 3 = 5.
  await expect(paper).not.toContainText("Section B");
  await expect(paper).toContainText("Max. Marks: 5");
  await expect(marksSummary(page)).not.toContainText("Section B");
  await expect(marksSummary(page)).toContainText("Total: 5 Marks");
  // New Questions can't be added to it: it's no longer offered in the Add Question form.
  const sectionChoice = page.getByLabel("Section", { exact: true });
  await expect(sectionChoice.getByRole("option", { name: "Section B", exact: true })).toHaveCount(0);
  await expect(sectionChoice.getByRole("option", { name: "Section A", exact: true })).toHaveCount(1);
});

test("a Section's note is printed under its heading", async ({ page }) => {
  await page.getByLabel("Section A", { exact: true }).fill("Choose the correct option (1 mark each).");

  await expect(preview(page)).toContainText("Choose the correct option (1 mark each).");
});

test("a new Question's marks default to its Section's marks per question", async ({ page }) => {
  const marks = page.getByLabel("Marks", { exact: true });

  await page.getByLabel("Section", { exact: true }).selectOption("Section D");
  await expect(marks).toHaveValue("5");

  await marksPerQuestion(page, "Section D").selectOption({ label: "6M/Q" });
  await expect(marks).toHaveValue("6");
});
