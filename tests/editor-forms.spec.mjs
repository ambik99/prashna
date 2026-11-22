import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

// Every visible field in the editor has a visible label a screen reader can use.
async function unlabelledFields(page) {
  return page.locator(".editor-panel").evaluate((panel) => {
    const visible = (el) => el.offsetParent !== null;
    return [...panel.querySelectorAll("input:not([type=file]), select, textarea")]
      .filter(visible)
      .filter((el) => {
        const byLabel = [...el.labels].some((l) => visible(l) && l.textContent.trim());
        const byIds = (el.getAttribute("aria-labelledby") || "")
          .split(" ")
          .filter(Boolean)
          .some((id) => {
            const l = document.getElementById(id);
            return l && visible(l) && l.textContent.trim();
          });
        return !byLabel && !byIds;
      })
      .map((el) => el.id || el.outerHTML.slice(0, 60));
  });
}

test("every editor field has a visible label", async ({ page }) => {
  // Show the Science Division fields and open the typing tools too.
  await page.getByLabel("Class", { exact: true }).selectOption("Class 10");
  await page.getByText("Quick Insert: Math, Science").click();
  for (const type of ["Standard (Short / Long Answer)", "Multiple Choice (MCQ)", "Assertion–Reason (CBSE Preset)", "Case-Study (Passage + Sub-questions)"]) {
    await page.getByLabel("Question Type").selectOption({ label: type });
    await page.getByLabel('Add an Alternative Question ("OR")').check();
    expect(await unlabelledFields(page), type).toEqual([]);
  }
});

test("the Add Question form shows only the fields for the chosen type", async ({ page }) => {
  const type = page.getByLabel("Question Type");
  const field = (name) => page.getByLabel(name, { exact: true });

  await type.selectOption({ label: "Standard (Short / Long Answer)" });
  await expect(field("Question Text")).toBeVisible();
  await expect(field("Option (a)")).toBeHidden();
  await expect(field("Assertion (A)")).toBeHidden();
  await expect(field("Sub-questions (one per line)")).toBeHidden();

  await type.selectOption({ label: "Multiple Choice (MCQ)" });
  await expect(field("Option (a)")).toBeVisible();
  await expect(field("Option (d)")).toBeVisible();

  await type.selectOption({ label: "Assertion–Reason (CBSE Preset)" });
  await expect(field("Assertion (A)")).toBeVisible();
  await expect(field("Reason (R)")).toBeVisible();
  await expect(field("Question Text")).toBeHidden();
  await expect(field("Option (a)")).toBeHidden();

  await type.selectOption({ label: "Case-Study (Passage + Sub-questions)" });
  await expect(field("Case-Study Passage")).toBeVisible();
  await expect(field("Sub-questions (one per line)")).toBeVisible();
  await expect(field("Assertion (A)")).toBeHidden();
});

test("the typing tools show which tool is chosen", async ({ page }) => {
  await page.getByText("Quick Insert: Math, Science").click();
  const math = page.getByRole("button", { name: "Math", exact: true });
  const hindi = page.getByRole("button", { name: "हिन्दी", exact: true });

  await expect(math).toHaveAttribute("aria-pressed", "true");
  await hindi.click();
  await expect(hindi).toHaveAttribute("aria-pressed", "true");
  await expect(math).toHaveAttribute("aria-pressed", "false");
});

test("Science Division is its own group, shown only for Class 9 and 10 Science", async ({ page }) => {
  const group = page.getByRole("group", { name: "Science Division" });
  await expect(group).toBeVisible();
  await page.getByLabel("Subject", { exact: true }).fill("History");
  await expect(group).toBeHidden();
});
