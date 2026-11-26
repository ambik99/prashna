// Editor steps 1 and 2: the Paper Details and the Sections.

import { DIVISION_MODES, SECTIONS, type PaperMeta, type Section } from "@prashna/paper";
import { scienceDivisionsActive } from "../paperView.ts";
import { NumberInput, Step } from "./Step.tsx";

const CLASSES = ["Nur", "LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];
const DIVISION_MODE_LABELS: Record<PaperMeta["divisionMode"], string> = {
  Combined: "Combined (Physics + Chemistry + Biology)",
  Physics: "Physics Only",
  Chemistry: "Chemistry Only",
  Biology: "Biology Only",
};
const MARKS_PER_QUESTION = [1, 2, 3, 4, 5, 6, 8, 10];
const QUESTION_COUNTS = Array.from({ length: 25 }, (_, i) => i + 1);

interface StepProps {
  meta: PaperMeta;
  onChange: (patch: Partial<PaperMeta>) => void;
}

export function PaperDetailsStep({ meta, onChange }: StepProps) {
  const divisions = scienceDivisionsActive(meta);
  const setDivisionMarks = (division: keyof PaperMeta["divisionMarks"], value: number) =>
    onChange({ divisionMarks: { ...meta.divisionMarks, [division]: value } });

  return (
    <Step id="stepPaperDetails" heading="1. Paper Details">
      <div className="field">
        <label htmlFor="schoolInput">School Name</label>
        <input
          type="text"
          id="schoolInput"
          autoComplete="organization"
          value={meta.school}
          onChange={(e) => onChange({ school: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="examInput">Examination Title</label>
        <input type="text" id="examInput" value={meta.exam} onChange={(e) => onChange({ exam: e.target.value })} />
      </div>
      <div className="field-row field-row-3">
        <div className="field">
          <label htmlFor="classInput">Class</label>
          <select id="classInput" value={meta.classLevel} onChange={(e) => onChange({ classLevel: e.target.value })}>
            {CLASSES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="subjectInput">Subject</label>
          <input type="text" id="subjectInput" value={meta.subject} onChange={(e) => onChange({ subject: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="timeInput">Time Allowed</label>
          <input type="text" id="timeInput" value={meta.time} onChange={(e) => onChange({ time: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="instructionsInput">General Instructions</label>
        <textarea
          id="instructionsInput"
          rows={3}
          value={meta.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
        />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          id="watermarkCheckbox"
          checked={meta.showWatermark}
          onChange={(e) => onChange({ showWatermark: e.target.checked })}
        />
        Show School Crest Watermark
      </label>

      <fieldset id="scienceDivisionBox" className={divisions ? "form-group" : "form-group hidden"}>
        <legend>Science Division</legend>
        <p className="form-hint">For Class 9 and 10 Science Papers.</p>
        <div className="field">
          <label htmlFor="divisionModeSelect">Science Division (Class 9 &amp; 10)</label>
          <select
            id="divisionModeSelect"
            value={meta.divisionMode}
            onChange={(e) => onChange({ divisionMode: e.target.value as PaperMeta["divisionMode"] })}
          >
            {DIVISION_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {DIVISION_MODE_LABELS[mode]}
              </option>
            ))}
          </select>
        </div>
        <div className="field-row field-row-3">
          {(
            [
              ["Physics", "divPhyMarks"],
              ["Chemistry", "divChemMarks"],
              ["Biology", "divBioMarks"],
            ] as const
          ).map(([division, id]) => (
            <div key={division}>
              <label htmlFor={id}>{division} marks</label>
              <NumberInput
                id={id}
                min={0}
                max={100}
                inputMode="numeric"
                value={meta.divisionMarks[division]}
                onChange={(value) => setDivisionMarks(division, value)}
              />
            </div>
          ))}
        </div>
      </fieldset>
    </Step>
  );
}

interface SectionsProps {
  meta: PaperMeta;
  onSectionChange: (section: Section, patch: { marks?: number; count?: number; note?: string }) => void;
}

export function SectionsStep({ meta, onSectionChange }: SectionsProps) {
  return (
    <Step id="stepSections" heading="2. Sections">
      <p className="form-hint">
        Set each Section's marks and number of questions. Choose "Not in use" to leave a Section off the Paper.
      </p>
      {SECTIONS.map((section) => {
        const letter = section.slice(-1);
        return (
          <fieldset key={section} className="section-row">
            <legend id={`legend${letter}`}>{section}</legend>
            <div className="section-row-fields">
              <div>
                <label id={`distLabel${letter}`} htmlFor={`dist${letter}`}>
                  Marks per question
                </label>
                <select
                  id={`dist${letter}`}
                  aria-labelledby={`legend${letter} distLabel${letter}`}
                  value={String(meta.sectionMarks[section])}
                  onChange={(e) => onSectionChange(section, { marks: Number(e.target.value) || 0 })}
                >
                  <option value="0">Custom</option>
                  {MARKS_PER_QUESTION.map((marks) => (
                    <option key={marks} value={marks}>
                      {marks}M/Q
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label id={`countLabel${letter}`} htmlFor={`count${letter}`}>
                  Number of questions
                </label>
                <select
                  id={`count${letter}`}
                  aria-labelledby={`legend${letter} countLabel${letter}`}
                  value={String(meta.sectionCounts[section])}
                  onChange={(e) => onSectionChange(section, { count: Math.max(0, Number(e.target.value) || 0) })}
                >
                  <option value="0">Not in use</option>
                  {QUESTION_COUNTS.map((count) => (
                    <option key={count} value={count}>
                      {count} Qs
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label id={`noteLabel${letter}`} htmlFor={`note${letter}`}>
              Note printed under the heading
            </label>
            <input
              type="text"
              id={`note${letter}`}
              aria-labelledby={`legend${letter} noteLabel${letter}`}
              value={meta.sectionNotes[section]}
              onChange={(e) => onSectionChange(section, { note: e.target.value })}
            />
          </fieldset>
        );
      })}
    </Step>
  );
}
