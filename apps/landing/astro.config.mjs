import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// Static output. Styles are inlined so the page has no absolute asset paths
// and works from the beta site's sub-folder (/prashna/) as well as the root.
export default defineConfig({
  output: "static",
  build: { inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
});
