// AI Generated Paper (issue #49). The Worker's endpoint (/api/generate) and
// the Turnstile bot check are replaced by stand-ins, so these tests never
// reach the AI. The Worker itself is tested in worker/src/generate.test.ts.
import { test, expect } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { answerConfirmation, confirmDialog, exportWord, marksSummary, moreMenuButton, preview } from "./helpers.mjs";

// A Class 10 Science Paper as the Worker sends it: 39 Questions, 80 marks,
// each with its Science Division. `lastMarks` changes the final Question's
// marks to make the total come out wrong.
function class10SciencePaper({ lastMarks = 4 } = {}) {
  const divisions = ["Physics", "Chemistry", "Biology"];
  const questions = [];
  const add = (section, type, marks, n) => {
    for (let i = 0; i < n; i++) {
      const id = questions.length + 1;
      questions.push({
        id,
        section,
        division: divisions[(id - 1) % 3],
        type,
        text: type === "ar" ? "" : `Generated question ${id} about light and electricity.`,
        options: type === "mcq" ? ["Option one", "Option two", "Option three", "Option four"] : [],
        subQuestions: type === "case" ? ["(i) First part (1)", "(ii) Second part (1)", "(iii) Third part (2)"] : [],
        assertion: type === "ar" ? `Assertion number ${id}.` : "",
        reason: type === "ar" ? `Reason number ${id}.` : "",
        imageData: "",
        orText: "",
        answer: `Marking scheme answer ${id}.`,
        marks,
      });
    }
  };
  add("Section A", "mcq", 1, 16);
  add("Section A", "ar", 1, 4);
  add("Section B", "standard", 2, 6);
  add("Section C", "standard", 3, 7);
  add("Section D", "standard", 5, 3);
  add("Section E", "case", 4, 2);
  add("Section E", "case", lastMarks, 1);
  const actual = 76 + lastMarks;
  return {
    ok: true,
    marks: { expected: 80, actual },
    paper: {
      version: 1,
      meta: {
        school: "",
        exam: "Sample Question Paper (2026–27)",
        classLevel: "Class 10",
        subject: "Science",
        time: "3 Hours",
        showWatermark: true,
        targetMarks: 80,
        instructions: "This question paper contains 39 questions. All questions are compulsory.",
        sectionNotes: { "Section A": "MCQs", "Section B": "VSA", "Section C": "SA", "Section D": "LA", "Section E": "Case-Study" },
        sectionMarks: { "Section A": 1, "Section B": 2, "Section C": 3, "Section D": 5, "Section E": lastMarks === 4 ? 4 : 0 },
        sectionCounts: { "Section A": 20, "Section B": 6, "Section C": 7, "Section D": 3, "Section E": 3 },
        divisionMode: "Combined",
        divisionMarks: { Physics: 25, Chemistry: 25, Biology: 30 },
      },
      questions,
      nextId: 40,
    },
  };
}

// The Turnstile script, replaced by one that passes at once.
const TURNSTILE_STAND_IN = `
  window.turnstile = {
    render(container, options) { window.__turnstile = options; return "widget-1"; },
    reset() {},
    execute() { setTimeout(() => window.__turnstile.callback("token-from-turnstile"), 0); },
    remove() {},
  };
`;

// Answers /api/generate with `reply` ({ status, body } or "abort"), and records what the app sent.
async function standInWorker(page, reply) {
  const sent = [];
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({ contentType: "text/javascript", body: TURNSTILE_STAND_IN }),
  );
  await page.route("**/api/generate", async (route) => {
    sent.push(route.request().postDataJSON());
    const next = typeof reply === "function" ? await reply() : reply;
    if (next === "abort") return route.abort("failed");
    await route.fulfill({ status: next.status ?? 200, contentType: "application/json", body: JSON.stringify(next.body) });
  });
  return sent;
}

const generateDialog = (page) => page.getByRole("dialog", { name: "Generate a Paper" });

async function openGenerate(page) {
  await (await moreMenuButton(page, "Generate a Paper (AI)")).click();
  await expect(generateDialog(page)).toBeVisible();
}

async function generate(page, { classLevel = "Class 10", subject = "Science", focus = "" } = {}) {
  await openGenerate(page);
  const dialog = generateDialog(page);
  await dialog.getByLabel("Class").selectOption(classLevel);
  await dialog.getByLabel("Subject").selectOption(subject);
  if (focus) await dialog.getByLabel("Focus (optional)").fill(focus);
  await dialog.getByRole("button", { name: "Generate Paper" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/app/");
});

test.describe("AI Generated Paper", () => {
  test("a teacher generates a Class 10 Science Paper and loads it in place of the current one", async ({ page }) => {
    const sent = await standInWorker(page, { body: class10SciencePaper() });
    await page.getByLabel("School Name").fill("Kendriya Vidyalaya, Siliguri");

    await generate(page, { focus: "Light, Electricity" });

    const dialog = generateDialog(page);
    await expect(dialog).toContainText("Your Paper is ready: Class 10 Science, 39 Questions, 80 marks.");
    await dialog.getByRole("button", { name: "Load Paper" }).click();
    await expect(confirmDialog(page).filter({ hasText: "Load this AI Generated Paper?" })).toBeVisible();
    await answerConfirmation(page, "Replace Paper");
    await expect(generateDialog(page)).toBeHidden();

    const paper = preview(page);
    await expect(paper).toContainText("Sample Question Paper (2026–27)");
    await expect(paper).toContainText("Generated question 1 about light and electricity.");
    await expect(paper).toContainText("Assertion number 17.");
    await expect(paper).toContainText("Max. Marks: 80");
    // The school is the teacher's own, not the AI's.
    await expect(paper).toContainText("Kendriya Vidyalaya, Siliguri");
    await expect(marksSummary(page)).toContainText("On Target (80/80)");
    // Every Question carries its Science Division.
    await expect(marksSummary(page)).toContainText("Physics: 26/25M");
    await expect(marksSummary(page)).toContainText("Chemistry: 26/25M");
    await expect(marksSummary(page)).toContainText("Biology: 28/30M");

    // Only the request leaves the device: no Paper, no school name.
    expect(sent).toEqual([
      {
        classLevel: "Class 10",
        subject: "Science",
        focus: "Light, Electricity",
        difficulty: "standard",
        turnstileToken: "token-from-turnstile",
      },
    ]);
    // The bot check is Prashna's own Turnstile widget, for the action the Worker expects.
    const widget = await page.evaluate(() => ({ sitekey: window.__turnstile.sitekey, action: window.__turnstile.action }));
    expect(widget).toEqual({ sitekey: "0x4AAAAAAGVVQ-gxvuP2XiZ4", action: "generate" });

    // The generated Paper exports like any other, with its Marking Scheme on request.
    const word = await exportWord(page);
    expect(word.contents).toContain("Generated question 39 about light and electricity.");
  });

  test("the generated Paper's Marking Scheme can be shown", async ({ page }) => {
    await standInWorker(page, { body: class10SciencePaper() });
    await generate(page);
    await generateDialog(page).getByRole("button", { name: "Load Paper" }).click();
    await answerConfirmation(page, "Replace Paper");

    await (await moreMenuButton(page, "Show Marking Scheme")).click();
    await expect(preview(page)).toContainText("Marking scheme answer 1.");
  });

  test("shows progress while the Paper is being written", async ({ page }) => {
    let finish;
    const answered = new Promise((done) => (finish = done));
    await standInWorker(page, async () => {
      await answered;
      return { body: class10SciencePaper() };
    });

    await generate(page);
    const dialog = generateDialog(page);
    await expect(dialog.getByRole("status")).toContainText("Writing your Paper");
    await expect(dialog.getByRole("button", { name: "Generating…" })).toBeDisabled();

    finish();
    await expect(dialog).toContainText("Your Paper is ready");
  });

  test("keeps the current Paper when the teacher cancels loading, and keeps the generated one to load later", async ({ page }) => {
    await standInWorker(page, { body: class10SciencePaper() });
    await page.getByLabel("School Name").fill("Still My Paper");
    const before = await preview(page).innerText();

    await generate(page);
    await generateDialog(page).getByRole("button", { name: "Load Paper" }).click();
    // The Generate dialog stays open behind the confirmation, so find the confirmation by its title.
    const confirmation = page.getByRole("dialog", { name: "Load this AI Generated Paper?" });
    await confirmation.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(confirmation).toBeHidden();

    await expect(generateDialog(page)).toContainText("Your Paper is ready");
    expect(await preview(page).innerText()).toBe(before);
  });

  test("when the marks don't add up, the Paper still loads and Target Marks shows the gap", async ({ page }) => {
    await standInWorker(page, { body: class10SciencePaper({ lastMarks: 2 }) });

    await generate(page);
    const dialog = generateDialog(page);
    await expect(dialog).toContainText("Its marks add up to 78, not 80.");
    await dialog.getByRole("button", { name: "Load Paper" }).click();
    await answerConfirmation(page, "Replace Paper");

    await expect(marksSummary(page)).toContainText("Total: 78 Marks");
    await expect(marksSummary(page)).toContainText("2 marks remaining");
  });

  const failures = [
    { name: "the hourly limit", reply: { status: 429, body: { ok: false, error: "rate-limit", message: "" } }, shows: "You can generate 3 Papers an hour. Please try again later." },
    { name: "the daily limit", reply: { status: 429, body: { ok: false, error: "daily-limit", message: "" } }, shows: "Prashna has generated all the Papers it can today. Please try again tomorrow." },
    { name: "a failed bot check", reply: { status: 403, body: { ok: false, error: "bot-check", message: "" } }, shows: "The bot check did not pass. Please try again." },
    { name: "a failed generation", reply: { status: 502, body: { ok: false, error: "failed", message: "" } }, shows: "The Paper could not be generated. Please try again." },
    { name: "a lost connection", reply: "abort", shows: "The Paper could not be generated. Please try again." },
  ];

  for (const { name, reply, shows } of failures) {
    test(`says so clearly after ${name}, and leaves the current Paper alone`, async ({ page }) => {
      await standInWorker(page, reply);
      const before = await preview(page).innerText();

      await generate(page);

      const dialog = generateDialog(page);
      await expect(dialog.getByRole("alert")).toHaveText(shows);
      // The teacher can try again.
      await expect(dialog.getByRole("button", { name: "Generate Paper" })).toBeEnabled();
      expect(await preview(page).innerText()).toBe(before);
    });
  }

  test("is unavailable offline, with a short explanation", async ({ page, context }) => {
    await standInWorker(page, { body: class10SciencePaper() });
    await openGenerate(page);
    await context.setOffline(true);

    const dialog = generateDialog(page);
    await expect(dialog.getByRole("status")).toContainText("You're offline. Generating a Paper needs the internet.");
    await expect(dialog.getByRole("button", { name: "Generate Paper" })).toBeDisabled();

    await context.setOffline(false);
    await expect(dialog.getByRole("button", { name: "Generate Paper" })).toBeEnabled();
  });

  test("lists the Subjects that have a CBSE Blueprint and shows the Blueprint", async ({ page }) => {
    await openGenerate(page);
    const dialog = generateDialog(page);
    await dialog.getByLabel("Class").selectOption("Class 12");
    await dialog.getByLabel("Subject").selectOption("Physics");
    await expect(dialog.getByLabel("CBSE Blueprint")).toContainText("70 Marks · 3 Hours");

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
  });
});

test("the Gemini key and endpoint never appear in the built site", async () => {
  const root = fileURLToPath(new URL("../dist", import.meta.url));
  const files = (await readdir(root, { recursive: true, withFileTypes: true })).filter((entry) => entry.isFile());
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const text = await readFile(join(file.parentPath, file.name), "latin1");
    expect(text, file.name).not.toContain("generativelanguage.googleapis.com");
    expect(text, file.name).not.toContain("GEMINI_API_KEY");
    expect(text, file.name).not.toMatch(/AIza[0-9A-Za-z_-]{35}/);
  }
});
