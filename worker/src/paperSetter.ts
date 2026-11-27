// What the AI is asked for and how its answer becomes a Paper: the
// paper-setter prompt built from a Blueprint, the JSON shape Gemini must
// answer in, and the checks that turn that answer into a current Paper.
// Adapted from the earlier prototype (ambik99/CBSEqpGenerator).

import {
  DEFAULT_META,
  SECTIONS,
  findBlueprint,
  paperSchema,
  usesScienceDivisions,
  type Blueprint,
  type Difficulty,
  type Paper,
  type Question,
  type Section,
} from "@prashna/paper";
import { z } from "zod";

export interface PaperRequest {
  classLevel: string;
  subject: string;
  focus: string;
  difficulty?: Difficulty | undefined;
}

const DIFFICULTY_WORDS: Record<Difficulty, string> = {
  easy: "Keep the questions on the easier side of the board standard, suitable for revision.",
  standard: "Match the difficulty of the CBSE board examination.",
  challenging: "Make the questions on the harder side of the board standard, with more competency-based and higher-order thinking questions.",
};

export function buildPrompt(request: PaperRequest, blueprint: Blueprint): string {
  const { classLevel, subject } = request;
  const focus = request.focus || "the full CBSE syllabus";
  const divisions = usesScienceDivisions(classLevel, subject);
  return [
    `You are a senior CBSE board exam paper setter. Write a complete, authentic CBSE Sample Question Paper for ${classLevel} ${subject}, covering ${focus}.`,
    `Follow this official CBSE guideline strictly: ${blueprint.guidelines} (Pattern: ${blueprint.pattern}. Maximum marks: ${blueprint.maxMarks}. Time: ${blueprint.time}.)`,
    DIFFICULTY_WORDS[request.difficulty ?? "standard"],
    "",
    "Answer with one JSON object:",
    '- "instructions": the General Instructions printed at the top of the paper.',
    '- "sectionNotes": a short instruction for each of "Section A" to "Section E" ("" for a Section the paper does not use).',
    `- "questions": every question in order. Their "marks" must add up to exactly ${blueprint.maxMarks}. Use only "Section A" to "Section E"; put any further part of the pattern (such as Map Work or Part B) in the last Section it fits.`,
    "Each question has:",
    '- "section": "Section A", "Section B", "Section C", "Section D" or "Section E".',
    '- "type": "mcq" (multiple choice), "ar" (Assertion-Reason), "case" (case-study or source-based) or "standard" (any other).',
    '- "text": the question, or the case passage for "case"; "" for "ar".',
    '- "options": exactly 4 options without labels for "mcq"; [] otherwise.',
    '- "assertion" and "reason": the two statements for "ar"; "" otherwise.',
    '- "subQuestions": the sub-questions of a "case", each like "(i) ... (1)"; [] otherwise.',
    '- "orText": an internal-choice alternative question where CBSE gives one, else "".',
    '- "marks": a whole number.',
    '- "answer": a concise CBSE Marking Scheme answer, with how marks are awarded.',
    divisions
      ? '- "division": "Physics", "Chemistry" or "Biology", the part of Science the question tests. Balance the paper across all three.'
      : '- "division": "None".',
  ].join("\n");
}

/** The JSON shape Gemini must answer in (its OpenAPI-style responseSchema). */
export function responseSchema(divisions: boolean) {
  const text = { type: "STRING" };
  const texts = { type: "ARRAY", items: text };
  return {
    type: "OBJECT",
    properties: {
      instructions: text,
      sectionNotes: {
        type: "OBJECT",
        properties: Object.fromEntries(SECTIONS.map((section) => [section, text])),
        required: [...SECTIONS],
      },
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            section: { type: "STRING", enum: [...SECTIONS] },
            type: { type: "STRING", enum: ["mcq", "ar", "case", "standard"] },
            division: { type: "STRING", enum: divisions ? ["Physics", "Chemistry", "Biology"] : ["None"] },
            text,
            options: texts,
            assertion: text,
            reason: text,
            subQuestions: texts,
            orText: text,
            marks: { type: "INTEGER" },
            answer: text,
          },
          required: ["section", "type", "division", "text", "options", "assertion", "reason", "subQuestions", "orText", "marks", "answer"],
          propertyOrdering: ["section", "type", "division", "text", "options", "assertion", "reason", "subQuestions", "orText", "marks", "answer"],
        },
      },
    },
    required: ["instructions", "sectionNotes", "questions"],
    propertyOrdering: ["instructions", "sectionNotes", "questions"],
  };
}

const modelQuestionSchema = z.object({
  section: z.enum(SECTIONS),
  type: z.enum(["mcq", "ar", "case", "standard"]),
  division: z.enum(["Physics", "Chemistry", "Biology", "None", ""]).default("None"),
  text: z.string().default(""),
  options: z.array(z.string()).default([]),
  assertion: z.string().default(""),
  reason: z.string().default(""),
  subQuestions: z.array(z.string()).default([]),
  orText: z.string().default(""),
  marks: z.number().int().positive(),
  answer: z.string().default(""),
});

const modelPaperSchema = z.object({
  instructions: z.string().default(""),
  sectionNotes: z.record(z.string(), z.string()).default({}),
  questions: z.array(modelQuestionSchema).min(1),
});

export type ReadResult =
  | { ok: true; paper: Paper; marks: { expected: number; actual: number } }
  | { ok: false; problem: string };

/**
 * Turns Gemini's answer (JSON text) into a current Paper, or says what is
 * wrong with it. The school name is left empty: the app keeps the teacher's own.
 */
export function readModelPaper(text: string, request: PaperRequest, now: Date): ReadResult {
  const blueprint = findBlueprint(request.classLevel, request.subject);
  if (!blueprint) return { ok: false, problem: "No Blueprint for this Class and Subject" };

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, problem: "The answer is not JSON" };
  }
  const parsed = modelPaperSchema.safeParse(json);
  if (!parsed.success) return { ok: false, problem: z.prettifyError(parsed.error) };
  const answer = parsed.data;

  const divisions = usesScienceDivisions(request.classLevel, request.subject);
  const questions: Question[] = [];
  for (const [index, q] of answer.questions.entries()) {
    const number = index + 1;
    if (q.type === "mcq" && q.options.filter((o) => o.trim()).length !== 4) {
      return { ok: false, problem: `Question ${number} is an MCQ without 4 options` };
    }
    if (q.type === "ar" && !(q.assertion.trim() && q.reason.trim())) {
      return { ok: false, problem: `Question ${number} is an Assertion-Reason without both statements` };
    }
    if (q.type !== "ar" && !q.text.trim()) return { ok: false, problem: `Question ${number} has no text` };
    const division = q.division === "None" ? "" : q.division;
    if (divisions && !division) return { ok: false, problem: `Question ${number} has no Science Division` };
    questions.push({
      id: number,
      section: q.section,
      division: divisions ? division : "",
      type: q.type,
      text: q.type === "ar" ? "" : q.text,
      options: q.type === "mcq" ? q.options : [],
      subQuestions: q.type === "case" ? q.subQuestions : [],
      assertion: q.type === "ar" ? q.assertion : "",
      reason: q.type === "ar" ? q.reason : "",
      imageData: "",
      orText: q.orText,
      answer: q.answer,
      marks: q.marks,
    });
  }

  const paper: Paper = {
    version: 1,
    meta: {
      ...DEFAULT_META,
      school: "",
      exam: `Sample Question Paper (${sessionYear(now)})`,
      classLevel: request.classLevel,
      subject: request.subject,
      time: blueprint.time,
      targetMarks: blueprint.maxMarks,
      instructions: answer.instructions.trim() || DEFAULT_META.instructions,
      sectionNotes: perSection((section) => answer.sectionNotes[section]?.trim() ?? ""),
      sectionMarks: perSection((section) => commonMarks(questions.filter((q) => q.section === section))),
      sectionCounts: perSection((section) => questions.filter((q) => q.section === section).length),
      divisionMode: "Combined",
      divisionMarks: DEFAULT_META.divisionMarks,
    },
    questions,
    nextId: questions.length + 1,
  };
  const checked = paperSchema.safeParse(paper);
  if (!checked.success) return { ok: false, problem: z.prettifyError(checked.error) };

  const actual = questions.reduce((sum, q) => sum + q.marks, 0);
  return { ok: true, paper: checked.data, marks: { expected: blueprint.maxMarks, actual } };
}

function perSection<T>(value: (section: Section) => T): Record<Section, T> {
  return Object.fromEntries(SECTIONS.map((section) => [section, value(section)])) as Record<Section, T>;
}

/** A Section's marks per question when its Questions all agree, else 0 (none set). */
function commonMarks(questions: Question[]): number {
  const marks = new Set(questions.map((q) => q.marks));
  return marks.size === 1 ? [...marks][0]! : 0;
}

/** The CBSE session a date falls in, such as "2026–27" (sessions start in April). */
export function sessionYear(now: Date): string {
  const india = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const start = india.getUTCMonth() >= 3 ? india.getUTCFullYear() : india.getUTCFullYear() - 1;
  return `${start}–${String((start + 1) % 100).padStart(2, "0")}`;
}
