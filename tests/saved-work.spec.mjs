import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fixture, preview } from "./helpers.mjs";

// The current Paper and the Question Bank as version 10 of the tool kept them
// in the browser's storage, before the app moved to React. A teacher who
// opens the new version must find their work where they left it.
const PAPER_KEY = "cbse_paper_designer_v16";
const BANK_KEY = "cbse_question_bank_v1";

const oldBank = {
  bank: [
    {
      bankId: 205,
      section: "Section C",
      division: "",
      type: "standard",
      text: "Explain the working of an electric motor with a labelled diagram.",
      options: [],
      subQuestions: [],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "",
      answer: "Principle (1M) + working (1M) + diagram (1M).",
      marks: 3,
    },
    {
      bankId: 204,
      section: "Section A",
      type: "mcq",
      text: "The SI unit of electric flux is:",
      options: ["N m^2 C^-1", "N m C^-1", "V m^-1", "C m^-2"],
      subQuestions: [],
      assertion: "",
      reason: "",
      imageData: "",
      orText: "",
      answer: "(a) N m^2 C^-1",
      marks: 1,
      source: "starter",
    },
  ],
  nextBankId: 206,
};

test("a Paper and Question Bank stored by the old app open in the new one", async ({ page }) => {
  const oldPaper = await readFile(fixture("paper-saved-by-v10.json"), "utf8");
  await page.addInitScript(
    ({ paperKey, bankKey, paper, bank }) => {
      // Only before the first load: later loads must show what the app saved.
      if (sessionStorage.getItem("seeded")) return;
      sessionStorage.setItem("seeded", "yes");
      localStorage.setItem(paperKey, paper);
      localStorage.setItem(bankKey, bank);
    },
    { paperKey: PAPER_KEY, bankKey: BANK_KEY, paper: oldPaper, bank: JSON.stringify(oldBank) },
  );
  await page.goto("/app/");

  const paper = preview(page);
  await expect(paper).toContainText("Fixture High School, Jalpaiguri");
  await expect(paper).toContainText("Pre-Board Examination (2026–27)");
  await expect(paper).toContainText("Which of the following is an amphoteric oxide?");
  await expect(paper).toContainText("Max. Marks: 16");

  await page.getByRole("button", { name: "Question Bank", exact: true }).click();
  const bank = page.getByRole("complementary", { name: "Question Bank" });
  await expect(bank).toContainText("Explain the working of an electric motor");
  await expect(bank).toContainText("The SI unit of electric flux is:");
  await expect(bank.getByText("Built in")).toHaveCount(1);

  // A Question inserted from the old Bank lands on the Paper, and the new
  // Paper is what opens next time.
  // The motor Question is first in the old Bank.
  await bank.getByRole("button", { name: "+ Insert" }).first().click();
  await expect(paper).toContainText("Explain the working of an electric motor");
  await page.reload();
  await expect(preview(page)).toContainText("Explain the working of an electric motor");
  await expect(preview(page)).toContainText("Max. Marks: 19");
});
