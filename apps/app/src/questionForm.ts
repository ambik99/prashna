// The Add / Edit Question form: its fields, how a Question fills it, and how
// it becomes a Question.

import { SECTIONS, type PaperMeta, type Question, type QuestionType, type ScienceDivision, type Section } from "@prashna/paper";
import { scienceDivisionsActive } from "./paperView.ts";

export interface QuestionForm {
  section: Section;
  /** As typed; checked when the Question is added. */
  marks: string;
  division: ScienceDivision;
  type: QuestionType;
  text: string;
  assertion: string;
  reason: string;
  options: [string, string, string, string];
  /** One sub-question per line. */
  subQuestions: string;
  imageData: string;
  hasOr: boolean;
  orText: string;
  answer: string;
}

/** The fields Quick Insert can type into. */
export type TypingField = "text" | "assertion" | "reason" | "optA" | "optB" | "optC" | "optD" | "subQuestions" | "orText" | "answer";

export const OPTION_FIELDS = ["optA", "optB", "optC", "optD"] as const;

export const EMPTY_FORM: QuestionForm = {
  section: "Section A",
  marks: "1",
  division: "Physics",
  type: "standard",
  text: "",
  assertion: "",
  reason: "",
  options: ["", "", "", ""],
  subQuestions: "",
  imageData: "",
  hasOr: false,
  orText: "",
  answer: "",
};

export function fieldValue(form: QuestionForm, field: TypingField): string {
  const option = OPTION_FIELDS.indexOf(field as (typeof OPTION_FIELDS)[number]);
  return option >= 0 ? form.options[option]! : (form[field as Exclude<TypingField, (typeof OPTION_FIELDS)[number]>] as string);
}

export function withField(form: QuestionForm, field: TypingField, value: string): QuestionForm {
  const option = OPTION_FIELDS.indexOf(field as (typeof OPTION_FIELDS)[number]);
  if (option < 0) return { ...form, [field]: value };
  const options = [...form.options] as QuestionForm["options"];
  options[option] = value;
  return { ...form, options };
}

/** Clears what was typed, keeping the Section, Marks, Division and type. */
export function clearedForm(form: QuestionForm): QuestionForm {
  return {
    ...form,
    text: "",
    assertion: "",
    reason: "",
    options: ["", "", "", ""],
    subQuestions: "",
    imageData: "",
    hasOr: false,
    orText: "",
    answer: "",
  };
}

/** The form showing a Question to edit. */
export function formForQuestion(form: QuestionForm, q: Question): QuestionForm {
  return {
    ...form,
    section: q.section,
    division: q.division || form.division,
    marks: String(q.marks),
    type: q.type,
    text: q.text,
    assertion: q.assertion,
    reason: q.reason,
    options: [q.options[0] ?? "", q.options[1] ?? "", q.options[2] ?? "", q.options[3] ?? ""],
    subQuestions: q.subQuestions.join("\n"),
    imageData: q.imageData,
    hasOr: Boolean(q.orText),
    orText: q.orText,
    answer: q.answer,
  };
}

/** Marks follow the Section's marks per question, except while editing. */
export function withSectionMarks(form: QuestionForm, meta: PaperMeta, editing: boolean): QuestionForm {
  if (editing) return form;
  const preset = meta.sectionMarks[form.section];
  return preset > 0 ? { ...form, marks: String(preset) } : form;
}

/**
 * Keeps the form in step with the Paper Details: a single Science Division
 * Paper's Questions take that division, and a Section that goes out of use
 * gives way to the first Section in use.
 */
export function followPaper(form: QuestionForm, meta: PaperMeta, editing: boolean): QuestionForm {
  let next = form;
  if (scienceDivisionsActive(meta) && meta.divisionMode !== "Combined" && next.division !== meta.divisionMode) {
    next = { ...next, division: meta.divisionMode };
  }
  if (meta.sectionCounts[next.section] === 0) {
    const first = SECTIONS.find((section) => meta.sectionCounts[section] > 0);
    if (first) next = withSectionMarks({ ...next, section: first }, meta, editing);
  }
  return next;
}

/** The Question the form describes, or null if something required is missing. */
export function questionFromForm(form: QuestionForm, id: number, meta: PaperMeta): Question | null {
  const text = form.text.trim();
  const marks = Number(form.marks);
  const assertion = form.assertion.trim();
  const reason = form.reason.trim();
  const options = form.options.map((option) => option.trim());
  const subQuestions = form.subQuestions
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const orText = form.hasOr ? form.orText.trim() : "";
  const { type } = form;

  const missingMain = type !== "ar" && !text;
  const missingAr = type === "ar" && (!assertion || !reason);
  const missingMcq = type === "mcq" && options.some((option) => !option);
  const missingCase = type === "case" && subQuestions.length === 0;
  const missingOr = form.hasOr && !orText;
  // Empty or non-numeric marks are NaN, like the old app's Number(""), which was 0.
  const badMarks = form.marks.trim() === "" || Number.isNaN(marks) || marks < 1 || marks > 20;
  if (missingMain || missingAr || badMarks || missingMcq || missingCase || missingOr) return null;

  return {
    id,
    section: form.section,
    division: scienceDivisionsActive(meta) ? form.division : "",
    type,
    text: type === "ar" ? "" : text,
    assertion: type === "ar" ? assertion : "",
    reason: type === "ar" ? reason : "",
    options: type === "mcq" ? options : [],
    subQuestions: type === "case" ? subQuestions : [],
    imageData: form.imageData,
    orText,
    answer: form.answer.trim(),
    marks,
  };
}
