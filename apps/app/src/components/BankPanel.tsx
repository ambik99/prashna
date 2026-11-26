// The Question Bank: a slide-out panel beside the editor, with Starter
// Questions and Import from Link.

import { useRef, useState, type Ref } from "react";
import { readBankQuestion, matchesSearch, type BankItem } from "../bank.ts";
import { STARTER_QUESTIONS, STARTER_SUBJECTS } from "../content.ts";

type Tone = "error" | "ok" | undefined;
type Status = { text: string; tone: Tone };
const TONE_COLOR = { error: "var(--color-danger)", ok: "var(--color-success)" };
const statusStyle = (status: Status | null) =>
  status ? { color: status.tone ? TONE_COLOR[status.tone] : "var(--color-text-muted)" } : undefined;

interface Props {
  open: boolean;
  items: BankItem[];
  searchRef: Ref<HTMLInputElement>;
  onClose: () => void;
  onInsert: (item: BankItem) => void;
  onDelete: (item: BankItem) => void;
  /** Adds Questions to the top of the Bank, the last one first. */
  onAdd: (questions: Omit<BankItem, "bankId">[]) => void;
}

export function BankPanel({ open, items, searchRef, onClose, onInsert, onDelete, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [starterClass, setStarterClass] = useState("Class 10");
  const subjects = STARTER_SUBJECTS[starterClass] ?? [];
  const [starterSubject, setStarterSubject] = useState(subjects[0] ?? "");
  const [starterStatus, setStarterStatus] = useState<Status | null>(null);
  const [link, setLink] = useState("");
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<Status | null>(null);
  const linkInput = useRef<HTMLInputElement>(null);

  const search = query.trim().toLowerCase();
  const shown = items.filter((item) => matchesSearch(item, search));

  function addStarterQuestions() {
    const starter = STARTER_QUESTIONS[`${starterClass}|${starterSubject}`] ?? [];
    onAdd(starter.map((question) => ({ ...question, source: "starter" as const })));
    const noun = starter.length === 1 ? " Starter Question" : " Starter Questions";
    setStarterStatus({
      text: `Added ${starter.length}${noun} for ${starterClass} ${starterSubject} to your Question Bank.`,
      tone: "ok",
    });
  }

  async function importFromLink() {
    const address = link.trim();
    if (!address) {
      setImportStatus({ text: "Paste the web address of a question file first.", tone: "error" });
      linkInput.current?.focus();
      return;
    }
    setImporting(true);
    setImportStatus({ text: "Importing…", tone: undefined });

    let list: unknown[];
    try {
      const response = await fetch(address);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: unknown = await response.json();
      const questions = (data as { questions?: unknown } | null)?.questions;
      list = Array.isArray(data) ? data : Array.isArray(questions) ? questions : [];
    } catch {
      setImportStatus({
        text: "Couldn't import from that link. Check the address and your connection; the site sharing the file must also allow downloads from other websites.",
        tone: "error",
      });
      setImporting(false);
      return;
    }

    const questions = list.map(readBankQuestion).filter((q) => q !== null);
    if (questions.length === 0) {
      setImportStatus({ text: "That link didn't contain any Questions Prashna can read.", tone: "error" });
    } else {
      onAdd(questions);
      setImportStatus({
        text: `Imported ${questions.length}${questions.length === 1 ? " Question" : " Questions"} from the link.`,
        tone: "ok",
      });
    }
    setImporting(false);
  }

  return (
    <aside id="bankPanel" className="bank-panel" aria-labelledby="bankPanelTitle" hidden={!open}>
      <div className="bank-panel-head">
        <h2 id="bankPanelTitle">Question Bank</h2>
        <button type="button" id="bankCloseBtn" className="btn-icon bank-close" aria-label="Close Question Bank" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="bank-panel-body">
        <input
          type="search"
          id="bankSearchInput"
          ref={searchRef}
          placeholder="Search saved questions..."
          aria-label="Search Question Bank"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div id="bankList" className="bank-list">
          {shown.length === 0 ? (
            <p className="bank-empty">
              {search
                ? "No saved questions match your search."
                : 'Your Question Bank is empty. Click "+ Bank" on any question to save it here.'}
            </p>
          ) : (
            shown.map((item) => {
              const typeLabel = item.type === "ar" ? "Assertion-Reason" : item.type.toUpperCase();
              const preview = item.type === "ar" ? `A: ${item.assertion}` : item.text;
              return (
                <div key={item.bankId} className="bank-card">
                  <div className="bank-meta">
                    {`${item.section} • ${typeLabel} • ${item.marks}${item.marks === 1 ? " Mark" : " Marks"}`}
                    {item.source === "starter" && <span className="bank-builtin">Built in</span>}
                  </div>
                  <div className="bank-text">{preview.length > 100 ? `${preview.slice(0, 100)}...` : preview}</div>
                  <div className="bank-actions">
                    <button type="button" className="btn-edit" onClick={() => onInsert(item)}>
                      + Insert
                    </button>
                    <button type="button" className="btn-remove" onClick={() => onDelete(item)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <section className="bank-source" aria-labelledby="starterTitle">
          <h3 id="starterTitle">Starter Questions</h3>
          <p className="bank-source-note">Built-in Questions for Class 10 and Class 12, added to your Question Bank.</p>
          <div className="field-row">
            <div>
              <label htmlFor="fetchClassSelect">Class</label>
              <select
                id="fetchClassSelect"
                aria-label="Class for Starter Questions"
                value={starterClass}
                onChange={(e) => {
                  setStarterClass(e.target.value);
                  setStarterSubject(STARTER_SUBJECTS[e.target.value]?.[0] ?? "");
                }}
              >
                {Object.keys(STARTER_SUBJECTS).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fetchSubjectSelect">Subject</label>
              <select
                id="fetchSubjectSelect"
                aria-label="Subject for Starter Questions"
                value={starterSubject}
                onChange={(e) => setStarterSubject(e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" id="starterBtn" className="btn-toggle bank-source-btn" onClick={addStarterQuestions}>
            Add Starter Questions
          </button>
          <p id="starterStatus" className="fetch-status" role="status" style={statusStyle(starterStatus)}>
            {starterStatus?.text}
          </p>
        </section>

        <section className="bank-source bank-source-small" aria-labelledby="importTitle">
          <h3 id="importTitle">Import from Link</h3>
          <label htmlFor="fetchUrlInput">Web address of a question file</label>
          <div className="import-row">
            <input
              type="url"
              id="fetchUrlInput"
              ref={linkInput}
              placeholder="https://..."
              inputMode="url"
              autoComplete="off"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void importFromLink();
              }}
            />
            <button type="button" id="importLinkBtn" className="btn-reset" disabled={importing} onClick={() => void importFromLink()}>
              Import
            </button>
          </div>
          <p id="importStatus" className="fetch-status" role="status" style={statusStyle(importStatus)}>
            {importStatus?.text}
          </p>
        </section>
      </div>
    </aside>
  );
}
