// Prashna's Cloudflare Worker. Cloudflare serves the static site (dist/)
// itself; only /api/* reaches this code (run_worker_first in wrangler.jsonc).

import { PAPER_VERSION } from "@prashna/paper";

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      return json({ ok: true, paperVersion: PAPER_VERSION });
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
