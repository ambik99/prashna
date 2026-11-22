import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { TEMPLATES, addQuestion, loadTemplate, marksSummary, preview } from "./helpers.mjs";

const divisionChoice = (page) => page.getByLabel("Science Division (Class 9 & 10)");

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
  // A Class 10 Science Paper whose 8 marks split as Physics 4, Chemistry 1, Biology 3.
  await loadTemplate(page, TEMPLATES.starter);
});

test("Science Division appears only for Class 9 and 10 Science", async ({ page }) => {
  await expect(divisionChoice(page)).toBeVisible();

  await page.getByLabel("Class", { exact: true }).selectOption("Class 9");
  await expect(divisionChoice(page)).toBeVisible();

  await page.getByLabel("Class", { exact: true }).selectOption("Class 8");
  await expect(divisionChoice(page)).toBeHidden();

  await page.getByLabel("Class", { exact: true }).selectOption("Class 10");
  await page.getByLabel("Subject", { exact: true }).fill("Mathematics");
  await expect(divisionChoice(page)).toBeHidden();
});

test("the marks summary tracks each Science Division against its planned marks", async ({ page }) => {
  const summary = marksSummary(page);
  await expect(summary).toContainText("Physics: 4/25M");
  await expect(summary).toContainText("Chemistry: 1/25M");
  await expect(summary).toContainText("Biology: 3/30M");

  await page.getByLabel("Biology marks").fill("10");
  await expect(summary).toContainText("Biology: 3/10M");

  await addQuestion(page, {
    section: "Section C",
    scienceDivision: "Biology",
    marks: 3,
    text: "Describe the structure of a neuron.",
  });
  await expect(summary).toContainText("Biology: 6/10M");
});

test("a single Science Division Paper shows only that division's Questions", async ({ page }) => {
  await divisionChoice(page).selectOption({ label: "Chemistry Only" });

  const paper = preview(page);
  await expect(paper).toContainText("Class 10 — Science (Chemistry)");
  // Only the 1-mark Chemistry Question remains.
  await expect(paper).toContainText("Max. Marks: 1");
  await expect(marksSummary(page)).toContainText("Chemistry: 1/25M");
  await expect(marksSummary(page)).not.toContainText("Physics:");
});

// Exports the Paper to Word and returns the Word file's text.
async function exportWord(page) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Export Word (.doc)" }).click(),
  ]);
  return readFile(await download.path(), "utf8");
}

// The Starter Sample's three Questions, one per Science Division.
const STARTER_QUESTIONS = {
  Chemistry: "Which gas is evolved when dilute hydrochloric acid reacts with zinc granules?",
  Biology: "Define photosynthesis",
  Physics: "A student connects a 6 V battery across a resistor of 12 ohms",
};

test("Word export of a single Science Division Paper has only that division's Questions", async ({ page }) => {
  await divisionChoice(page).selectOption({ label: "Chemistry Only" });

  const word = await exportWord(page);
  expect(word).toContain("Class 10 — Science (Chemistry)");
  expect(word).toContain("Max. Marks: 1");
  expect(word).toContain(`1. ${STARTER_QUESTIONS.Chemistry}`);
  expect(word).not.toContain(STARTER_QUESTIONS.Biology);
  expect(word).not.toContain(STARTER_QUESTIONS.Physics);
  // Numbered as on the preview: one Question, so no Question 2.
  expect(word).not.toContain('class="q-text">2.');
});

test("Word export of a combined Science Paper has every division's Questions", async ({ page }) => {
  const word = await exportWord(page);
  expect(word).toContain("Class 10 — Science<");
  expect(word).toContain("Max. Marks: 8");
  for (const text of Object.values(STARTER_QUESTIONS)) expect(word).toContain(text);
  expect(word).toContain('class="q-text">3.');
});
