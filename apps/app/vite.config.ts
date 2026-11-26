import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The app is served at /app/ on Cloudflare and at /prashna/app/ on the beta
// site, so every built path is relative ("./").
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
