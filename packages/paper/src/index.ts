// The Paper: the one shape shared by the app, saved Paper files, the browser's
// storage and the Worker (AI Generated Papers). See CONTEXT.md for the words.
//
// Saved files and stored Papers from older versions of Prashna have no
// `version` and may miss fields. `parsePaper` fills them in the way the old
// app did (www/app/app.js, applyPaperData) and returns a current Paper.

import { z } from "zod";

/** The current version of the Paper format. Bump it with an upgrade step. */
export const PAPER_VERSION = 1;

export const SECTIONS = ["Section A", "Section B", "Section C", "Section D", "Section E"] as const;
export type Section = (typeof SECTIONS)[number];

/** Standard, MCQ, Assertion–Reason and Case-Study. */
export const QUESTION_TYPES = ["standard", "mcq", "ar", "case"] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const SCIENCE_DIVISIONS = ["Physics", "Chemistry", "Biology"] as const;
export type ScienceDivision = (typeof SCIENCE_DIVISIONS)[number];

export const DIVISION_MODES = ["Combined", ...SCIENCE_DIVISIONS] as const;
export type DivisionMode = (typeof DIVISION_MODES)[number];

export const DEFAULT_META = {
  school: "Caesar School, Anandapally, Mal",
  exam: "Half-Yearly Examination (2026–27)",
  classLevel: "Class 10",
  subject: "Science",
  time: "3 Hours",
  showWatermark: true,
  targetMarks: 80,
  instructions:
    "All questions are compulsory. However, internal choices have been provided in some questions. Marks for each question are indicated against it.",
  sectionNotes: {
    "Section A": "Objective type / Multiple Choice Questions (1 mark each).",
    "Section B": "Very Short Answer questions (2 marks each).",
    "Section C": "Short Answer questions (3 marks each).",
    "Section D": "Long Answer questions (5 marks each).",
    "Section E": "Case-Study / Source-Based questions (4 marks each).",
  },
  sectionMarks: { "Section A": 1, "Section B": 2, "Section C": 3, "Section D": 5, "Section E": 4 },
  sectionCounts: { "Section A": 20, "Section B": 5, "Section C": 6, "Section D": 4, "Section E": 3 },
  divisionMode: "Combined",
  divisionMarks: { Physics: 25, Chemistry: 25, Biology: 30 },
} as const satisfies PaperMeta;

const count = z.number().int().nonnegative();

function perSection<T extends z.ZodType>(value: (section: Section) => T) {
  return z.object({
    "Section A": value("Section A"),
    "Section B": value("Section B"),
    "Section C": value("Section C"),
    "Section D": value("Section D"),
    "Section E": value("Section E"),
  });
}

const metaSchema = z.object({
  school: z.string(),
  exam: z.string(),
  classLevel: z.string(),
  subject: z.string(),
  time: z.string(),
  showWatermark: z.boolean(),
  targetMarks: count,
  instructions: z.string(),
  sectionNotes: perSection(() => z.string()),
  sectionMarks: perSection(() => count),
  sectionCounts: perSection(() => count),
  divisionMode: z.enum(DIVISION_MODES),
  divisionMarks: z.object({ Physics: count, Chemistry: count, Biology: count }),
});

export const questionSchema = z.object({
  id: z.number().int().positive(),
  section: z.enum(SECTIONS),
  /** The Science Division, or "" when the Question has none. */
  division: z.union([z.enum(SCIENCE_DIVISIONS), z.literal("")]),
  type: z.enum(QUESTION_TYPES),
  text: z.string(),
  options: z.array(z.string()),
  subQuestions: z.array(z.string()),
  assertion: z.string(),
  reason: z.string(),
  /** A picture for the Question, as a data URL, or "". */
  imageData: z.string(),
  /** The Alternative Question, or "". */
  orText: z.string(),
  /** The Marking Scheme entry. */
  answer: z.string(),
  marks: z.number().nonnegative(),
});

/** A current Paper. Everything is present. */
export const paperSchema = z.object({
  version: z.literal(PAPER_VERSION),
  meta: metaSchema,
  questions: z.array(questionSchema),
  nextId: z.number().int().positive(),
});

export type Paper = z.infer<typeof paperSchema>;
export type PaperMeta = Paper["meta"];
export type Question = z.infer<typeof questionSchema>;

// What older files and stored Papers may look like: the old app's
// isPaperData only asked for a `meta` object and a `questions` array, and
// filled anything missing from its defaults.
const legacyMetaSchema = z.object({
  ...metaSchema.partial().shape,
  sectionNotes: metaSchema.shape.sectionNotes.partial().optional(),
  sectionMarks: metaSchema.shape.sectionMarks.partial().optional(),
  sectionCounts: metaSchema.shape.sectionCounts.partial().optional(),
  divisionMarks: metaSchema.shape.divisionMarks.partial().optional(),
});

function upgradeMeta(meta: z.output<typeof legacyMetaSchema>): PaperMeta {
  const { sectionNotes, sectionMarks, sectionCounts, divisionMarks, ...rest } = meta;
  return {
    ...DEFAULT_META,
    ...stripUndefined(rest),
    sectionNotes: { ...DEFAULT_META.sectionNotes, ...stripUndefined(sectionNotes ?? {}) },
    sectionMarks: { ...DEFAULT_META.sectionMarks, ...stripUndefined(sectionMarks ?? {}) },
    sectionCounts: { ...DEFAULT_META.sectionCounts, ...stripUndefined(sectionCounts ?? {}) },
    divisionMarks: { ...DEFAULT_META.divisionMarks, ...stripUndefined(divisionMarks ?? {}) },
  };
}

const legacyQuestionSchema = questionSchema.extend({
  id: questionSchema.shape.id.optional(),
  division: questionSchema.shape.division.default(""),
  type: questionSchema.shape.type.default("standard"),
  text: z.string().default(""),
  options: z.array(z.string()).default([]),
  subQuestions: z.array(z.string()).default([]),
  assertion: z.string().default(""),
  reason: z.string().default(""),
  imageData: z.string().default(""),
  orText: z.string().default(""),
  answer: z.string().default(""),
  marks: questionSchema.shape.marks.default(0),
});

const legacyPaperSchema = z.object({
  version: z.number().int().nonnegative().optional(),
  meta: legacyMetaSchema,
  questions: z.array(legacyQuestionSchema),
  nextId: z.number().int().positive().optional(),
});

export type ParsePaperResult =
  | { ok: true; paper: Paper }
  | { ok: false; reason: "not-a-paper" | "newer-version"; message: string };

/**
 * Reads anything that might be a Paper (a saved file, stored data, AI output)
 * and returns a current Paper, upgrading older versions.
 */
export function parsePaper(input: unknown): ParsePaperResult {
  const parsed = legacyPaperSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reason: "not-a-paper", message: z.prettifyError(parsed.error) };
  }
  const { version = 0, meta, questions, nextId } = parsed.data;
  if (version > PAPER_VERSION) {
    return {
      ok: false,
      reason: "newer-version",
      message: `This Paper was saved by a newer version of Prashna (format ${version}).`,
    };
  }

  // Version 0 (no version): Questions may lack an id.
  let maxId = Math.max(0, ...questions.map((q) => q.id ?? 0));
  const numbered = questions.map((q) => ({ ...q, id: q.id ?? ++maxId }));

  const paper: Paper = {
    version: PAPER_VERSION,
    meta: upgradeMeta(meta),
    questions: numbered,
    nextId: Math.max(nextId ?? 1, maxId + 1),
  };
  return { ok: true, paper: paperSchema.parse(paper) };
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}
