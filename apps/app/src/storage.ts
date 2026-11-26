// The current Paper and the Question Bank, kept in the browser's storage on
// this device. The keys are the ones the old app used, so a teacher's work
// carries over.

import { parsePaper, type Paper } from "@prashna/paper";
import { readBankQuestion, type Bank, type BankItem } from "./bank.ts";

const PAPER_KEY = "cbse_paper_designer_v16";
const BANK_KEY = "cbse_question_bank_v1";

/** The stored Paper, or null if there is none or it can't be read. */
export function loadPaper(): Paper | null {
  try {
    const raw = localStorage.getItem(PAPER_KEY);
    if (!raw) return null;
    const result = parsePaper(JSON.parse(raw));
    return result.ok ? result.paper : null;
  } catch {
    return null;
  }
}

/** Stores the Paper. Returns false when storage is unavailable or full. */
export function savePaper(paper: Paper): boolean {
  try {
    localStorage.setItem(PAPER_KEY, JSON.stringify(paper));
    return true;
  } catch {
    return false;
  }
}

/** The stored Question Bank, or null if there is none or it can't be read. */
export function loadBank(): Bank | null {
  try {
    const raw = localStorage.getItem(BANK_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as { bank?: unknown }).bank)) return null;
    const { bank, nextBankId } = parsed as { bank: unknown[]; nextBankId?: unknown };
    const items: BankItem[] = [];
    let maxId = 0;
    for (const entry of bank) {
      const question = readBankQuestion(entry);
      if (!question) continue;
      const raw = entry as { bankId?: unknown; source?: unknown };
      const bankId = typeof raw.bankId === "number" ? raw.bankId : 0;
      maxId = Math.max(maxId, bankId);
      items.push({ ...question, bankId, ...(raw.source === "starter" ? { source: "starter" as const } : {}) });
    }
    return { items, nextBankId: Math.max(typeof nextBankId === "number" ? nextBankId : 200, maxId + 1) };
  } catch {
    return null;
  }
}

export function saveBank(bank: Bank): void {
  try {
    localStorage.setItem(BANK_KEY, JSON.stringify({ bank: bank.items, nextBankId: bank.nextBankId }));
  } catch {
    // The Bank still works for this visit.
  }
}
