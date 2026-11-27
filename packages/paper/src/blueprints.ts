// The CBSE Blueprints an AI Generated Paper follows, and what the app sends
// the Worker to ask for one (POST /api/generate). Shared so the app's form and
// the Worker's checks agree. The Blueprints come from the earlier prototype
// (ambik99/CBSEqpGenerator, CBSE_SAMPLE_BLUEPRINTS).

import { z } from "zod";
import type { Paper } from "./index.ts";

export interface Blueprint {
  maxMarks: number;
  time: string;
  /** The Sections and their marks, as a teacher reads them. */
  pattern: string;
  /** What the paper setter is told about the Sections. */
  guidelines: string;
}

export const BLUEPRINTS = {
  "Class 10": {
    English: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Section A: Reading Skills (20M) | Section B: Writing & Grammar (20M) | Section C: Literature (40M)",
      guidelines:
        "3 sections: Section A (2 unseen passages of 10M each), Section B (Grammar 10M + Creative Writing 10M with internal choice), Section C (Extract-based & short/long literature answers 40M).",
    },
    Hindi: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Section A: अपठित बोध (14M) | Section B: व्यावहारिक व्याकरण (16M) | Section C: पाठ्यपुस्तक (30M) | Section D: रचनात्मक लेखन (20M)",
      guidelines:
        "4 sections in Hindi Devanagari: Unseen passages (14M), Grammar MCQs/short Qs (16M), Literature prose & poetry (30M), Creative Writing (letter, paragraph, advertisement 20M).",
    },
    Bengali: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Section A: বোধপরীক্ষণ (12M) | Section B: ব্যাকরণ (18M) | Section C: সাহিত্য (30M) | Section D: নির্মিতি (20M)",
      guidelines:
        "4 sections in Bengali script: Reading comprehension (12M), Grammar (18M), Textbook prose/poetry/supplementary (30M), Composition & letter writing (20M).",
    },
    Science: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 16 MCQ + 4 A-R (20M) | Sec B: 6 VSA (12M) | Sec C: 7 SA (21M) | Sec D: 3 LA (15M) | Sec E: 3 Case-Study (12M)",
      guidelines:
        "39 questions across 5 sections (Physics, Chemistry, Biology): Sec A (20x1M incl. 4 Assertion-Reason), Sec B (6x2M), Sec C (7x3M), Sec D (3x5M), Sec E (3x4M Case-Study).",
    },
    "Mathematics Standard": {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 18 MCQ + 2 A-R (20M) | Sec B: 5 VSA (10M) | Sec C: 6 SA (18M) | Sec D: 4 LA (20M) | Sec E: 3 Case-Study (12M)",
      guidelines:
        "38 questions across 5 sections: Sec A (20x1M incl. 2 Assertion-Reason), Sec B (5x2M), Sec C (6x3M), Sec D (4x5M), Sec E (3x4M Case-Study with sub-parts).",
    },
    "Social Science": {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 20 MCQ (20M) | Sec B: 4 VSA (8M) | Sec C: 5 SA (15M) | Sec D: 4 LA (20M) | Sec E: 3 Case-Study (12M) + Map (5M)",
      guidelines:
        "37 questions covering History, Geography, Political Science, Economics: Sec A (20x1M), Sec B (4x2M), Sec C (5x3M), Sec D (4x5M), Sec E (3x4M Case-Study and one 5M Map Work question).",
    },
    "Information Technology": {
      maxMarks: 50,
      time: "2 Hours",
      pattern: "Sec A: Objective Type / Employability + Subject Skills (24M) | Sec B: Subjective Type VSA/SA/LA (26M)",
      guidelines:
        "NSQF Code 402 (50 Marks, 2 Hours): Sec A (24x1M Objective/MCQ questions across Employability & IT Skills), Sec B (Short & Long Answer questions totaling 26M).",
    },
  },
  "Class 12": {
    English: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: Reading Skills (22M) | Sec B: Creative Writing (18M) | Sec C: Literature (40M)",
      guidelines:
        "3 sections: Sec A (2 unseen passages 12M+10M), Sec B (Notice/Invitation, Letter/Application, Article/Report 18M), Sec C (Flamingo & Vistas extracts + short/long Qs 40M).",
    },
    History: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 21 MCQ (21M) | Sec B: 6 SA (18M) | Sec C: 3 LA (24M) | Sec D: 3 Source-Based (12M) | Sec E: Map (5M)",
      guidelines:
        "34 questions: Sec A (21x1M MCQs), Sec B (6x3M Short Answer), Sec C (3x8M Long Answer), Sec D (3x4M Source-Based), Sec E (5M Map Work).",
    },
    Physics: {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 12 MCQ + 4 A-R (16M) | Sec B: 5 VSA (10M) | Sec C: 7 SA (21M) | Sec D: 2 Case-Study (8M) | Sec E: 3 LA (15M)",
      guidelines:
        "33 questions (70 Marks): Sec A (16x1M incl. 4 Assertion-Reason), Sec B (5x2M), Sec C (7x3M), Sec D (2x4M Case-Study), Sec E (3x5M Long Answer).",
    },
    Chemistry: {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 12 MCQ + 4 A-R (16M) | Sec B: 5 VSA (10M) | Sec C: 7 SA (21M) | Sec D: 2 Case-Study (8M) | Sec E: 3 LA (15M)",
      guidelines:
        "33 questions (70 Marks): Sec A (16x1M incl. 4 Assertion-Reason), Sec B (5x2M), Sec C (7x3M), Sec D (2x4M Case-Study), Sec E (3x5M Long Answer).",
    },
    Biology: {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 12 MCQ + 4 A-R (16M) | Sec B: 5 VSA (10M) | Sec C: 7 SA (21M) | Sec D: 2 Case-Study (8M) | Sec E: 3 LA (15M)",
      guidelines:
        "33 questions (70 Marks): Sec A (16x1M incl. 4 Assertion-Reason), Sec B (5x2M), Sec C (7x3M), Sec D (2x4M Case-Study), Sec E (3x5M Long Answer).",
    },
    "Mathematics Standard": {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 18 MCQ + 2 A-R (20M) | Sec B: 5 VSA (10M) | Sec C: 6 SA (18M) | Sec D: 4 LA (20M) | Sec E: 3 Case-Study (12M)",
      guidelines:
        "38 questions (80 Marks): Sec A (20x1M incl. 2 Assertion-Reason), Sec B (5x2M), Sec C (6x3M), Sec D (4x5M), Sec E (3x4M Case-Study).",
    },
    Geography: {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 17 MCQ (17M) | Sec B: 2 Source-Based (6M) | Sec C: 4 SA (12M) | Sec D: 5 LA (25M) | Sec E: Map (10M)",
      guidelines:
        "30 questions (70 Marks): Sec A (17x1M MCQs), Sec B (2x3M Source-Based), Sec C (4x3M Short Answer), Sec D (5x5M Long Answer), Sec E (World & India Map 10M).",
    },
    Hindi: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: अपठित बोध (18M) | Sec B: अभिव्यक्ति और माध्यम (22M) | Sec C: पाठ्यपुस्तक (40M)",
      guidelines:
        "3 sections in Hindi Devanagari: Unseen prose/poetry (18M), Creative Writing & Journalism (22M), Antra/Aroh & Vitan/Antral literature questions (40M).",
    },
    Bengali: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: বোধপরীক্ষণ (15M) | Sec B: ব্যাকরণ ও নির্মিতি (25M) | Sec C: সাহিত্য (40M)",
      guidelines:
        "3 sections in Bengali script: Reading comprehension (15M), Grammar & Essay/Report writing (25M), Prose, Poetry & Drama (40M).",
    },
    "Physical Education": {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 18 MCQ (18M) | Sec B: 5 VSA (10M) | Sec C: 5 SA (15M) | Sec D: 3 Case-Study (12M) | Sec E: 3 LA (15M)",
      guidelines:
        "37 questions (70 Marks): Sec A (18x1M MCQs incl. Assertion-Reason), Sec B (5x2M), Sec C (5x3M), Sec D (3x4M Case-Study), Sec E (3x5M Long Answer).",
    },
    "Computer Science": {
      maxMarks: 70,
      time: "3 Hours",
      pattern: "Sec A: 21 MCQ/A-R (21M) | Sec B: 7 VSA (14M) | Sec C: 3 SA (9M) | Sec D: 4 LA (16M) | Sec E: 2 Case-Study (10M)",
      guidelines:
        "37 questions (70 Marks, Python & SQL): Sec A (21x1M), Sec B (7x2M), Sec C (3x3M), Sec D (4x4M), Sec E (2x5M Case-Study).",
    },
    "Information Technology": {
      maxMarks: 60,
      time: "3 Hours",
      pattern: "Sec A: Objective Type / Employability + IT Skills (30M) | Sec B: Subjective VSA/SA/LA (30M)",
      guidelines:
        "NSQF Code 802 (60 Marks, 3 Hours): Sec A (30x1M Objective/MCQ across Employability & Database/Java/Web), Sec B (Short & Long Answer questions totaling 30M).",
    },
    "Political Science": {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 12 MCQ (12M) | Sec B: 6 VSA (12M) | Sec C: 5 SA (20M) | Sec D: 3 Passage/Cartoon (12M) | Sec E: 4 LA (24M)",
      guidelines:
        "30 questions (80 Marks): Sec A (12x1M MCQs), Sec B (6x2M), Sec C (5x4M), Sec D (3x4M Passage/Cartoon/Map), Sec E (4x6M Long Answer).",
    },
    "Business Studies": {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: 20 MCQ (20M) | Sec B: 4 SA-I (12M) | Sec C: 6 SA-II (24M) | Sec D: 4 LA (24M)",
      guidelines:
        "34 questions (80 Marks): Sec A (20x1M MCQs), Sec B (4x3M), Sec C (6x4M), Sec D (4x6M Long Answer / Case-based).",
    },
    Accountancy: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Part A: Partnership & Company Accounts (60M) | Part B: Financial Statement Analysis (20M)",
      guidelines:
        "34 questions (80 Marks): 20x1M MCQs, 6x3M Short Answer, 3x4M Medium Answer, 5x6M Long Answer across Partnership, Shares/Debentures & Cash Flow.",
    },
    Economics: {
      maxMarks: 80,
      time: "3 Hours",
      pattern: "Sec A: Macroeconomics (40M) | Sec B: Indian Economic Development (40M)",
      guidelines:
        "34 questions (80 Marks): 20x1M MCQs (10 per part), 4x3M, 6x4M, and 4x6M Long Answer equally split between Macroeconomics and Indian Economic Development.",
    },
  },
} as const satisfies Record<string, Record<string, Blueprint>>;

export type BlueprintClass = keyof typeof BLUEPRINTS;
export const BLUEPRINT_CLASSES = Object.keys(BLUEPRINTS) as BlueprintClass[];

/** The Subjects with a Blueprint for a Class, in the order to list them. */
export function blueprintSubjects(classLevel: BlueprintClass): string[] {
  return Object.keys(BLUEPRINTS[classLevel]);
}

export function findBlueprint(classLevel: string, subject: string): Blueprint | undefined {
  const forClass: Record<string, Blueprint> | undefined = (BLUEPRINTS as Record<string, Record<string, Blueprint>>)[classLevel];
  return forClass && Object.hasOwn(forClass, subject) ? forClass[subject] : undefined;
}

/** Whether Questions of this Class and Subject carry a Science Division. */
export function usesScienceDivisions(classLevel: string, subject: string): boolean {
  return (classLevel === "Class 9" || classLevel === "Class 10") && subject === "Science";
}

export const DIFFICULTIES = ["easy", "standard", "challenging"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const FOCUS_MAX_LENGTH = 300;

/** What the app sends to POST /api/generate. Nothing else leaves the device. */
export const generateRequestSchema = z
  .object({
    classLevel: z.enum(BLUEPRINT_CLASSES as [BlueprintClass, ...BlueprintClass[]]),
    subject: z.string().max(60),
    focus: z.string().trim().max(FOCUS_MAX_LENGTH).default(""),
    difficulty: z.enum(DIFFICULTIES).optional(),
    /** The Turnstile bot-check token. */
    turnstileToken: z.string().min(1).max(2048),
  })
  .refine((request) => findBlueprint(request.classLevel, request.subject) !== undefined, {
    message: "No Blueprint for this Class and Subject",
    path: ["subject"],
  });

export type GenerateRequest = z.input<typeof generateRequestSchema>;

/** Why a Paper could not be generated. */
export const GENERATE_ERRORS = ["bad-request", "bot-check", "rate-limit", "daily-limit", "failed"] as const;
export type GenerateError = (typeof GENERATE_ERRORS)[number];

export type GenerateResponse =
  | {
      ok: true;
      paper: Paper;
      /** The Blueprint's total and what the Questions add up to. They differ when the AI got the marks wrong twice. */
      marks: { expected: number; actual: number };
    }
  | { ok: false; error: GenerateError; message: string };
