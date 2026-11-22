import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { TEMPLATES, addQuestion, loadTemplate, marksSummary, preview, startEmptyPaper } from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  // Record print requests instead of opening the browser's print dialog, noting
  // whether the Marking Scheme was showing on the Paper at that moment.
  await page.addInitScript(() => {
    window.__prints = [];
    window.print = () => {
      const paper = document.querySelector('[aria-label="Question Paper Preview"]');
      window.__prints.push({ markingSchemeShown: paper.innerText.includes("Answer Key:") });
    };
  });
  await page.goto("/");
});

const printRequests = (page) => page.evaluate(() => window.__prints);

test.describe("Templates", () => {
  const cases = [
    { template: TEMPLATES.starter, exam: "Half-Yearly Examination (2026–27)", marks: 8 },
    { template: TEMPLATES.unitTestII, exam: "Unit Test-II (2026–27)", marks: 6 },
    { template: TEMPLATES.unitTest, exam: "Periodic Test — II (2026–27)", marks: 12 },
    { template: TEMPLATES.board, exam: "Pre-Board Examination (2026–27)", marks: 16 },
  ];

  for (const { template, exam, marks } of cases) {
    test(`loading "${template}" replaces the Paper with that Template`, async ({ page }) => {
      await page.getByLabel("School Name").fill("Before The Template");

      await loadTemplate(page, template);

      const paper = preview(page);
      await expect(paper).not.toContainText("Before The Template");
      await expect(paper).toContainText(exam);
      await expect(paper).toContainText(`Max. Marks: ${marks}`);
    });
  }

  test("Reset Sample replaces the Paper with the starter Template", async ({ page }) => {
    await loadTemplate(page, TEMPLATES.board);
    await page.getByLabel("School Name").fill("About To Be Reset");

    await page.getByRole("button", { name: "Reset Sample" }).click();

    const paper = preview(page);
    await expect(paper).not.toContainText("About To Be Reset");
    await expect(paper).toContainText("Half-Yearly Examination (2026–27)");
    await expect(paper).toContainText("Max. Marks: 8");
  });
});

test.describe("Target Marks", () => {
  test("the marks summary says when the Paper is on target and when it is over", async ({ page }) => {
    // The starter Template has 8 marks.
    await loadTemplate(page, TEMPLATES.starter);
    await page.getByLabel("Target Total Marks").selectOption({ label: "Target: 20 Marks" });

    await addQuestion(page, { section: "Section D", marks: 12, text: "Explain the working of the human eye." });
    await expect(marksSummary(page)).toContainText("On Target (20/20)");

    await addQuestion(page, { section: "Section A", marks: 1, text: "Define power of a lens." });
    await expect(marksSummary(page)).toContainText("1 marks over target");
  });
});

test.describe("printing", () => {
  test("Print asks the browser to print the Paper without the Marking Scheme", async ({ page }) => {
    await page.getByRole("button", { name: "Print / Save as PDF" }).click();

    expect(await printRequests(page)).toEqual([{ markingSchemeShown: false }]);
  });

  test("Print Answer Key prints with the Marking Scheme, then puts the preview back", async ({ page }) => {
    const paper = preview(page);
    await expect(paper).not.toContainText("Answer Key:");

    await page.getByRole("button", { name: "Print Answer Key" }).click();
    expect(await printRequests(page)).toEqual([{ markingSchemeShown: true }]);

    // Once printing finishes, the preview returns to how it was.
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(paper).not.toContainText("Answer Key:");
  });
});

test.describe("Word export", () => {
  async function exportWord(page) {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Word (.doc)" }).click(),
    ]);
    return { name: download.suggestedFilename(), contents: await readFile(await download.path(), "utf8") };
  }

  test("Export Word downloads the Paper as a Word file named after the class and subject", async ({ page }) => {
    await startEmptyPaper(page);
    await page.getByLabel("School Name").fill("Word Export Academy");
    await page.getByLabel("Subject", { exact: true }).fill("Social Science");
    await addQuestion(page, { section: "Section C", marks: 3, text: "Describe the causes of the First World War." });

    const doc = await exportWord(page);

    expect(doc.name).toBe("class-10-social-science.doc");
    expect(doc.contents).toContain("Word Export Academy");
    expect(doc.contents).toContain("Class 10 — Social Science");
    expect(doc.contents).toContain("Max. Marks: 3");
    expect(doc.contents).toContain("1. Describe the causes of the First World War.");
    expect(doc.contents).toContain("[3 Marks]");
  });

  test("Export Word includes the Marking Scheme when it is showing", async ({ page }) => {
    await startEmptyPaper(page);
    await addQuestion(page, {
      section: "Section A",
      marks: 1,
      text: "Name the largest planet.",
      markingScheme: "Jupiter.",
    });

    expect((await exportWord(page)).contents).not.toContain("MARKING SCHEME / ANSWER KEY");

    await page.getByRole("button", { name: "Show Marking Scheme" }).click();
    const withScheme = (await exportWord(page)).contents;
    expect(withScheme).toContain("MARKING SCHEME / ANSWER KEY");
    expect(withScheme).toContain("Jupiter.");
  });
});
