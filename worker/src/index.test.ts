import { describe, expect, it } from "vitest";
import { PAPER_VERSION } from "@prashna/paper";
import worker, { type Env } from "./index.ts";

const assets = { fetch: async () => new Response("static file") } as unknown as Fetcher;
const env = { ASSETS: assets } as Env;
const call = (path: string) =>
  worker.fetch(new Request(`https://prashna.example${path}`) as Parameters<typeof worker.fetch>[0], env);

describe("worker", () => {
  it("answers /api/health", async () => {
    const response = await call("/api/health");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true, paperVersion: PAPER_VERSION });
  });

  it("answers unknown /api/ paths with 404 instead of a static file", async () => {
    const response = await call("/api/nothing-here");
    expect(response.status).toBe(404);
  });

  it("hands everything else to the static files", async () => {
    const response = await call("/app/");
    expect(await response.text()).toBe("static file");
  });
});
