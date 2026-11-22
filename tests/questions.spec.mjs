import { test, expect } from "@playwright/test";
import {
  addQuestion,
  answerConfirmation,
  chooseFile,
  fixture,
  marksSummary,
  moreMenuButton,
  preview,
  questionButton,
  startEmptyPaper,
} from "./helpers.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
  await startEmptyPaper(page);
});

test.describe("question types", () => {
  test("a Standard Question appears numbered with its marks", async ({ page }) => {
    await addQuestion(page, {
      section: "Section B",
      type: "Standard (Short / Long Answer)",
      marks: 2,
      text: "State Ohm's law.",
    });

    const paper = preview(page);
    await expect(paper).toContainText("1. State Ohm's law.");
    await expect(paper).toContainText("[2 Marks]");
    await expect(marksSummary(page)).toContainText("Total: 2 Marks");
  });

  test("an MCQ appears with options (a) to (d)", async ({ page }) => {
    await addQuestion(page, {
      section: "Section A",
      type: "Multiple Choice (MCQ)",
      marks: 1,
      text: "Which gas do plants take in for photosynthesis?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
    });

    const paper = preview(page);
    await expect(paper).toContainText("1. Which gas do plants take in for photosynthesis?");
    await expect(paper).toContainText("(a) Oxygen");
    await expect(paper).toContainText("(b) Carbon dioxide");
    await expect(paper).toContainText("(c) Nitrogen");
    await expect(paper).toContainText("(d) Hydrogen");
    await expect(paper).toContainText("[1 Mark]");
  });

  test("an Assertion–Reason Question gets the standard CBSE options", async ({ page }) => {
    await addQuestion(page, {
      section: "Section A",
      type: "Assertion–Reason (CBSE Preset)",
      marks: 1,
      assertion: "Iron rusts in moist air.",
      reason: "Rusting needs both oxygen and water.",
    });

    const paper = preview(page);
    await expect(paper).toContainText("1. Two statements are given — Assertion (A) and Reason (R).");
    await expect(paper).toContainText("Assertion (A): Iron rusts in moist air.");
    await expect(paper).toContainText("Reason (R): Rusting needs both oxygen and water.");
    await expect(paper).toContainText(
      "(a) Both Assertion (A) and Reason (R) are true, and R is the correct explanation of A.",
    );
    await expect(paper).toContainText("(d) Assertion (A) is false, but Reason (R) is true.");
  });

  test("a Case-Study Question shows its passage and sub-questions", async ({ page }) => {
    await addQuestion(page, {
      section: "Section E",
      type: "Case-Study (Passage + Sub-questions)",
      marks: 4,
      passage: "A student heats copper powder in a china dish.",
      subQuestions: ["(i) Name the product formed.", "(ii) Write the balanced equation."],
    });

    const paper = preview(page);
    await expect(paper).toContainText("1. A student heats copper powder in a china dish.");
    await expect(paper).toContainText("(i) Name the product formed.");
    await expect(paper).toContainText("(ii) Write the balanced equation.");
    await expect(paper).toContainText("[4 Marks]");
  });

  test("Questions are numbered continuously across Sections", async ({ page }) => {
    await addQuestion(page, { section: "Section C", marks: 3, text: "Explain refraction." });
    await addQuestion(page, { section: "Section A", marks: 1, text: "Define a cell." });

    // Section A's Question comes first on the Paper, so it is number 1.
    const paper = preview(page);
    await expect(paper).toContainText("1. Define a cell.");
    await expect(paper).toContainText("2. Explain refraction.");
  });
});

test("the form shows only the fields for the chosen question type", async ({ page }) => {
  const type = page.getByLabel("Question Type");

  await type.selectOption({ label: "Assertion–Reason (CBSE Preset)" });
  await expect(page.getByLabel("Assertion (A)")).toBeVisible();
  await expect(page.getByLabel("Question Text")).toBeHidden();
  await expect(page.getByPlaceholder("(a) Option A")).toBeHidden();

  await type.selectOption({ label: "Multiple Choice (MCQ)" });
  await expect(page.getByPlaceholder("(a) Option A")).toBeVisible();
  await expect(page.getByLabel("Question Text")).toBeVisible();
  await expect(page.getByLabel("Assertion (A)")).toBeHidden();

  await type.selectOption({ label: "Case-Study (Passage + Sub-questions)" });
  await expect(page.getByLabel("Case-Study Passage")).toBeVisible();
  await expect(page.getByLabel("Sub-questions (one per line)")).toBeVisible();
  await expect(page.getByPlaceholder("(a) Option A")).toBeHidden();
});

test("a Question with missing details is not added", async ({ page }) => {
  await addQuestion(page, { type: "Multiple Choice (MCQ)", text: "Pick one." });

  await expect(page.getByText("Please enter a question, valid marks (1–20), and all required fields.")).toBeVisible();
  await expect(preview(page)).toContainText("No questions added yet.");
});

test("an Alternative Question is printed after OR", async ({ page }) => {
  await addQuestion(page, {
    section: "Section D",
    marks: 5,
    text: "Describe the human heart.",
    alternative: "Describe the human eye.",
  });

  const paper = preview(page);
  await expect(paper).toContainText("Describe the human heart.");
  await expect(paper).toContainText(/OR\s*Describe the human eye\./);
});

test.describe("diagrams", () => {
  const attachImage = (page) =>
    chooseFile(page, page.getByRole("button", { name: "Attach Image" }), fixture("diagram.png"));

  test("an attached diagram is previewed in the form and shown on the Paper", async ({ page }) => {
    await attachImage(page);
    await expect(page.getByRole("img", { name: "Attached diagram preview" })).toBeVisible();

    await addQuestion(page, { section: "Section C", marks: 3, text: "Label the parts of the flower." });

    await expect(preview(page).getByRole("img", { name: "Question diagram" })).toHaveCount(1);
  });

  test("a removed diagram is not added with the Question", async ({ page }) => {
    await attachImage(page);
    await page.getByRole("button", { name: "Remove Image" }).click();
    await expect(page.getByRole("img", { name: "Attached diagram preview" })).toBeHidden();

    await addQuestion(page, { section: "Section C", marks: 3, text: "Label the parts of the flower." });

    await expect(preview(page)).toContainText("Label the parts of the flower.");
    await expect(preview(page).getByRole("img", { name: "Question diagram" })).toHaveCount(0);
  });
});

test.describe("changing Questions", () => {
  test.beforeEach(async ({ page }) => {
    await addQuestion(page, { section: "Section A", marks: 1, text: "Define a cell." });
    await addQuestion(page, { section: "Section A", marks: 1, text: "Define a tissue." });
  });

  test("editing a Question fills the form and saves the change", async ({ page }) => {
    await questionButton(page, "Edit", 1).click();

    await expect(page.getByRole("heading", { name: "3. Edit Question" })).toBeVisible();
    await expect(page.getByLabel("Question Text")).toHaveValue("Define a tissue.");

    await page.getByLabel("Question Text").fill("Define an organ.");
    await page.getByRole("button", { name: "Save Changes" }).click();

    const paper = preview(page);
    await expect(paper).toContainText("2. Define an organ.");
    await expect(paper).not.toContainText("Define a tissue.");
    await expect(marksSummary(page)).toContainText("Section A: 2/20Q");
    await expect(page.getByRole("heading", { name: "3. Add a Question" })).toBeVisible();
  });

  test("cancelling an edit leaves the Question unchanged", async ({ page }) => {
    await questionButton(page, "Edit", 0).click();
    await page.getByLabel("Question Text").fill("Something else entirely.");
    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(preview(page)).toContainText("1. Define a cell.");
    await expect(preview(page)).not.toContainText("Something else entirely.");
    await expect(page.getByRole("heading", { name: "3. Add a Question" })).toBeVisible();
  });

  test("a Question can be moved down and back up within its Section", async ({ page }) => {
    const paper = preview(page);

    await questionButton(page, "↓", 0).click();
    await expect(paper).toContainText("1. Define a tissue.");
    await expect(paper).toContainText("2. Define a cell.");

    await questionButton(page, "↑", 1).click();
    await expect(paper).toContainText("1. Define a cell.");
    await expect(paper).toContainText("2. Define a tissue.");
  });

  test("the first and last Questions in a Section can't move past its edges", async ({ page }) => {
    await expect(questionButton(page, "↑", 0)).toBeDisabled();
    await expect(questionButton(page, "↓", 1)).toBeDisabled();
    await expect(questionButton(page, "↓", 0)).toBeEnabled();
    await expect(questionButton(page, "↑", 1)).toBeEnabled();
  });

  test("removing a Question takes it off the Paper and out of the totals", async ({ page }) => {
    await questionButton(page, "Remove", 0).click();
    await answerConfirmation(page, "Remove Question");

    const paper = preview(page);
    await expect(paper).not.toContainText("Define a cell.");
    await expect(paper).toContainText("1. Define a tissue.");
    await expect(marksSummary(page)).toContainText("Total: 1 Marks");
  });
});

test("the Marking Scheme can be shown and hidden in the preview", async ({ page }) => {
  await addQuestion(page, {
    section: "Section A",
    marks: 1,
    text: "Name the powerhouse of the cell.",
    markingScheme: "Mitochondria (1 mark).",
  });
  await addQuestion(page, { section: "Section A", marks: 1, text: "Name the control centre of the cell." });

  const paper = preview(page);
  await expect(paper).not.toContainText("Mitochondria (1 mark).");

  await (await moreMenuButton(page, "Show Marking Scheme")).click();
  await expect(paper.getByText("Marking Scheme", { exact: true })).toBeVisible();
  await expect(paper).toContainText("Mitochondria (1 mark).");
  // A Question without Marking Scheme text says so.
  await expect(paper).toContainText("No Marking Scheme added yet.");

  await (await moreMenuButton(page, "Hide Marking Scheme")).click();
  await expect(paper).not.toContainText("Mitochondria (1 mark).");
  await expect(await moreMenuButton(page, "Show Marking Scheme")).toBeVisible();
});

test("a Question's buttons work straight after typing in Paper Details", async ({ page }) => {
  await addQuestion(page, { section: "Section A", marks: 1, text: "Define a cell." });
  await page.getByLabel("School Name").fill("Typed Just Now School");

  // The first click after typing must not be lost.
  await questionButton(page, "Edit", 0).click();
  await expect(page.getByRole("heading", { name: "3. Edit Question" })).toBeVisible();
});
