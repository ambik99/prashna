// Takes the Landing Page's screenshots from the real app, so they always show
// what teachers will get. Run after changing how the app looks:
//
//   node scripts/make-screenshots.mjs
//
// Needs the Playwright browser (npm run test:install-browsers) and ffmpeg on
// the PATH (to write WebP). Writes www/images/*.webp.

import { chromium } from "@playwright/test";
import { spawn, execFileSync } from "node:child_process";
import { mkdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 4179;
const APP = `http://localhost:${PORT}/app/`;
const OUT = fileURLToPath(new URL("../www/images/", import.meta.url));
// A made-up school, so the screenshots name no real one.
const SCHOOL = "Riverside Public School, Siliguri";

// Starts from the Board Pattern Template with a made-up school and no crest.
async function preparePaper(page, { phone = false } = {}) {
  await page.goto(APP);
  const tap = (locator) => (phone ? locator.tap() : locator.click());
  await tap(page.getByRole("button", { name: "More", exact: true }));
  await page.getByLabel("Load CBSE Template").selectOption({ label: "Board Pattern Starter (Class X)" });
  await tap(page.getByRole("dialog").getByRole("button", { name: "Replace Paper" }));
  await page.getByLabel("School Name").fill(SCHOOL);
  await page.getByLabel("Show School Crest Watermark").uncheck();
  await page.evaluate(() => document.fonts.ready);
}

// Writes a PNG screenshot as WebP at the given widths: name-<width>.webp.
function toWebp(png, name, widths) {
  for (const width of widths) {
    execFileSync("ffmpeg", [
      "-y", "-loglevel", "error", "-i", png,
      "-vf", `scale=${width}:-1:flags=lanczos`,
      "-c:v", "libwebp", "-quality", "82", "-compression_level", "6",
      join(OUT, `${name}-${width}.webp`),
    ]);
  }
}

const server = spawn(process.execPath, [fileURLToPath(new URL("./serve.mjs", import.meta.url)), String(PORT)], { stdio: "ignore" });
const work = await mkdtemp(join(tmpdir(), "prashna-shots-"));
const browser = await chromium.launch();

try {
  await new Promise((done) => setTimeout(done, 500));
  await mkdir(OUT, { recursive: true });

  // A computer: the editor beside the live Paper preview.
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    colorScheme: "light",
    serviceWorkers: "block",
  });
  await preparePaper(desktop);
  await desktop.screenshot({ path: join(work, "desktop.png") });
  toWebp(join(work, "desktop.png"), "app-desktop", [1280, 2160]);
  // Phones show the hero at a readable size: the marks blueprint and the A4
  // preview, cropped from the same capture: the whole width of the Paper,
  // from its top margin down (CSS x 525-1340, y 205-900).
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(work, "desktop.png"), "-vf", "crop=1223:1043:787:307", join(work, "desktop-crop.png")]);
  toWebp(join(work, "desktop-crop.png"), "app-desktop-crop", [720, 1080]);

  // The printed Paper: the preview sheet as it prints (without the
  // per-Question buttons, which print hides too), cropped to one A4 page.
  await desktop.addStyleTag({
    content: ".btn-icon, .btn-bank, .btn-edit, .btn-remove, .division-badge { display: none !important; }",
  });
  const sheet = desktop.getByRole("region", { name: "Question Paper Preview" });
  const box = await sheet.boundingBox();
  await desktop.setViewportSize({ width: 1440, height: Math.ceil(box.y + box.width * Math.SQRT2) + 40 });
  const sheetBox = await sheet.boundingBox();
  await desktop.screenshot({ path: join(work, "paper.png"), clip: { ...sheetBox, height: Math.round(sheetBox.width * Math.SQRT2) } });
  toWebp(join(work, "paper.png"), "paper-a4", [560, 1120]);

  // A phone: writing a Question, and the Paper preview.
  const phone = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: "light",
    serviceWorkers: "block",
  });
  await preparePaper(phone, { phone: true });
  await phone.getByLabel("Question Type").selectOption("mcq");
  await phone.getByLabel("Question Text").fill("Which of the following is a displacement reaction?");
  await phone.getByLabel("Question Type").evaluate((el) => el.closest(".step").scrollIntoView({ block: "start" }));
  await phone.evaluate(() => window.scrollBy(0, -8));
  await phone.screenshot({ path: join(work, "phone-edit.png") });
  toWebp(join(work, "phone-edit.png"), "phone-edit", [390, 780]);

  await phone.getByRole("tab", { name: "Preview" }).tap();
  await phone.evaluate(() => window.scrollTo(0, 0));
  await phone.screenshot({ path: join(work, "phone-preview.png") });
  toWebp(join(work, "phone-preview.png"), "phone-preview", [390, 780]);
} finally {
  await browser.close();
  server.kill();
  await rm(work, { recursive: true, force: true });
}
