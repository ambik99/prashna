import { test, expect } from "@playwright/test";
import {
  TEMPLATES,
  answerConfirmation,
  chooseFile,
  confirmDialog,
  fixture,
  moreMenuButton,
  openMoreMenu,
  preview,
  questionButton,
} from "./helpers.mjs";

// The Question Bank's own Delete buttons.
async function openQuestionBank(page) {
  await page.getByRole("button", { name: "Question Bank", exact: true }).click();
}
const bankDeleteButtons = (page) =>
  page.getByRole("complementary", { name: "Question Bank" }).getByRole("button", { name: "Delete", exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
  await page.getByLabel("School Name").fill("My Own School");
});

test.describe("loading a Template", () => {
  test("asks first, and Cancel keeps the Paper", async ({ page }) => {
    await openMoreMenu(page);
    await page.getByLabel("Load CBSE Template").selectOption({ label: TEMPLATES.unitTestII });

    await expect(confirmDialog(page)).toContainText("Load this Template?");
    await expect(confirmDialog(page)).toContainText("Unit Test-II Format (20 Marks)");
    await answerConfirmation(page, "Cancel");

    await expect(preview(page)).toContainText("My Own School");
    await openMoreMenu(page);
    await expect(page.getByLabel("Load CBSE Template")).toHaveValue("");
  });

  test("replaces the Paper once confirmed", async ({ page }) => {
    await openMoreMenu(page);
    await page.getByLabel("Load CBSE Template").selectOption({ label: TEMPLATES.unitTestII });
    await answerConfirmation(page, "Replace Paper");

    await expect(preview(page)).not.toContainText("My Own School");
  });
});

test.describe("Reset", () => {
  test("asks first, and Cancel keeps the Paper", async ({ page }) => {
    await (await moreMenuButton(page, "Reset Sample")).click();
    await expect(confirmDialog(page)).toContainText("Reset to the sample Paper?");
    await answerConfirmation(page, "Cancel");

    await expect(preview(page)).toContainText("My Own School");
  });

  test("replaces the Paper once confirmed", async ({ page }) => {
    await (await moreMenuButton(page, "Reset Sample")).click();
    await answerConfirmation(page, "Reset Paper");

    await expect(preview(page)).not.toContainText("My Own School");
  });
});

test.describe("Load Paper", () => {
  test("asks first, naming the file, and Cancel keeps the Paper", async ({ page }) => {
    await chooseFile(page, await moreMenuButton(page, "Load Paper"), fixture("paper-saved-by-v10.json"));

    await expect(confirmDialog(page)).toContainText("Load this Paper?");
    await expect(confirmDialog(page)).toContainText("paper-saved-by-v10.json");
    await answerConfirmation(page, "Cancel");

    await expect(preview(page)).toContainText("My Own School");
  });

  test("replaces the Paper once confirmed", async ({ page }) => {
    await chooseFile(page, await moreMenuButton(page, "Load Paper"), fixture("paper-saved-by-v10.json"));
    await answerConfirmation(page, "Replace Paper");

    await expect(preview(page)).not.toContainText("My Own School");
    await expect(page.getByText("Loaded from file")).toBeVisible();
  });

  test("a file that isn't a Paper is rejected without asking", async ({ page }) => {
    await chooseFile(page, await moreMenuButton(page, "Load Paper"), fixture("not-a-paper.json"));

    await expect(page.getByText("Invalid paper file")).toBeVisible();
    await expect(confirmDialog(page)).toBeHidden();
  });
});

test.describe("removing a Question", () => {
  test("asks first, and Cancel keeps it", async ({ page }) => {
    const paper = preview(page);
    await expect(paper).toContainText("1. Which gas is evolved");

    await questionButton(page, "Remove", 0).click();
    await expect(confirmDialog(page)).toContainText("Remove this Question?");
    await expect(confirmDialog(page)).toContainText("Question 1 will be removed");
    await answerConfirmation(page, "Cancel");

    await expect(paper).toContainText("1. Which gas is evolved");
  });

  test("removes it once confirmed", async ({ page }) => {
    await questionButton(page, "Remove", 0).click();
    await answerConfirmation(page, "Remove Question");

    await expect(preview(page)).not.toContainText("Which gas is evolved");
  });
});

test.describe("deleting from the Question Bank", () => {
  test("asks first, and Cancel keeps it", async ({ page }) => {
    await openQuestionBank(page);
    await expect(bankDeleteButtons(page)).toHaveCount(2);

    await bankDeleteButtons(page).first().click();
    await expect(confirmDialog(page)).toContainText("Delete from Question Bank?");
    await answerConfirmation(page, "Cancel");

    await expect(bankDeleteButtons(page)).toHaveCount(2);
  });

  test("deletes it once confirmed", async ({ page }) => {
    await openQuestionBank(page);
    await bankDeleteButtons(page).first().click();
    await answerConfirmation(page, "Delete Question");

    await expect(bankDeleteButtons(page)).toHaveCount(1);
  });
});

test.describe("the confirmation itself", () => {
  test("starts on Cancel, and Escape cancels", async ({ page }) => {
    await questionButton(page, "Remove", 0).click();

    await expect(confirmDialog(page).getByRole("button", { name: "Cancel" })).toBeFocused();
    await page.keyboard.press("Escape");

    await expect(confirmDialog(page)).toBeHidden();
    await expect(preview(page)).toContainText("1. Which gas is evolved");
  });

  test("can be confirmed from the keyboard", async ({ page }) => {
    await questionButton(page, "Remove", 0).click();
    await page.keyboard.press("Tab");
    await expect(confirmDialog(page).getByRole("button", { name: "Remove Question" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(preview(page)).not.toContainText("Which gas is evolved");
  });

  test("the confirm button is the error red", async ({ page }) => {
    await questionButton(page, "Remove", 0).click();
    const confirmButton = confirmDialog(page).getByRole("button", { name: "Remove Question" });
    const red = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-danger").trim());
    const toRgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;

    await expect(confirmButton).toHaveCSS("background-color", toRgb(red));
  });
});

test("no Answer Key wording remains", async ({ page }) => {
  await openMoreMenu(page);
  await expect(page.getByRole("button", { name: "Print Marking Scheme" })).toBeVisible();
  await (await moreMenuButton(page, "Show Marking Scheme")).click();
  await expect(page.getByText(/answer key/i)).toHaveCount(0);
});

test("the OR question is called the Alternative Question in the editor", async ({ page }) => {
  await page.getByLabel('Add an Alternative Question ("OR")').check();
  await expect(page.getByLabel("Alternative Question", { exact: true })).toBeVisible();
});
