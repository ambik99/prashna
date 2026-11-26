// How a Paper is shown, printed and exported: the rules the preview, the
// marks summary and the Word file share. Pure functions of the Paper.

import { SECTIONS, type Paper, type PaperMeta, type Question, type Section } from "@prashna/paper";
import { AR_OPTIONS } from "./content.ts";

/** Science Divisions apply to Class 9 and 10 Science Papers only. */
export function scienceDivisionsActive(meta: PaperMeta): boolean {
  return (meta.classLevel === "Class 9" || meta.classLevel === "Class 10") && meta.subject.trim().toLowerCase() === "science";
}

/**
 * The Science Division the Paper is for: "Physics", "Chemistry", "Biology",
 * or "Combined" (also for any Paper that isn't Class 9 or 10 Science).
 */
export function paperDivision(meta: PaperMeta): PaperMeta["divisionMode"] {
  return scienceDivisionsActive(meta) ? meta.divisionMode : "Combined";
}

/** A Question's Science Division; untagged Questions count as Physics. */
export const divisionOf = (q: Question) => q.division || "Physics";

/** Whether a Section is on the Paper (it has a number of questions). */
export const sectionInUse = (meta: PaperMeta, section: Section) => meta.sectionCounts[section] > 0;

/**
 * The Questions printed on the Paper (preview, print and Word export): those
 * in Sections in use and, for a single Science Division Paper, only that
 * division's.
 */
export function paperQuestions(paper: Paper): Question[] {
  const division = paperDivision(paper.meta);
  return paper.questions.filter(
    (q) => sectionInUse(paper.meta, q.section) && (division === "Combined" || divisionOf(q) === division),
  );
}

export const totalMarks = (questions: Question[]) => questions.reduce((sum, q) => sum + q.marks, 0);

/** The header's class and subject, e.g. "Class 10 — Science (Chemistry)". */
export function classSubjectLine(meta: PaperMeta): string {
  const division = paperDivision(meta);
  const suffix = division === "Combined" ? "" : ` (${division})`;
  return `${meta.classLevel} — ${meta.subject.trim() || "Subject"}${suffix}`;
}

/** What the Paper's header shows, with the placeholders for empty details. */
export function paperHeader(meta: PaperMeta) {
  return {
    school: meta.school.trim() || "School Name",
    exam: meta.exam.trim() || "Examination Title",
    classSubject: classSubjectLine(meta),
    time: meta.time.trim() || "3 Hours",
    instructions: meta.instructions.trim() || "All questions are compulsory.",
  };
}

export const sectionTitle = (section: Section) =>
  section === "Section E" ? "Section E (Case-Study / Source-Based)" : section;

export const marksLabel = (marks: number) => `[${marks}${marks === 1 ? " Mark]" : " Marks]"}`;

export const MCQ_LABELS = ["(a)", "(b)", "(c)", "(d)"] as const;

/** The Questions printed in each Section, numbered across the whole Paper. */
export function numberedSections(paper: Paper, questions = paperQuestions(paper)) {
  let number = 1;
  return SECTIONS.filter((section) => sectionInUse(paper.meta, section))
    .map((section) => ({
      section,
      note: paper.meta.sectionNotes[section].trim(),
      items: questions.filter((q) => q.section === section).map((question) => ({ question, number: number++ })),
    }))
    .filter((block) => block.items.length > 0);
}

/** A file name from the class and subject, e.g. "class-10-science.json". */
export function fileName(meta: PaperMeta, extension: string): string {
  const safe = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${safe(meta.classLevel)}-${safe(meta.subject.trim() || "paper")}.${extension}`;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

/**
 * The Word (.doc) file: the same structure and class names as the preview,
 * styled by paper.css, so it matches the preview and the printed Paper.
 */
export function wordDocument(paper: Paper, showMarkingScheme: boolean, paperCss: string): string {
  const questions = paperQuestions(paper);
  const header = paperHeader(paper.meta);

  let html = '<div class="paper-sheet">';
  html += '<div class="paper-top">';
  if (showMarkingScheme) html += '<p class="paper-mode-banner">MARKING SCHEME</p>';
  html += `<p class="paper-school">${escapeHtml(header.school)}</p>`;
  html += `<p class="paper-exam">${escapeHtml(header.exam)}</p>`;
  html += '<table class="paper-meta-table"><tr>';
  html += `<td style="text-align:left;">${escapeHtml(header.classSubject)}</td>`;
  html += `<td style="text-align:center;">Time: ${escapeHtml(header.time)}</td>`;
  html += `<td style="text-align:right;">Max. Marks: ${totalMarks(questions)}</td>`;
  html += "</tr></table></div>";
  html += `<p class="instructions"><strong>General Instructions:</strong> ${escapeHtml(header.instructions)}</p>`;

  for (const block of numberedSections(paper, questions)) {
    html += '<div class="section-block">';
    html += `<p class="section-title">${escapeHtml(sectionTitle(block.section))}</p>`;
    if (block.note) html += `<p class="section-subtitle">${escapeHtml(block.note)}</p>`;

    for (const { question: q, number } of block.items) {
      html +=
        '<table class="question-item" style="width:100%;border-collapse:collapse;"><tr><td class="question-body" style="vertical-align:top;width:99%;">';
      if (q.type === "ar") {
        html += `<p class="q-text">${number}. Two statements are given — Assertion (A) and Reason (R).</p>`;
        html += `<p class="ar-statement"><strong>Assertion (A):</strong> ${escapeHtml(q.assertion)}</p>`;
        html += `<p class="ar-statement"><strong>Reason (R):</strong> ${escapeHtml(q.reason)}</p>`;
        for (const option of AR_OPTIONS) html += `<p class="ar-options-preview ar-option">${escapeHtml(option)}</p>`;
      } else {
        html += `<p class="q-text">${number}. ${escapeHtml(q.text)}</p>`;
      }

      if (q.imageData) {
        html += `<p style="text-align:center;margin:6pt 0;"><img src="${q.imageData}" style="max-width:360px;max-height:200px;" /></p>`;
      }

      if (q.type === "mcq" && q.options.length === 4) {
        html += '<p class="mcq-options-preview">';
        q.options.forEach((option, i) => {
          html += `${MCQ_LABELS[i]} ${escapeHtml(option)}${i < 3 ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : ""}`;
        });
        html += "</p>";
      }

      if (q.type === "case") {
        for (const sub of q.subQuestions) html += `<p class="case-subquestions case-subquestion">${escapeHtml(sub)}</p>`;
      }

      if (q.orText) {
        html += '<p class="or-divider">OR</p>';
        html += `<p class="or-alt-text">${escapeHtml(q.orText)}</p>`;
      }

      if (showMarkingScheme) {
        html += `<p class="answer-box"><strong>Marking Scheme:</strong> ${escapeHtml(q.answer || "No Marking Scheme added yet.")}</p>`;
      }

      html += `</td><td class="question-marks" style="vertical-align:top;width:1%;padding-left:12pt;">${marksLabel(q.marks)}</td></tr></table>`;
    }
    html += "</div>";
  }
  html += "</div>";

  return (
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Question Paper</title><style>' +
    "body{margin:0;}p{margin:0;}" +
    paperCss +
    "</style></head><body>" +
    html +
    "</body></html>"
  );
}

/** Starts a download of a file the app made. */
export function download(contents: BlobPart[], type: string, name: string): void {
  const url = URL.createObjectURL(new Blob(contents, { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// paper.css, embedded in the Word file so it matches the preview.
let paperCss: Promise<string> | null = null;
export function loadPaperCss(): Promise<string> {
  paperCss ??= fetch("paper.css")
    .then((response) => (response.ok ? response.text() : ""))
    .catch(() => "");
  return paperCss;
}
