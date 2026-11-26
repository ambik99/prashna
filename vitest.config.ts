import { defineConfig } from "vitest/config";

// Unit tests for the shared Paper schema and the Worker. Browser tests are
// Playwright's (tests/*.spec.mjs).
export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts", "worker/src/**/*.test.ts"],
    environment: "node",
  },
});
