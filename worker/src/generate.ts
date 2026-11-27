// POST /api/generate: an AI Generated Paper (docs/adr/0002, issue #49).
//
//   bot check → limits → ask the model → check the answer → (retry once) → Paper
//
// The model is asked again once when its answer can't be read or its marks
// don't add up to the Blueprint's total; the retry counts towards the daily
// budget. If the marks still don't add up, the Paper is sent anyway and the
// app's Target Marks shows the gap.

import {
  findBlueprint,
  generateRequestSchema,
  usesScienceDivisions,
  type GenerateError,
  type GenerateResponse,
} from "@prashna/paper";
import { ModelError, type CallModel } from "./gemini.ts";
import type { Admission } from "./limits.ts";
import { buildPrompt, readModelPaper, responseSchema, type ReadResult } from "./paperSetter.ts";
import type { VerifyBotCheck } from "./turnstile.ts";

export interface Limits {
  admit(ipHash: string, now: number): Promise<Admission>;
  canSpend(now: number): Promise<boolean>;
  spend(now: number, dollars: number): Promise<void>;
}

export interface GenerateDeps {
  verifyBotCheck: VerifyBotCheck;
  limits: Limits;
  callModel: CallModel;
  hashIp: (ip: string) => Promise<string>;
  now: () => number;
  log?: (message: string, details: Record<string, unknown>) => void;
}

const MESSAGES: Record<GenerateError, string> = {
  "bad-request": "This request for a Paper could not be understood.",
  "bot-check": "The bot check did not pass. Please try again.",
  "rate-limit": "You can generate 3 Papers an hour. Please try again later.",
  "daily-limit": "Prashna has generated all the Papers it can today. Please try again tomorrow.",
  failed: "The Paper could not be generated. Please try again.",
};
const STATUS: Record<GenerateError, number> = {
  "bad-request": 400,
  "bot-check": 403,
  "rate-limit": 429,
  "daily-limit": 429,
  failed: 502,
};

const MAX_ATTEMPTS = 2;

export async function handleGenerate(request: Request, deps: GenerateDeps): Promise<Response> {
  if (request.method !== "POST") return reply({ ok: false, error: "bad-request", message: "Use POST." }, 405);
  const log = deps.log ?? (() => {});

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return failure("bad-request");
  }
  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) return failure("bad-request");
  const { turnstileToken, ...paperRequest } = parsed.data;
  const blueprint = findBlueprint(paperRequest.classLevel, paperRequest.subject)!;

  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (!(await deps.verifyBotCheck(turnstileToken, ip))) return failure("bot-check");

  const admission = await deps.limits.admit(await deps.hashIp(ip), deps.now());
  if (admission !== "ok") return failure(admission);

  const prompt = buildPrompt(paperRequest, blueprint);
  const schema = responseSchema(usesScienceDivisions(paperRequest.classLevel, paperRequest.subject));
  let best: Extract<ReadResult, { ok: true }> | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // A retry needs room in the budget too; the first try was checked by admit.
    if (attempt > 1 && !(await deps.limits.canSpend(deps.now()))) break;
    let read: ReadResult;
    try {
      const answer = await deps.callModel(prompt, schema);
      await deps.limits.spend(deps.now(), answer.cost);
      read = readModelPaper(answer.text, paperRequest, new Date(deps.now()));
      log("generate attempt", {
        attempt,
        cost: answer.cost,
        finishReason: answer.finishReason,
        problem: read.ok ? null : read.problem,
        marks: read.ok ? read.marks : null,
      });
    } catch (error) {
      if (!(error instanceof ModelError)) throw error;
      log("generate attempt", { attempt, error: error.message });
      continue;
    }
    if (!read.ok) continue;
    if (read.marks.actual === read.marks.expected) return reply({ ok: true, paper: read.paper, marks: read.marks });
    // Keep whichever answer came closest to the Blueprint's total.
    if (!best || gap(read) < gap(best)) best = read;
  }

  if (best) return reply({ ok: true, paper: best.paper, marks: best.marks });
  return failure("failed");
}

const gap = (read: Extract<ReadResult, { ok: true }>) => Math.abs(read.marks.actual - read.marks.expected);

function failure(error: GenerateError): Response {
  return reply({ ok: false, error, message: MESSAGES[error] }, STATUS[error]);
}

function reply(body: GenerateResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
