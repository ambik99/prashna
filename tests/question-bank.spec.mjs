import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { addQuestion, fixture, preview, questionButton, startEmptyPaper } from "./helpers.mjs";

// The Question Bank slide-out panel.
const bankPanel = (page) => page.getByRole("complementary", { name: "Question Bank" });

async function openQuestionBank(page) {
  const toggle = page.getByRole("button", { name: "Question Bank", exact: true });
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
  await expect(bankPanel(page)).toBeVisible();
}

const searchBank = (page) => page.getByLabel("Search Question Bank");
const bankInsertButtons = (page) => bankPanel(page).getByRole("button", { name: "+ Insert", exact: true });
const bankDeleteButtons = (page) => bankPanel(page).getByRole("button", { name: "Delete", exact: true });

// Chooses a class and subject, then adds its Starter Questions.
async function addStarterQuestions(page, { className = "Class 10", subject = "Science" } = {}) {
  await page.getByLabel("Class for Starter Questions").selectOption(className);
  await page.getByLabel("Subject for Starter Questions").selectOption(subject);
  await page.getByRole("button", { name: "Add Starter Questions" }).click();
}

async function importFromLink(page, link) {
  await page.getByLabel("Web address of a question file").fill(link);
  await page.getByRole("button", { name: "Import", exact: true }).click();
}

// A Class 10 Science Starter Question.
const STARTER_SCIENCE_QUESTION = "The focal length of a plane mirror is:";

// The two example Questions every new Question Bank starts with.
const EXAMPLE_ASSERTION = "A: Silver chloride turns grey in sunlight.";

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

test("the Question Bank opens as a panel beside the editor and closes again", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Question Bank", exact: true });
  await expect(bankPanel(page)).toBeHidden();

  await toggle.click();
  await expect(bankPanel(page)).toBeVisible();
  await expect(searchBank(page)).toBeFocused();
  // The editor is still there to use.
  await expect(page.getByLabel("School Name")).toBeVisible();

  await page.getByRole("button", { name: "Close Question Bank" }).click();
  await expect(bankPanel(page)).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(bankPanel(page)).toBeHidden();
});

test("a Question on the Paper can be saved to the Question Bank and is kept after reopening", async ({ page }) => {
  await startEmptyPaper(page);
  await addQuestion(page, { section: "Section B", marks: 2, text: "Why do stars twinkle?" });

  await questionButton(page, "+ Bank", 0).click();
  await expect(page.getByText("Saved to Bank")).toBeVisible();

  await openQuestionBank(page);
  await expect(bankPanel(page).getByText("Section B • STANDARD • 2 Marks")).toBeVisible();
  await expect(bankPanel(page).getByText("Why do stars twinkle?")).toBeVisible();

  await page.reload();
  await openQuestionBank(page);
  await expect(bankPanel(page).getByText("Section B • STANDARD • 2 Marks")).toBeVisible();
  await expect(bankInsertButtons(page)).toHaveCount(3); // The two examples plus the saved Question.
});

test("searching the Question Bank shows only matching Questions", async ({ page }) => {
  await openQuestionBank(page);
  await expect(bankInsertButtons(page)).toHaveCount(2);

  await searchBank(page).fill("silver chloride");
  await expect(page.getByText(EXAMPLE_ASSERTION)).toBeVisible();
  await expect(bankInsertButtons(page)).toHaveCount(1);

  await searchBank(page).fill("photosynthesis in cacti");
  await expect(page.getByText("No saved questions match your search.")).toBeVisible();
  await expect(bankInsertButtons(page)).toHaveCount(0);
});

test("a Question from the Question Bank can be inserted into the Paper", async ({ page }) => {
  await startEmptyPaper(page);
  await openQuestionBank(page);
  await searchBank(page).fill("silver chloride");

  await bankInsertButtons(page).click();

  const paper = preview(page);
  await expect(paper).toContainText("Assertion (A): Silver chloride turns grey in sunlight.");
  await expect(paper).toContainText("[1 Mark]");
});

test("a Question deleted from the Question Bank stays deleted after reopening", async ({ page }) => {
  await openQuestionBank(page);
  await searchBank(page).fill("silver chloride");
  await bankDeleteButtons(page).click();
  await expect(page.getByText("No saved questions match your search.")).toBeVisible();

  await searchBank(page).fill("");
  await expect(bankInsertButtons(page)).toHaveCount(1);

  await page.reload();
  await openQuestionBank(page);
  await expect(bankInsertButtons(page)).toHaveCount(1);
  await expect(page.getByText(EXAMPLE_ASSERTION)).toHaveCount(0);
});

test("the old Auto-Fetch option is gone", async ({ page }) => {
  await openQuestionBank(page);
  await expect(page.getByText(/auto-fetch/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /fetch/i })).toHaveCount(0);
});

test.describe("Starter Questions", () => {
  test("adding Starter Questions puts a subject's built-in Questions in the Question Bank, labelled as built in", async ({ page }) => {
    await openQuestionBank(page);
    await addStarterQuestions(page);

    await expect(page.getByText("Added 3 Starter Questions for Class 10 Science to your Question Bank.")).toBeVisible();
    await expect(page.getByText(STARTER_SCIENCE_QUESTION)).toBeVisible();
    await expect(bankInsertButtons(page)).toHaveCount(5);
    await expect(bankPanel(page).getByText("Built in", { exact: true })).toHaveCount(3);
  });

  test("the subject list follows the chosen class", async ({ page }) => {
    await openQuestionBank(page);
    const subjects = page.getByLabel("Subject for Starter Questions");

    await page.getByLabel("Class for Starter Questions").selectOption("Class 12");
    await expect(subjects.getByRole("option", { name: "Physics", exact: true })).toHaveCount(1);
    await expect(subjects.getByRole("option", { name: "Social Science", exact: true })).toHaveCount(0);

    await page.getByLabel("Class for Starter Questions").selectOption("Class 10");
    await expect(subjects.getByRole("option", { name: "Social Science", exact: true })).toHaveCount(1);
    await expect(subjects.getByRole("option", { name: "Physics", exact: true })).toHaveCount(0);
  });
});

test.describe("Import from Link", () => {
  // A colleague's question file; the test answers requests for it from tests/fixtures.
  const LINK = "https://questions.example.test/shared-questions.json";

  test("Questions from a question file at a link are added to the Question Bank", async ({ page }) => {
    const body = await readFile(fixture("shared-questions.json"), "utf8");
    await page.route(LINK, (route) => route.fulfill({ contentType: "application/json", body }));

    await openQuestionBank(page);
    await importFromLink(page, LINK);

    await expect(page.getByText("Imported 2 Questions from the link.")).toBeVisible();
    await expect(page.getByText("Which organ produces insulin?")).toBeVisible();
    await expect(page.getByText("Why is the sky blue?")).toBeVisible();
    await expect(bankInsertButtons(page)).toHaveCount(4);
  });

  test("a link that can't be reached says so and adds nothing", async ({ page }) => {
    await page.route(LINK, (route) => route.abort());

    await openQuestionBank(page);
    await importFromLink(page, LINK);

    await expect(page.getByText("Couldn't import from that link.")).toBeVisible();
    await expect(page.getByText(STARTER_SCIENCE_QUESTION)).toHaveCount(0);
    await expect(bankInsertButtons(page)).toHaveCount(2);
  });

  test("a link without any Questions says so", async ({ page }) => {
    await page.route(LINK, (route) => route.fulfill({ contentType: "application/json", body: '{"questions": []}' }));

    await openQuestionBank(page);
    await importFromLink(page, LINK);

    await expect(page.getByText("That link didn't contain any Questions Prashna can read.")).toBeVisible();
  });

  test("importing without a link asks for one", async ({ page }) => {
    await openQuestionBank(page);
    await page.getByRole("button", { name: "Import", exact: true }).click();

    await expect(page.getByText("Paste the web address of a question file first.")).toBeVisible();
  });
});
