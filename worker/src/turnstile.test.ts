// The Turnstile check, against a stand-in for Cloudflare's siteverify.

import { describe, expect, it } from "vitest";
import { TURNSTILE_ACTION, turnstile } from "./turnstile.ts";

const HOSTNAMES = "prashna.ambik99.workers.dev, preview.example";
const PASS = { success: true, action: TURNSTILE_ACTION, hostname: "prashna.ambik99.workers.dev" };

function fakeSiteverify(reply: { status?: number; body?: unknown } | "network-error") {
  const calls: RequestInit[] = [];
  const fetcher = (async (_url: string, init: RequestInit) => {
    calls.push(init);
    if (reply === "network-error") throw new TypeError("fetch failed");
    return new Response(JSON.stringify(reply.body ?? {}), { status: reply.status ?? 200 });
  }) as unknown as typeof fetch;
  return { calls, fetcher };
}

describe("turnstile", () => {
  it("passes a token Cloudflare confirms for the generate action on an allowed hostname", async () => {
    const site = fakeSiteverify({ body: PASS });
    expect(await turnstile("secret-1", HOSTNAMES, site.fetcher)("token-1", "203.0.113.7")).toBe(true);

    const init = site.calls[0]!;
    expect((init.headers as Record<string, string>)["content-type"]).toBe("application/x-www-form-urlencoded");
    const body = new URLSearchParams(String(init.body));
    expect(Object.fromEntries(body)).toEqual({ secret: "secret-1", response: "token-1", remoteip: "203.0.113.7" });
  });

  it("matches the hostname case-insensitively, against any allowed hostname", async () => {
    const site = fakeSiteverify({ body: { ...PASS, hostname: "Preview.Example" } });
    expect(await turnstile("secret-1", HOSTNAMES, site.fetcher)("token-1", "")).toBe(true);
  });

  it("passes Cloudflare's test secret, which reports no action, only on an allowed hostname", async () => {
    // What siteverify answered for the test secret on 2026-11-27.
    const testing = { success: true, hostname: "example.com", metadata: { result_with_testing_key: true } };
    expect(await turnstile("1x0000000000000000000000000000000AA", "localhost,example.com", fakeSiteverify({ body: testing }).fetcher)("t", "")).toBe(true);
    expect(await turnstile("1x0000000000000000000000000000000AA", HOSTNAMES, fakeSiteverify({ body: testing }).fetcher)("t", "")).toBe(false);
    // A real result never skips the action check.
    expect(await turnstile("secret-1", "example.com", fakeSiteverify({ body: { success: true, hostname: "example.com" } }).fetcher)("t", "")).toBe(false);
  });

  const fails: [string, Parameters<typeof fakeSiteverify>[0]][] = [
    ["Cloudflare says no", { body: { ...PASS, success: false } }],
    ["the action is another surface's", { body: { ...PASS, action: "login" } }],
    ["the action is missing", { body: { success: true, hostname: PASS.hostname } }],
    ["the hostname is not allowed", { body: { ...PASS, hostname: "evil.example" } }],
    ["siteverify answers with an error", { status: 500, body: PASS }],
    ["siteverify can't be reached", "network-error"],
  ];
  for (const [name, reply] of fails) {
    it(`fails when ${name}`, async () => {
      expect(await turnstile("secret-1", HOSTNAMES, fakeSiteverify(reply).fetcher)("token-1", "")).toBe(false);
    });
  }

  it("fails without asking Cloudflare when the token, secret or hostname list is unusable", async () => {
    const site = fakeSiteverify({ body: PASS });
    expect(await turnstile("secret-1", HOSTNAMES, site.fetcher)("", "")).toBe(false);
    expect(await turnstile("secret-1", HOSTNAMES, site.fetcher)("x".repeat(2049), "")).toBe(false);
    expect(await turnstile("", HOSTNAMES, site.fetcher)("token-1", "")).toBe(false);
    expect(await turnstile("secret-1", " , ", site.fetcher)("token-1", "")).toBe(false);
    expect(site.calls).toHaveLength(0);
  });
});
