import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// The app is served at /app/ on Cloudflare and at /prashna/app/ on the beta
// site, so every built path is relative ("./").
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
        globIgnores: ["sw.js"],
        rollupFormat: "iife",
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  build: { outDir: "dist", emptyOutDir: true },
});
