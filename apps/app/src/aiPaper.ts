// Asking the Worker for an AI Generated Paper (POST /api/generate), and the
// Turnstile bot check that goes with every request. Only the request itself
// leaves the device: Class, Subject, Focus, difficulty and the bot-check token.

import type { GenerateError, GenerateRequest, GenerateResponse } from "@prashna/paper";

export const GENERATE_URL = "/api/generate";

/**
 * Prashna's Turnstile widget (public). VITE_TURNSTILE_SITE_KEY replaces it,
 * for example with Cloudflare's always-passing test key 1x00000000000000000000AA
 * for local development.
 */
export const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAGVVQ-gxvuP2XiZ4";
/** Checked by the Worker (worker/src/turnstile.ts), so a token from another form can't be used here. */
export const TURNSTILE_ACTION = "generate";

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** A generation takes a while; give up after this long. */
const TIMEOUT_MS = 120_000;

/** What the teacher is told when a Paper can't be generated. Never silent. */
export const ERROR_MESSAGES: Record<GenerateError | "offline" | "bot-check-unavailable", string> = {
  "bad-request": "Prashna could not ask for this Paper. Please choose the Class and Subject again.",
  "bot-check": "The bot check did not pass. Please try again.",
  "bot-check-unavailable": "The bot check could not load. Check your internet connection and try again.",
  "rate-limit": "You can generate 3 Papers an hour. Please try again later.",
  "daily-limit": "Prashna has generated all the Papers it can today. Please try again tomorrow.",
  failed: "The Paper could not be generated. Please try again.",
  offline: "You're offline. Generating a Paper needs the internet.",
};

export type PaperResult =
  | Extract<GenerateResponse, { ok: true }>
  | { ok: false; error: keyof typeof ERROR_MESSAGES; message: string };

export async function requestPaper(request: GenerateRequest): Promise<PaperResult> {
  const fail = (error: keyof typeof ERROR_MESSAGES): PaperResult => ({ ok: false, error, message: ERROR_MESSAGES[error] });
  let response: Response;
  try {
    response = await fetch(GENERATE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return fail(navigator.onLine ? "failed" : "offline");
  }
  let body: GenerateResponse;
  try {
    body = (await response.json()) as GenerateResponse;
  } catch {
    return fail("failed");
  }
  if (body.ok) return body;
  return fail(body.error in ERROR_MESSAGES ? body.error : "failed");
}

// Turnstile ------------------------------------------------------------------

interface Turnstile {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  execute(widgetId: string): void;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let loading: Promise<Turnstile> | null = null;

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => reject(new Error("Turnstile did not load"));
    document.head.append(script);
  }).catch((error: unknown) => {
    loading = null;
    throw error;
  });
  return loading;
}

/**
 * A bot check placed in `container`. It stays invisible unless Turnstile
 * needs the teacher to tick a box. Each token is good for one request.
 */
export interface BotCheck {
  token(): Promise<string>;
  remove(): void;
}

export async function createBotCheck(container: HTMLElement): Promise<BotCheck> {
  const turnstile = await loadTurnstile();
  let pending: { resolve: (token: string) => void; reject: (error: Error) => void } | null = null;
  const id = turnstile.render(container, {
    sitekey: TURNSTILE_SITE_KEY,
    action: TURNSTILE_ACTION,
    execution: "execute",
    appearance: "interaction-only",
    callback: (token: string) => pending?.resolve(token),
    "error-callback": () => pending?.reject(new Error("bot-check")),
  });
  return {
    token() {
      return new Promise<string>((resolve, reject) => {
        pending = { resolve, reject };
        turnstile.reset(id);
        turnstile.execute(id);
      });
    },
    remove() {
      turnstile.remove(id);
    },
  };
}
