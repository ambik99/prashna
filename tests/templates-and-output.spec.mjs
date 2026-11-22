import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { TEMPLATES, addQuestion, answerConfirmation, loadTemplate, marksSummary, moreMenuButton, preview, startEmptyPaper } from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  // Record print requests instead of opening the browser's print dialog, noting
  // whether the Marking Scheme was showing on the Paper at that moment.
  await page.addInitScript(() => {
    window.__prints = [];
    window.print = () => {
      const paper = document.querySelector('[aria-label="Question Paper Preview"]');
      window.__prints.push({ markingSchemeShown: paper.innerText.includes("Marking Scheme:") });
    };
  });
  await page.goto("/app/");
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

  test("Reset replaces the Paper with the starter Template", async ({ page }) => {
    await loadTemplate(page, TEMPLATES.board);
    await page.getByLabel("School Name").fill("About To Be Reset");

    await (await moreMenuButton(page, "Reset Sample")).click();
    await answerConfirmation(page, "Reset Paper");

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

  test("printing the Marking Scheme prints it, then puts the preview back", async ({ page }) => {
    const paper = preview(page);
    await expect(paper).not.toContainText("Marking Scheme:");

    await (await moreMenuButton(page, "Print Marking Scheme")).click();
    expect(await printRequests(page)).toEqual([{ markingSchemeShown: true }]);

    // Once printing finishes, the preview returns to how it was.
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await expect(paper).not.toContainText("Marking Scheme:");
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
    await page.getByLabel("Examination Title").fill("Annual Examination (2026–27)");
    await page.getByLabel("Subject", { exact: true }).fill("Social Science");
    await page.getByLabel("Time Allowed").fill("2 Hours");
    await page.getByLabel("General Instructions").fill("Write neatly.");
    await addQuestion(page, {
      section: "Section A",
      type: "Multiple Choice (MCQ)",
      marks: 1,
      text: "Who wrote the Indian national anthem?",
      options: ["Tagore", "Gandhi", "Nehru", "Bose"],
    });
    await addQuestion(page, {
      section: "Section A",
      type: "Assertion–Reason (CBSE Preset)",
      marks: 1,
      assertion: "The Himalayas are young fold mountains.",
      reason: "They were formed by plate collision.",
    });
    await addQuestion(page, {
      section: "Section C",
      type: "Standard (Short / Long Answer)",
      marks: 3,
      text: "Describe the causes of the First World War.",
    });

    const doc = await exportWord(page);

    expect(doc.name).toBe("class-10-social-science.doc");
    for (const detail of [
      "Word Export Academy",
      "Annual Examination (2026–27)",
      "Class 10 — Social Science",
      "Time: 2 Hours",
      "Write neatly.",
      "Max. Marks: 5",
    ]) {
      expect(doc.contents).toContain(detail);
    }
    expect(doc.contents).toContain("1. Who wrote the Indian national anthem?");
    expect(doc.contents).toContain("(a) Tagore");
    expect(doc.contents).toContain("2. Two statements are given — Assertion (A) and Reason (R).");
    expect(doc.contents).toContain("The Himalayas are young fold mountains.");
    expect(doc.contents).toContain("3. Describe the causes of the First World War.");
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

    expect((await exportWord(page)).contents).not.toContain("MARKING SCHEME");

    await (await moreMenuButton(page, "Show Marking Scheme")).click();
    const withScheme = (await exportWord(page)).contents;
    expect(withScheme).toContain("MARKING SCHEME");
    expect(withScheme).toContain("Jupiter.");
  });
});
