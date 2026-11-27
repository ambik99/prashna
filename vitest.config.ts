import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the shared Paper schema and the Worker. Browser tests are
// Playwright's (tests/*.spec.mjs).
export default defineConfig({
  // The Workers runtime's own module, replaced by a stand-in under Node.
  resolve: {
    alias: { "cloudflare:workers": fileURLToPath(new URL("./worker/src/testing/cloudflare-workers.ts", import.meta.url)) },
  },
  test: {
    include: ["packages/*/src/**/*.test.ts", "worker/src/**/*.test.ts"],
    environment: "node",
  },
});
