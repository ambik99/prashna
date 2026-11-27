// Checks a Cloudflare Turnstile token, the bot check in front of every AI
// request. Fails closed: anything other than a clear pass is a fail.
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

export type VerifyBotCheck = (token: string, ip: string) => Promise<boolean>;

/** The action the app's widget sends (apps/app/src/aiPaper.ts). */
export const TURNSTILE_ACTION = "generate";
const MAX_TOKEN_LENGTH = 2048;
const TIMEOUT_MS = 10_000;

interface Siteverify {
  success?: boolean;
  action?: string;
  hostname?: string;
  /** Set when Cloudflare's test secret answered (local development only). */
  metadata?: { result_with_testing_key?: boolean };
}

/**
 * @param hostnames Where the widget may be solved (TURNSTILE_HOSTNAMES in
 *   wrangler.jsonc, comma-separated). An empty list passes nothing.
 */
export function turnstile(secret: string, hostnames: string, fetcher: typeof fetch = fetch): VerifyBotCheck {
  const allowed = new Set(
    hostnames
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean),
  );
  return async (token, ip) => {
    if (!secret || allowed.size === 0) return false;
    if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) return false;
    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set("remoteip", ip);
    try {
      const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: form,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) return false;
      const outcome = (await response.json()) as Siteverify;
      // Cloudflare's test secret reports no action (hostname "example.com",
      // which production never allows), so local development can pass.
      const testing = outcome.metadata?.result_with_testing_key === true;
      return (
        outcome.success === true &&
        (outcome.action === TURNSTILE_ACTION || (testing && outcome.action === undefined)) &&
        typeof outcome.hostname === "string" &&
        allowed.has(outcome.hostname.toLowerCase())
      );
    } catch {
      return false;
    }
  };
}
