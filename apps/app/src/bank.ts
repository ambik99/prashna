// The Question Bank: the teacher's saved Questions, kept on this device.

import { QUESTION_TYPES, SCIENCE_DIVISIONS, SECTIONS, type Question } from "@prashna/paper";

/** A Question saved in the Question Bank. Starter Questions are marked "starter". */
export type BankItem = Omit<Question, "id" | "division"> & {
  bankId: number;
  division?: Question["division"];
  source?: "starter";
};

export interface Bank {
  items: BankItem[];
  nextBankId: number;
}

const oneOf = <T extends string>(list: readonly T[], value: unknown, fallback: T): T =>
  list.includes(value as T) ? (value as T) : fallback;
const text = (value: unknown) => (typeof value === "string" ? value : "");
const texts = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);

/**
 * Reads a Question from a stored Bank or a question file, filling what is
 * missing. Returns null for anything with neither text nor an assertion.
 */
export function readBankQuestion(item: unknown): Omit<BankItem, "bankId" | "source"> | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, unknown>;
  if (!raw.text && !raw.assertion) return null;
  return {
    section: oneOf(SECTIONS, raw.section, "Section A"),
    division: oneOf(["", ...SCIENCE_DIVISIONS] as const, raw.division, ""),
    type: oneOf(QUESTION_TYPES, raw.type, "standard"),
    text: text(raw.text),
    options: texts(raw.options),
    subQuestions: texts(raw.subQuestions),
    assertion: text(raw.assertion),
    reason: text(raw.reason),
    imageData: text(raw.imageData),
    orText: text(raw.orText),
    answer: text(raw.answer),
    marks: Number(raw.marks) || 1,
  };
}

/** A Paper Question as a new Bank entry. */
export function toBankItem(question: Question, bankId: number): BankItem {
  const { id: _id, ...rest } = question;
  return { ...rest, options: [...question.options], subQuestions: [...question.subQuestions], bankId };
}

/** A Bank entry as a new Paper Question. */
export function fromBankItem(item: BankItem, id: number): Question {
  const { bankId: _bankId, source: _source, ...rest } = item;
  return { ...rest, division: item.division ?? "", options: [...item.options], subQuestions: [...item.subQuestions], id };
}

/** What the Question Bank's search looks through. */
export function matchesSearch(item: BankItem, query: string): boolean {
  if (!query) return true;
  return [item.section, item.text, item.assertion, item.reason, item.answer].join(" ").toLowerCase().includes(query);
}
