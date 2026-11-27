// POST /api/generate with Gemini and Turnstile replaced by stand-ins, and
// the real cost controls (limits.ts) over an in-memory store.

import type { GenerateResponse } from "@prashna/paper";
import { beforeEach, describe, expect, it } from "vitest";
import type { ModelAnswer } from "./gemini.ts";
import { ModelError } from "./gemini.ts";
import { handleGenerate, type GenerateDeps } from "./generate.ts";
import { admit, canSpend, spend, type LimitsStore } from "./limits.ts";

// 27 November 2026, 10:00 in India.
const NOW = Date.parse("2026-11-27T04:30:00Z");
const HOUR = 60 * 60 * 1000;

class MemoryStore implements LimitsStore {
  data = new Map<string, unknown>();
  async get<T>(key: string) {
    return structuredClone(this.data.get(key)) as T | undefined;
  }
  async put<T>(key: string, value: T) {
    this.data.set(key, structuredClone(value));
  }
}

type ModelQuestion = Record<string, unknown>;

/** A Class 10 Science answer in the shape Gemini is asked for: 39 Questions, 80 marks. */
function class10Science({ lastMarks = 4, division = true } = {}): string {
  const divisions = ["Physics", "Chemistry", "Biology"];
  const questions: ModelQuestion[] = [];
  const add = (section: string, type: string, marks: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const q = questions.length;
      questions.push({
        section,
        type,
        division: division ? divisions[q % 3] : "None",
        text: type === "ar" ? "" : `Question ${q + 1} text`,
        options: type === "mcq" ? ["one", "two", "three", "four"] : [],
        assertion: type === "ar" ? "An assertion" : "",
        reason: type === "ar" ? "A reason" : "",
        subQuestions: type === "case" ? ["(i) First part (1)", "(ii) Second part (1)", "(iii) Third part (2)"] : [],
        orText: "",
        marks,
        answer: `Answer ${q + 1}`,
      });
    }
  };
  add("Section A", "mcq", 1, 16);
  add("Section A", "ar", 1, 4);
  add("Section B", "standard", 2, 6);
  add("Section C", "standard", 3, 7);
  add("Section D", "standard", 5, 3);
  add("Section E", "case", 4, 2);
  add("Section E", "case", lastMarks, 1);
  return JSON.stringify({
    instructions: "This question paper contains 39 questions.",
    sectionNotes: { "Section A": "MCQs", "Section B": "VSA", "Section C": "SA", "Section D": "LA", "Section E": "Case-Study" },
    questions,
  });
}

let store: MemoryStore;
let botCheckPasses: boolean;
let answers: (ModelAnswer | Error)[];
let prompts: string[];

beforeEach(() => {
  store = new MemoryStore();
  botCheckPasses = true;
  answers = [];
  prompts = [];
});

const answer = (text: string, cost = 0.04): ModelAnswer => ({ text, cost, finishReason: "STOP" });

function deps(now = NOW): GenerateDeps {
  return {
    verifyBotCheck: async (token) => botCheckPasses && token === "token-from-turnstile",
    limits: {
      admit: (ipHash, at) => admit(store, ipHash, at),
      canSpend: (at) => canSpend(store, at),
      spend: (at, dollars) => spend(store, at, dollars),
    },
    callModel: async (prompt) => {
      prompts.push(prompt);
      const next = answers.shift();
      if (!next) throw new Error("The model was called more often than the test expected");
      if (next instanceof Error) throw next;
      return next;
    },
    hashIp: async (ip) => `hash-of-${ip}`,
    now: () => now,
  };
}

const REQUEST = { classLevel: "Class 10", subject: "Science", focus: "Light and Electricity", turnstileToken: "token-from-turnstile" };

async function generate(body: unknown = REQUEST, { ip = "203.0.113.7", now = NOW } = {}) {
  const request = new Request("https://prashna.example/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    body: JSON.stringify(body),
  });
  const response = await handleGenerate(request, deps(now));
  return { status: response.status, body: (await response.json()) as GenerateResponse, response };
}

describe("POST /api/generate", () => {
  it("answers with a complete Class 10 Science Paper and its Marking Scheme", async () => {
    answers = [answer(class10Science())];
    const { status, body, response } = await generate();

    expect(status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    if (!body.ok) throw new Error(body.message);
    expect(body.marks).toEqual({ expected: 80, actual: 80 });
    const { meta, questions } = body.paper;
    expect(meta).toMatchObject({
      classLevel: "Class 10",
      subject: "Science",
      exam: "Sample Question Paper (2026–27)",
      time: "3 Hours",
      targetMarks: 80,
      school: "",
      sectionCounts: { "Section A": 20, "Section B": 6, "Section C": 7, "Section D": 3, "Section E": 3 },
      sectionMarks: { "Section A": 1, "Section B": 2, "Section C": 3, "Section D": 5, "Section E": 4 },
    });
    expect(questions).toHaveLength(39);
    expect(questions[0]).toMatchObject({ id: 1, type: "mcq", options: ["one", "two", "three", "four"], answer: "Answer 1" });
    expect(questions[16]).toMatchObject({ type: "ar", assertion: "An assertion", reason: "A reason" });
    expect(body.paper.nextId).toBe(40);
  });

  it("gives every Class 10 Science Question its Science Division", async () => {
    answers = [answer(class10Science())];
    const { body } = await generate();
    if (!body.ok) throw new Error(body.message);
    expect(body.paper.questions.slice(0, 3).map((q) => q.division)).toEqual(["Physics", "Chemistry", "Biology"]);
    expect(body.paper.questions.every((q) => q.division !== "")).toBe(true);
    expect(prompts[0]).toContain('"Physics", "Chemistry" or "Biology"');
  });

  it("builds the prompt from the Blueprint, the Focus and the difficulty", async () => {
    answers = [answer(class10Science())];
    await generate({ ...REQUEST, difficulty: "challenging" });
    expect(prompts[0]).toContain("Class 10 Science, covering Light and Electricity");
    expect(prompts[0]).toContain("Sec A: 16 MCQ + 4 A-R (20M)");
    expect(prompts[0]).toContain("add up to exactly 80");
    expect(prompts[0]).toContain("harder side");
  });

  it("refuses a request that fails the bot check, without asking the model", async () => {
    botCheckPasses = false;
    const { status, body } = await generate();
    expect(status).toBe(403);
    expect(body).toMatchObject({ ok: false, error: "bot-check" });
    expect(prompts).toHaveLength(0);
  });

  it("refuses a Class and Subject with no Blueprint", async () => {
    const { status, body } = await generate({ ...REQUEST, subject: "Astrology" });
    expect(status).toBe(400);
    expect(body).toMatchObject({ ok: false, error: "bad-request" });
  });

  it("allows 3 Papers an hour from one address, then refuses until the hour has passed", async () => {
    answers = Array.from({ length: 5 }, () => answer(class10Science()));
    for (let i = 0; i < 3; i++) expect((await generate()).status).toBe(200);

    const fourth = await generate(REQUEST, { now: NOW + 30 * 60 * 1000 });
    expect(fourth.status).toBe(429);
    expect(fourth.body).toMatchObject({ ok: false, error: "rate-limit" });

    // Another address is not affected.
    expect((await generate(REQUEST, { ip: "198.51.100.2" })).status).toBe(200);
    // An hour after the first request, there is room again.
    expect((await generate(REQUEST, { now: NOW + HOUR })).status).toBe(200);
  });

  it("refuses everyone once $3 has been spent today, and opens again the next day in India", async () => {
    await spend(store, NOW, 3);
    const refused = await generate();
    expect(refused.status).toBe(429);
    expect(refused.body).toMatchObject({ ok: false, error: "daily-limit", message: expect.stringContaining("tomorrow") });
    expect(prompts).toHaveLength(0);

    // Midnight in India is 18:30 UTC.
    answers = [answer(class10Science())];
    expect((await generate(REQUEST, { now: Date.parse("2026-11-27T18:30:00Z") })).status).toBe(200);
  });

  it("counts what every call to the model costs towards the daily budget", async () => {
    answers = [answer(class10Science(), 1.5), answer(class10Science(), 1.5)];
    await generate(REQUEST, { ip: "192.0.2.1" });
    await generate(REQUEST, { ip: "192.0.2.2" });
    const { body } = await generate(REQUEST, { ip: "192.0.2.3" });
    expect(body).toMatchObject({ ok: false, error: "daily-limit" });
  });

  it("asks again once when the answer is not a Paper, then fails clearly", async () => {
    answers = [answer("not json"), answer(JSON.stringify({ questions: [{ section: "Section Z" }] }))];
    const { status, body } = await generate();
    expect(status).toBe(502);
    expect(body).toMatchObject({ ok: false, error: "failed" });
    expect(prompts).toHaveLength(2);
  });

  it("treats a Science Question without a Science Division as an unreadable answer", async () => {
    answers = [answer(class10Science({ division: false })), answer(class10Science())];
    const { body } = await generate();
    expect(body.ok).toBe(true);
    expect(prompts).toHaveLength(2);
  });

  it("asks again once when an error stops the model", async () => {
    answers = [new ModelError("Gemini answered 503"), answer(class10Science())];
    const { status } = await generate();
    expect(status).toBe(200);
    expect(prompts).toHaveLength(2);
  });

  it("asks again once when the marks don't add up, and uses the retry when it does", async () => {
    answers = [answer(class10Science({ lastMarks: 2 })), answer(class10Science())];
    const { body } = await generate();
    if (!body.ok) throw new Error(body.message);
    expect(prompts).toHaveLength(2);
    expect(body.marks).toEqual({ expected: 80, actual: 80 });
  });

  it("sends the Paper with its marks gap when the marks still don't add up after one retry", async () => {
    answers = [answer(class10Science({ lastMarks: 1 })), answer(class10Science({ lastMarks: 2 }))];
    const { status, body } = await generate();
    expect(status).toBe(200);
    if (!body.ok) throw new Error(body.message);
    expect(prompts).toHaveLength(2);
    // The closer of the two answers.
    expect(body.marks).toEqual({ expected: 80, actual: 78 });
    expect(body.paper.meta.targetMarks).toBe(80);
  });

  it("does not retry when the retry would go over the daily budget", async () => {
    await spend(store, NOW, 2.98);
    answers = [answer(class10Science({ lastMarks: 2 }), 0.05)];
    const { body } = await generate();
    expect(prompts).toHaveLength(1);
    expect(body).toMatchObject({ ok: true, marks: { expected: 80, actual: 78 } });
  });
});
