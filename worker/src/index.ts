// Prashna's Cloudflare Worker. Cloudflare serves the static site (dist/)
// itself; only /api/* reaches this code (run_worker_first in wrangler.jsonc).

import { DurableObject } from "cloudflare:workers";
import { PAPER_VERSION } from "@prashna/paper";
import { geminiModel } from "./gemini.ts";
import { handleGenerate, type GenerateDeps } from "./generate.ts";
import { admit, canSpend, hashIp, spend } from "./limits.ts";
import { turnstile } from "./turnstile.ts";

export interface Env {
  ASSETS: Fetcher;
  /** The one LimitsObject that counts AI requests and spending. */
  LIMITS: DurableObjectNamespace<LimitsObject>;
  /** `wrangler secret put GEMINI_API_KEY` (paid tier). */
  GEMINI_API_KEY: string;
  /** `wrangler secret put TURNSTILE_SECRET_KEY`. */
  TURNSTILE_SECRET_KEY: string;
  /** Where the Turnstile widget may be solved, comma-separated (wrangler.jsonc vars). */
  TURNSTILE_HOSTNAMES: string;
}

/** Holds the counts for the cost controls (limits.ts). There is one, named "global". */
export class LimitsObject extends DurableObject<Env> {
  admit(ipHash: string, now: number) {
    return admit(this.ctx.storage, ipHash, now);
  }
  canSpend(now: number) {
    return canSpend(this.ctx.storage, now);
  }
  spend(now: number, dollars: number) {
    return spend(this.ctx.storage, now, dollars);
  }
}

export function generateDeps(env: Env): GenerateDeps {
  const limits = env.LIMITS.get(env.LIMITS.idFromName("global"));
  return {
    verifyBotCheck: turnstile(env.TURNSTILE_SECRET_KEY, env.TURNSTILE_HOSTNAMES ?? ""),
    limits: {
      admit: (ipHash, now) => limits.admit(ipHash, now),
      canSpend: (now) => limits.canSpend(now),
      spend: (now, dollars) => limits.spend(now, dollars),
    },
    callModel: geminiModel(env.GEMINI_API_KEY),
    hashIp,
    now: Date.now,
    log: (message, details) => console.log(message, JSON.stringify(details)),
  };
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      return json({ ok: true, paperVersion: PAPER_VERSION });
    }
    if (pathname === "/api/generate") {
      return handleGenerate(request, generateDeps(env));
    }
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return json({ ok: false, error: "Not found" }, 404);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
