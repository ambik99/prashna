import { test, expect } from "@playwright/test";

const questionText = (page) => page.getByLabel("Question Text");

// The Insert button beside a phonetic typing box (the Question Bank has Insert buttons too).
const insertBeside = (typingBox) => typingBox.locator("..").getByRole("button", { name: "Insert" });

async function openQuickInsert(page, tab) {
  await page.getByText("Quick Insert: Math, Science").click();
  await page.getByRole("button", { name: tab, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Math symbol buttons insert at the cursor", async ({ page }) => {
  await questionText(page).fill("Find  of 49.");
  // Put the cursor between "Find " and " of 49."
  await questionText(page).evaluate((el) => el.setSelectionRange(5, 5));

  await openQuickInsert(page, "Math");
  await page.getByRole("button", { name: "√", exact: true }).click();

  await expect(questionText(page)).toHaveValue("Find √ of 49.");
});

test("Science formula buttons insert into the Question", async ({ page }) => {
  await questionText(page).fill("Balance: ");
  await openQuickInsert(page, "Science");
  await page.getByRole("button", { name: "H₂SO₄", exact: true }).click();

  await expect(questionText(page)).toHaveValue("Balance: H₂SO₄");
});

test("Hindi phonetic typing previews and inserts Devanagari", async ({ page }) => {
  await openQuickInsert(page, "हिन्दी");
  const english = page.getByLabel("Type English to convert to Hindi");

  await english.fill("kamal");
  await expect(page.getByText("कमल", { exact: true })).toBeVisible();

  await english.fill("namaste");
  await expect(page.getByText("नमस्ते", { exact: true })).toBeVisible();
  await insertBeside(english).click();

  await expect(questionText(page)).toHaveValue("नमस्ते");
  await expect(english).toHaveValue("");
});

test("Bengali phonetic typing previews and inserts Bengali script", async ({ page }) => {
  await openQuickInsert(page, "বাংলা");
  const english = page.getByLabel("Type English to convert to Bengali");

  // Current behaviour: the mapping is approximate ("nodi" gives নোদি, not নদী).
  await english.fill("nodi");
  await expect(page.getByText("নোদি", { exact: true })).toBeVisible();
  await insertBeside(english).click();

  await expect(questionText(page)).toHaveValue("নোদি");
});

test("Hindi letter buttons insert their letter", async ({ page }) => {
  await openQuickInsert(page, "हिन्दी");
  await page.getByRole("button", { name: "क", exact: true }).click();

  await expect(questionText(page)).toHaveValue("क");
});
