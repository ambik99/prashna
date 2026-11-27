import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const OUT_DIR = "dist";

// The open app checks for a new version by reading the deployed app's file
// list from files.json (see src/sw.ts). It is the exact list written into
// sw.js, saved as the manifest is built, so the two can never disagree.
// files.json itself is not part of the offline copy.
async function writeFileList(entries: Array<{ url: string }>) {
  const outDir = fileURLToPath(new URL(`./${OUT_DIR}/`, import.meta.url));
  await mkdir(outDir, { recursive: true });
  await writeFile(`${outDir}files.json`, JSON.stringify(entries.map(({ url }) => url)));
}

// Every built path is relative ("./"), so the app works wherever /app/ is served.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // Builds src/sw.ts into sw.js with the list of every built file written
    // in, so the offline copy always matches the build. Prashna keeps its own
    // manifest.json (public/) and registers the worker itself (main.tsx).
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        globPatterns: ["**/*"],
        globIgnores: ["sw.js", "files.json"],
        rollupFormat: "iife",
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        manifestTransforms: [
          async (manifest) => {
            await writeFileList(manifest);
            return { manifest };
          },
        ],
      },
    }),
  ],
  build: { outDir: OUT_DIR, emptyOutDir: true },
});
