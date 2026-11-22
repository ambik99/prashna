import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
// The beta site on GitHub Pages is served from a sub-folder; sub-folder.spec.mjs
// checks the site works there too.
const SUB_FOLDER_PORT = 4174;
const SUB_FOLDER = "/prashna/";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The offline cache would serve stale files between runs; the offline
    // tests (offline.spec.mjs) turn the service worker back on for themselves.
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: "sub-folder.spec.mjs" },
    {
      name: "sub-folder",
      use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${SUB_FOLDER_PORT}${SUB_FOLDER}` },
      testMatch: "sub-folder.spec.mjs",
    },
  ],
  webServer: [
    {
      command: `node scripts/serve.mjs ${PORT}`,
      url: `http://localhost:${PORT}/app/`,
      reuseExistingServer: true,
    },
    {
      command: `node scripts/serve.mjs ${SUB_FOLDER_PORT} ${SUB_FOLDER}`,
      url: `http://localhost:${SUB_FOLDER_PORT}${SUB_FOLDER}app/`,
      reuseExistingServer: true,
    },
  ],
});
