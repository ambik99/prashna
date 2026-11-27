// Prashna's editor: the Paper, the Add Question form, the Question Bank and
// the layout around them. Every change to the Paper is saved on this device
// straight away.

import { DEFAULT_META, parsePaper, type Paper, type PaperMeta, type Question, type Section } from "@prashna/paper";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { flushSync } from "react-dom";
import { fromBankItem, toBankItem, type Bank, type BankItem } from "./bank.ts";
import { BankPanel } from "./components/BankPanel.tsx";
import { useConfirm } from "./components/ConfirmDialog.tsx";
import { GenerateDialog, type GeneratedPaper } from "./components/GenerateDialog.tsx";
import { Header, type SaveStatus } from "./components/Header.tsx";
import { PaperPreview } from "./components/PaperPreview.tsx";
import { PaperDetailsStep, SectionsStep } from "./components/PaperSetup.tsx";
import { QuestionStep } from "./components/QuestionStep.tsx";
import { SummaryBar } from "./components/SummaryBar.tsx";
import { TabBar, type View } from "./components/TabBar.tsx";
import { UpdateNotice } from "./components/UpdateNotice.tsx";
import { SAMPLE_BANK, SAMPLE_QUESTIONS, TEMPLATES } from "./content.ts";
import { download, fileName, loadPaperCss, paperHeader, wordDocument } from "./paperView.ts";
import {
  EMPTY_FORM,
  clearedForm,
  fieldValue,
  followPaper,
  formForQuestion,
  questionFromForm,
  withField,
  withSectionMarks,
  type QuestionForm,
  type TypingField,
} from "./questionForm.ts";
import * as storage from "./storage.ts";
import { usePhone } from "./usePhone.ts";

function readPaper(input: unknown): Paper {
  const result = parsePaper(input);
  if (!result.ok) throw new Error(result.message);
  return result.paper;
}

const samplePaper = () => readPaper({ meta: DEFAULT_META, questions: SAMPLE_QUESTIONS, nextId: 4 });

function templatePaper(key: string): Paper | null {
  const template = TEMPLATES.find((t) => t.key === key);
  if (!template) return null;
  return readPaper({ meta: template.meta, questions: template.questions, nextId: template.questions.length + 1 });
}

const AUTO_SAVED: SaveStatus = { text: "Auto-saved", color: "var(--color-success)" };

export function App() {
  const confirm = useConfirm();
  const phone = usePhone();

  // The Paper and the Question Bank, mirrored in refs so handlers always see
  // the latest even between renders.
  const [paper, setPaperState] = useState<Paper>(() => storage.loadPaper() ?? samplePaper());
  const paperRef = useRef(paper);
  const [bank, setBankState] = useState<Bank>(() => storage.loadBank() ?? { items: SAMPLE_BANK, nextBankId: 103 });
  const bankRef = useRef(bank);
  const [status, setStatus] = useState<SaveStatus>({ text: "Auto-saved" });

  const [form, setFormState] = useState<QuestionForm>(() => followPaper(EMPTY_FORM, paper.meta, false));
  const formRef = useRef(form);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editingIdRef = useRef(editingId);
  editingIdRef.current = editingId;
  const [showError, setShowError] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);

  const [view, setView] = useState<View>("editor");
  const [moreOpen, setMoreOpenState] = useState(false);
  const [bankOpen, setBankOpenState] = useState(false);
  const [addStepOpen, setAddStepOpen] = useState(true);
  const [generateOpen, setGenerateOpen] = useState(false);

  const header = useRef<HTMLElement>(null);
  const bankToggle = useRef<HTMLButtonElement>(null);
  const bankSearch = useRef<HTMLInputElement>(null);

  const setForm = useCallback((next: QuestionForm) => {
    formRef.current = next;
    setFormState(next);
  }, []);

  /** Shows and saves a new version of the Paper. */
  const commitPaper = useCallback(
    (next: Paper, nextStatus?: SaveStatus) => {
      paperRef.current = next;
      setPaperState(next);
      const saved = storage.savePaper(next);
      setStatus(nextStatus ?? (saved ? AUTO_SAVED : { text: "Session only" }));
      setForm(followPaper(formRef.current, next.meta, editingIdRef.current !== null));
    },
    [setForm],
  );
  const commitBank = useCallback((next: Bank) => {
    bankRef.current = next;
    setBankState(next);
    storage.saveBank(next);
  }, []);

  const updateMeta = (patch: Partial<PaperMeta>) => {
    const current = paperRef.current;
    commitPaper({ ...current, meta: { ...current.meta, ...patch } });
  };

  // Layout -------------------------------------------------------------------

  const setMoreOpen = useCallback((open: boolean, { returnFocus = false }: { returnFocus?: boolean } = {}) => {
    setMoreOpenState(open);
    if (!open && returnFocus) document.getElementById("moreBtn")?.focus();
  }, []);

  const setBankOpen = useCallback(
    (open: boolean, { returnFocus = false }: { returnFocus?: boolean } = {}) => {
      flushSync(() => setBankOpenState(open));
      if (open) {
        // The panel opens below the top bar.
        document.documentElement.style.setProperty("--topbar-height", `${header.current?.offsetHeight ?? 0}px`);
        // On a phone, focusing search would pop the keyboard over the list.
        if (!phone) bankSearch.current?.focus();
      } else if (returnFocus && !phone) {
        bankToggle.current?.focus();
      }
    },
    [phone],
  );

  useEffect(() => {
    document.body.classList.toggle("sheet-open", moreOpen && phone);
    document.body.classList.toggle("bank-open", bankOpen);
  }, [moreOpen, bankOpen, phone]);

  // Escape closes the More menu, or else the Question Bank.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (moreOpen) setMoreOpen(false, { returnFocus: true });
      else if (bankOpen) setBankOpen(false, { returnFocus: true });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [moreOpen, bankOpen, setMoreOpen, setBankOpen]);

  const chooseView = (next: View) => {
    setView(next);
    setBankOpen(false);
    window.scrollTo({ top: 0 });
  };

  // The Paper ----------------------------------------------------------------

  async function loadTemplate(key: string, name: string) {
    const ok = await confirm({
      title: "Load this Template?",
      message: `“${name}” will replace your current Paper. Save your current Paper first if you want to keep it.`,
      confirmLabel: "Replace Paper",
    });
    const next = ok ? templatePaper(key) : null;
    if (next) replacePaper(next);
  }

  /** Loads an AI Generated Paper, as a Template is. The school stays the teacher's own. */
  async function loadGenerated({ paper: generated, marks }: GeneratedPaper) {
    const { classLevel, subject } = generated.meta;
    const ok = await confirm({
      title: "Load this AI Generated Paper?",
      message: `“${classLevel} ${subject}” will replace your current Paper. Save your current Paper first if you want to keep it.`,
      confirmLabel: "Replace Paper",
    });
    if (!ok) return;
    const school = paperRef.current.meta.school;
    setGenerateOpen(false);
    replacePaper(
      { ...generated, meta: { ...generated.meta, school } },
      marks.actual === marks.expected
        ? { text: "AI Generated Paper loaded", color: "var(--color-accent)" }
        : { text: `AI Paper: ${marks.actual} of ${marks.expected} marks`, color: "var(--color-warning)" },
    );
  }

  /** A whole new Paper (Template, file, Reset): any edit in progress ends. */
  function replacePaper(next: Paper, nextStatus?: SaveStatus) {
    endEdit();
    commitPaper(next, nextStatus);
  }

  function savePaperFile() {
    download([JSON.stringify(paperRef.current, null, 2)], "application/json", fileName(paperRef.current.meta, "json"));
  }

  async function exportWord() {
    const current = paperRef.current;
    const html = wordDocument(current, showMarkingScheme, await loadPaperCss());
    download(["﻿", html], "application/msword", fileName(current.meta, "doc"));
  }

  function loadPaperFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch {
        parsed = undefined;
      }
      input.value = "";
      if (parsed === undefined) {
        setStatus({ text: "Could not read JSON", color: "var(--color-danger)" });
        return;
      }
      const result = parsePaper(parsed);
      if (!result.ok) {
        setStatus({ text: "Invalid paper file", color: "var(--color-danger)" });
        return;
      }
      // A Paper file replaces the current Paper, so ask first.
      const ok = await confirm({
        title: "Load this Paper?",
        message: `“${file.name}” will replace your current Paper. Save your current Paper first if you want to keep it.`,
        confirmLabel: "Replace Paper",
      });
      if (ok) replacePaper(result.paper, { text: "Loaded from file", color: "var(--color-accent)" });
    };
    reader.readAsText(file);
  }

  async function resetSample() {
    const ok = await confirm({
      title: "Reset to the sample Paper?",
      message: "Your current Paper will be replaced by the sample Paper. Save your current Paper first if you want to keep it.",
      confirmLabel: "Reset Paper",
    });
    const next = ok ? templatePaper("sample") : null;
    if (next) replacePaper(next);
  }

  function printMarkingScheme() {
    const previous = showMarkingScheme;
    flushSync(() => setShowMarkingScheme(true));
    const restore = () => {
      setShowMarkingScheme(previous);
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  // Questions on the Paper -----------------------------------------------------

  /** Moves a Question up or down among its Section's Questions. */
  function moveQuestion(id: number, direction: -1 | 1) {
    const current = paperRef.current;
    const target = current.questions.find((q) => q.id === id);
    if (!target) return;
    const inSection = current.questions.flatMap((q, i) => (q.section === target.section ? [i] : []));
    const position = inSection.indexOf(current.questions.indexOf(target));
    const a = inSection[position];
    const b = inSection[position + direction];
    if (a === undefined || b === undefined) return;
    const questions = [...current.questions];
    [questions[a], questions[b]] = [questions[b]!, questions[a]!];
    commitPaper({ ...current, questions });
  }

  function startEdit(id: number) {
    const question = paperRef.current.questions.find((q) => q.id === id);
    if (!question) return;
    flushSync(() => {
      setEditingId(id);
      setShowError(false);
      setForm(formForQuestion(formRef.current, question));
      setView("editor");
      setAddStepOpen(true);
      if (phone) setBankOpenState(false);
    });
    // Bring the Add Question step into view.
    requestAnimationFrame(() => {
      document.querySelector('[aria-controls="stepAddQuestion"]')?.scrollIntoView({
        block: "start",
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }

  function endEdit() {
    setEditingId(null);
    editingIdRef.current = null;
    setShowError(false);
    setForm(clearedForm(formRef.current));
  }

  async function removeQuestion(question: Question, number: number) {
    const ok = await confirm({
      title: "Remove this Question?",
      message: `Question ${number} will be removed from the Paper.`,
      confirmLabel: "Remove Question",
    });
    if (!ok) return;
    if (editingIdRef.current === question.id) endEdit();
    const current = paperRef.current;
    commitPaper({ ...current, questions: current.questions.filter((q) => q.id !== question.id) });
  }

  function submitQuestion() {
    const current = paperRef.current;
    const editing = editingIdRef.current;
    const question = questionFromForm(formRef.current, editing ?? current.nextId, current.meta);
    if (!question) {
      setShowError(true);
      return;
    }
    const next =
      editing !== null
        ? { ...current, questions: current.questions.map((q) => (q.id === editing ? question : q)) }
        : { ...current, questions: [...current.questions, question], nextId: current.nextId + 1 };
    endEdit();
    commitPaper(next);
  }

  const changeForm = (patch: Partial<QuestionForm>) => setForm({ ...formRef.current, ...patch });

  const changeSection = (section: Section) =>
    setForm(withSectionMarks({ ...formRef.current, section }, paperRef.current.meta, editingIdRef.current !== null));

  const changeSectionSetup = (section: Section, patch: { marks?: number; count?: number; note?: string }) => {
    const { meta } = paperRef.current;
    updateMeta({
      ...(patch.marks !== undefined && { sectionMarks: { ...meta.sectionMarks, [section]: patch.marks } }),
      ...(patch.count !== undefined && { sectionCounts: { ...meta.sectionCounts, [section]: patch.count } }),
      ...(patch.note !== undefined && { sectionNotes: { ...meta.sectionNotes, [section]: patch.note } }),
    });
    // A new marks per question for the form's Section sets the form's marks.
    if (patch.marks !== undefined && formRef.current.section === section) {
      setForm(withSectionMarks(formRef.current, paperRef.current.meta, editingIdRef.current !== null));
    }
  };

  // Quick Insert types into the last typing box that had focus.
  const typingBoxes = useRef(new Map<TypingField, HTMLInputElement | HTMLTextAreaElement>());
  const lastTypingBox = useRef<TypingField>("text");
  const typing = {
    register: (field: TypingField) => ({
      ref: (el: HTMLInputElement | HTMLTextAreaElement | null) => {
        if (el) typingBoxes.current.set(field, el);
        else typingBoxes.current.delete(field);
      },
      onFocus: () => {
        lastTypingBox.current = field;
      },
    }),
    insert: (text: string) => {
      const field = lastTypingBox.current;
      const box = typingBoxes.current.get(field);
      const value = fieldValue(formRef.current, field);
      const start = box?.selectionStart ?? value.length;
      const end = box?.selectionEnd ?? value.length;
      flushSync(() => setForm(withField(formRef.current, field, value.slice(0, start) + text + value.slice(end))));
      if (!box) return;
      box.focus();
      const position = start + text.length;
      box.setSelectionRange(position, position);
    },
  };

  // The Question Bank ----------------------------------------------------------

  function saveToBank(question: Question) {
    const current = bankRef.current;
    commitBank({ items: [toBankItem(question, current.nextBankId), ...current.items], nextBankId: current.nextBankId + 1 });
    setStatus({ text: "Saved to Bank", color: "var(--color-success)" });
  }

  function addToBank(questions: Omit<BankItem, "bankId">[]) {
    const current = bankRef.current;
    let nextBankId = current.nextBankId;
    const added = questions.map((question) => ({ ...question, bankId: nextBankId++ })).reverse();
    commitBank({ items: [...added, ...current.items], nextBankId });
  }

  function insertFromBank(item: BankItem) {
    const current = paperRef.current;
    commitPaper({
      ...current,
      questions: [...current.questions, fromBankItem(item, current.nextId)],
      nextId: current.nextId + 1,
    });
  }

  async function deleteFromBank(item: BankItem) {
    const ok = await confirm({
      title: "Delete from Question Bank?",
      message: "This Question will be deleted from your Question Bank. Questions already on the Paper stay as they are.",
      confirmLabel: "Delete Question",
    });
    if (!ok) return;
    const current = bankRef.current;
    commitBank({ ...current, items: current.items.filter((b) => b.bankId !== item.bankId) });
  }

  // ---------------------------------------------------------------------------

  const { exam, classSubject } = paperHeader(paper.meta);
  const paperTitle = [exam, classSubject].filter(Boolean).join(" · ");

  return (
    <>
      <Header
        paperTitle={paperTitle}
        status={status}
        phone={phone}
        headerRef={header}
        bankOpen={bankOpen}
        bankToggleRef={bankToggle}
        onToggleBank={() => setBankOpen(!bankOpen)}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        showMarkingScheme={showMarkingScheme}
        onTemplate={(key, name) => void loadTemplate(key, name)}
        onGenerate={() => setGenerateOpen(true)}
        onSavePaper={savePaperFile}
        onLoadPaper={loadPaperFile}
        onReset={() => void resetSample()}
        onToggleMarkingScheme={() => setShowMarkingScheme(!showMarkingScheme)}
        onPrintMarkingScheme={printMarkingScheme}
        onExportWord={() => void exportWord()}
        onPrint={() => window.print()}
      />

      <SummaryBar paper={paper} onTargetChange={(targetMarks) => updateMeta({ targetMarks })} />

      <main id="mainLayout" className={view === "editor" ? "layout mobile-view-editor" : "layout mobile-view-preview"}>
        <section className="panel editor-panel">
          <PaperDetailsStep meta={paper.meta} onChange={updateMeta} />
          <SectionsStep meta={paper.meta} onSectionChange={changeSectionSetup} />
          <QuestionStep
            meta={paper.meta}
            form={form}
            editing={editingId !== null}
            showError={showError}
            open={addStepOpen}
            onToggle={setAddStepOpen}
            onChange={changeForm}
            onSectionChange={changeSection}
            onTyping={(field, value) => setForm(withField(formRef.current, field, value))}
            onSubmit={submitQuestion}
            onCancel={endEdit}
            typing={typing}
          />
        </section>

        <div className="preview-pane">
          <PaperPreview
            paper={paper}
            showMarkingScheme={showMarkingScheme}
            editingId={editingId}
            onMove={moveQuestion}
            onSaveToBank={saveToBank}
            onEdit={startEdit}
            onRemove={(question, number) => void removeQuestion(question, number)}
          />
        </div>
      </main>

      <TabBar view={view} bankOpen={bankOpen} onView={chooseView} onBank={() => setBankOpen(true)} />

      <BankPanel
        open={bankOpen}
        items={bank.items}
        searchRef={bankSearch}
        onClose={() => setBankOpen(false, { returnFocus: true })}
        onInsert={insertFromBank}
        onDelete={(item) => void deleteFromBank(item)}
        onAdd={addToBank}
      />

      <GenerateDialog
        open={generateOpen}
        classLevel={paper.meta.classLevel}
        subject={paper.meta.subject}
        onClose={() => setGenerateOpen(false)}
        onLoad={(generated) => void loadGenerated(generated)}
      />

      <UpdateNotice />
    </>
  );
}
