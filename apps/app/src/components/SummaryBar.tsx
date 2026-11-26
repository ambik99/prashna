// The marks summary: each Section's progress, the total, the Science
// Divisions' marks and how the Paper stands against its Target Marks.

import { SCIENCE_DIVISIONS, SECTIONS, type Paper } from "@prashna/paper";
import { divisionOf, paperQuestions, scienceDivisionsActive, sectionInUse, totalMarks } from "../paperView.ts";

export const TARGET_OPTIONS = [
  { value: 0, label: "No Target" },
  ...[20, 50, 60, 70, 80, 100].map((value) => ({ value, label: `Target: ${value} Marks` })),
];

interface Props {
  paper: Paper;
  onTargetChange: (target: number) => void;
}

type Pill = { key: string; text: string; tone?: "ok" | "over" | "under" | "total" };

function pills(paper: Paper): Pill[] {
  const { meta, questions } = paper;
  const total = totalMarks(paperQuestions(paper));
  const list: Pill[] = [];

  for (const section of SECTIONS) {
    const planned = meta.sectionCounts[section];
    if (planned === 0) continue;
    const items = questions.filter((q) => q.section === section);
    const marks = totalMarks(items);
    const perQuestion = meta.sectionMarks[section];
    const plannedMarks = perQuestion > 0 ? ` / ${perQuestion * planned}M` : "";
    list.push({
      key: section,
      text: `${section}: ${items.length}/${planned}Q (${marks}${plannedMarks})`,
      tone: items.length === planned ? "ok" : items.length > planned ? "over" : undefined,
    });
  }

  list.push({ key: "total", text: `Total: ${total} Marks`, tone: "total" });

  if (scienceDivisionsActive(meta)) {
    const shown = meta.divisionMode === "Combined" ? SCIENCE_DIVISIONS : [meta.divisionMode];
    for (const division of shown) {
      const marks = totalMarks(questions.filter((q) => sectionInUse(meta, q.section) && divisionOf(q) === division));
      const target = meta.divisionMarks[division];
      list.push({
        key: division,
        text: `${division}: ${marks}${target > 0 ? `/${target}M` : "M"}`,
        tone: target > 0 && marks === target ? "ok" : target > 0 && marks > target ? "over" : undefined,
      });
    }
  }

  const target = meta.targetMarks;
  if (target > 0) {
    const diff = target - total;
    if (diff === 0) list.push({ key: "status", text: `On Target (${total}/${target})`, tone: "ok" });
    else if (diff > 0) list.push({ key: "status", text: `${diff} marks remaining`, tone: "under" });
    else list.push({ key: "status", text: `${Math.abs(diff)} marks over target`, tone: "over" });
  }
  return list;
}

const TONE_CLASS = { ok: "pill pill-target-ok", over: "pill pill-target-over", under: "pill pill-target-under", total: "pill pill-total" };

export function SummaryBar({ paper, onTargetChange }: Props) {
  return (
    <section className="summary-bar" aria-label="Section Marks Breakdown">
      <div className="summary-left">
        <span className="summary-label">Marks Blueprint</span>
        <select
          id="targetSelect"
          className="target-select"
          aria-label="Target Total Marks"
          value={String(paper.meta.targetMarks)}
          onChange={(event) => onTargetChange(Number(event.target.value) || 0)}
        >
          {TARGET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div id="summaryPills" className="summary-pills">
        {pills(paper).map((pill) => (
          <span key={pill.key} className={pill.tone ? TONE_CLASS[pill.tone] : "pill"}>
            {pill.text}
          </span>
        ))}
      </div>
    </section>
  );
}
