// Draws the Prashna icon (Devanagari प्र in white on an ink-navy rounded
// square) with the app's own Noto Sans Devanagari font and saves it as PNG
// files in every size the app needs. Run it again after changing the design:
//
//   node scripts/make-icons.mjs
//
// Kinds of icon:
// - "any": the rounded square on a transparent background (Android launcher,
//   desktop install, browser tabs).
// - "maskable": navy to the edges with the letter inside the central safe
//   zone, so Android can crop it to any shape.
// - "apple": navy to the edges; iOS rounds the corners itself.

import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const APP = fileURLToPath(new URL("../www/app/", import.meta.url));
const INK_NAVY = "#1e2a4a";

const ICONS = [
  { file: "icon-16.png", size: 16, kind: "any" },
  { file: "icon-32.png", size: 32, kind: "any" },
  { file: "icon-192.png", size: 192, kind: "any" },
  { file: "icon-512.png", size: 512, kind: "any" },
  { file: "icon-maskable-192.png", size: 192, kind: "maskable" },
  { file: "icon-maskable-512.png", size: 512, kind: "maskable" },
  { file: "apple-touch-icon.png", size: 180, kind: "apple" },
];

// Height of the letter's ink and the corner radius, as fractions of the
// icon's size. The maskable letter fits inside Android's central safe circle.
const KINDS = {
  any: { letter: 0.5, radius: 0.22 },
  maskable: { letter: 0.42, radius: 0 },
  apple: { letter: 0.5, radius: 0 },
};

// Draws one icon on a canvas, centring the letter on its ink (Devanagari's
// line box is much taller than the letters) and returns it as a PNG data URL.
function drawIcon({ size, kind, navy, letter, radius }) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = navy;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius * size);
  ctx.fill();

  // Measure at a reference size, then scale so the ink is the wanted height.
  const text = "प्र";
  ctx.font = '600 100px "Icon Devanagari"';
  let m = ctx.measureText(text);
  const fontSize = (100 * letter * size) / (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
  ctx.font = `600 ${fontSize}px "Icon Devanagari"`;
  m = ctx.measureText(text);
  const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const x = (size - inkWidth) / 2 + m.actualBoundingBoxLeft;
  const y = (size - inkHeight) / 2 + m.actualBoundingBoxAscent;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, x, y);
  return canvas.toDataURL("image/png");
}

const font = await readFile(`${APP}fonts/noto-sans-devanagari.woff2`);
const fontUrl = `data:font/woff2;base64,${font.toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!DOCTYPE html><html><body></body></html>");
await page.evaluate(async (url) => {
  const face = new FontFace("Icon Devanagari", `url(${url})`, { weight: "100 900" });
  document.fonts.add(await face.load());
}, fontUrl);
for (const { file, size, kind } of ICONS) {
  const png = await page.evaluate(drawIcon, { size, kind, navy: INK_NAVY, ...KINDS[kind] });
  await writeFile(`${APP}${file}`, Buffer.from(png.split(",")[1], "base64"));
  console.log(`Saved www/app/${file}`);
}
await browser.close();
