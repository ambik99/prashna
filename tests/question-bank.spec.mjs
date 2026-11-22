import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { addQuestion, fixture, preview, questionButton, startEmptyPaper } from "./helpers.mjs";

const searchBank = (page) => page.getByLabel("Search Question Bank");
const bankInsertButtons = (page) => page.getByRole("button", { name: "+ Insert", exact: true });
const bankDeleteButtons = (page) => page.getByRole("button", { name: "Delete", exact: true });

// Chooses a class and subject, then adds its Starter Questions (or a link's Questions, if one is filled in).
async function fetchIntoBank(page, { className = "Class 10", subject = "Science" } = {}) {
  await page.getByLabel("Fetch Class").selectOption(className);
  await page.getByLabel("Fetch Subject").selectOption(subject);
  await page.getByRole("button", { name: "Fetch Questions into Bank" }).click();
}

// A Class 10 Science Starter Question.
const STARTER_SCIENCE_QUESTION = "The focal length of a plane mirror is:";

// The two example Questions every new Question Bank starts with.
const EXAMPLE_ASSERTION = "A: Silver chloride turns grey in sunlight.";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("a Question on the Paper can be saved to the Question Bank and is kept after reopening", async ({ page }) => {
  await startEmptyPaper(page);
  await addQuestion(page, { section: "Section B", marks: 2, text: "Why do stars twinkle?" });

  await questionButton(page, "+ Bank", 0).click();

  await expect(page.getByText("Saved to Bank")).toBeVisible();
  await expect(page.getByText("Section B • STANDARD • 2 Marks")).toBeVisible();
  await expect(page.getByText("Why do stars twinkle?")).toHaveCount(2); // On the Paper and in the Bank.

  await page.reload();
  await expect(page.getByText("Section B • STANDARD • 2 Marks")).toBeVisible();
  await expect(bankInsertButtons(page)).toHaveCount(3); // The two examples plus the saved Question.
});

test("searching the Question Bank shows only matching Questions", async ({ page }) => {
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
  await searchBank(page).fill("silver chloride");

  await bankInsertButtons(page).click();

  const paper = preview(page);
  await expect(paper).toContainText("Assertion (A): Silver chloride turns grey in sunlight.");
  await expect(paper).toContainText("[1 Mark]");
});

test("a Question deleted from the Question Bank stays deleted after reopening", async ({ page }) => {
  await searchBank(page).fill("silver chloride");
  await bankDeleteButtons(page).click();
  await expect(page.getByText("No saved questions match your search.")).toBeVisible();

  await searchBank(page).fill("");
  await expect(bankInsertButtons(page)).toHaveCount(1);

  await page.reload();
  await expect(bankInsertButtons(page)).toHaveCount(1);
  await expect(page.getByText(EXAMPLE_ASSERTION)).toHaveCount(0);
});

test.describe("Starter Questions", () => {
  test("adding Starter Questions puts a subject's built-in Questions in the Question Bank", async ({ page }) => {
    await fetchIntoBank(page);

    await expect(page.getByText("Loaded 3 curated CBSE Class 10 Science questions into your bank.")).toBeVisible();
    await expect(page.getByText(STARTER_SCIENCE_QUESTION)).toBeVisible();
    await expect(bankInsertButtons(page)).toHaveCount(5);
  });

  test("the subject list follows the chosen class", async ({ page }) => {
    const subjects = page.getByLabel("Fetch Subject");

    await page.getByLabel("Fetch Class").selectOption("Class 12");
    await expect(subjects.getByRole("option", { name: "Physics", exact: true })).toHaveCount(1);
    await expect(subjects.getByRole("option", { name: "Social Science", exact: true })).toHaveCount(0);

    await page.getByLabel("Fetch Class").selectOption("Class 10");
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

    await page.getByLabel("Optional Question Bank JSON URL").fill(LINK);
    await fetchIntoBank(page);

    await expect(page.getByText("Fetched 2 question(s) from URL!")).toBeVisible();
    await expect(page.getByText("Which organ produces insulin?")).toBeVisible();
    await expect(page.getByText("Why is the sky blue?")).toBeVisible();
  });

  test("a link that can't be reached shows a warning and adds Starter Questions instead", async ({ page }) => {
    await page.route(LINK, (route) => route.abort());

    await page.getByLabel("Optional Question Bank JSON URL").fill(LINK);
    await fetchIntoBank(page);

    await expect(
      page.getByText("URL unreachable or blocked by browser CORS; loaded built-in Class 10 Science bank instead."),
    ).toBeVisible();
    await expect(page.getByText(STARTER_SCIENCE_QUESTION)).toBeVisible();
  });
});
