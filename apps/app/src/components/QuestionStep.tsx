// Editor step 3: the Add / Edit Question form, with Quick Insert.

import { SCIENCE_DIVISIONS, SECTIONS, type PaperMeta, type QuestionType, type ScienceDivision, type Section } from "@prashna/paper";
import { useRef, useState, type ChangeEvent } from "react";
import { BENGALI_CHARS, HINDI_CHARS, MATH_ITEMS, SCIENCE_ITEMS } from "../content.ts";
import { scienceDivisionsActive, sectionInUse } from "../paperView.ts";
import { OPTION_FIELDS, fieldValue, type QuestionForm, type TypingField } from "../questionForm.ts";
import { phoneticTransliterate } from "../transliterate.ts";
import { Step } from "./Step.tsx";

const TYPE_LABELS: Record<QuestionType, string> = {
  standard: "Standard (Short / Long Answer)",
  mcq: "Multiple Choice (MCQ)",
  ar: "Assertion–Reason (CBSE Preset)",
  case: "Case-Study (Passage + Sub-questions)",
};

type TypingElement = HTMLInputElement | HTMLTextAreaElement;

interface Props {
  meta: PaperMeta;
  form: QuestionForm;
  editing: boolean;
  showError: boolean;
  open: boolean;
  onToggle: (open: boolean) => void;
  onChange: (patch: Partial<QuestionForm>) => void;
  onSectionChange: (section: Section) => void;
  onTyping: (field: TypingField, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  /** Quick Insert: where to type, and how to put text there. */
  typing: {
    register: (field: TypingField) => { ref: (el: TypingElement | null) => void; onFocus: () => void };
    insert: (text: string) => void;
  };
}

export function QuestionStep(props: Props) {
  const { meta, form, editing, showError, open, onToggle, onChange, onSectionChange, onTyping, onSubmit, onCancel, typing } = props;
  const imageInput = useRef<HTMLInputElement>(null);
  const divisions = scienceDivisionsActive(meta);

  // A typing box that Quick Insert can type into.
  const typingBox = (field: TypingField) => ({
    ...typing.register(field),
    value: fieldValue(form, field),
    onChange: (event: ChangeEvent<TypingElement>) => onTyping(field, event.target.value),
  });

  function attachImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ imageData: String(reader.result) });
      input.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <Step
      id="stepAddQuestion"
      heading={editing ? "3. Edit Question" : "3. Add a Question"}
      headingId="formHeading"
      open={open}
      onToggle={onToggle}
    >
      <div className="field-row field-row-3 field-row-placement">
        <div className="field">
          <label htmlFor="sectionInput">Section</label>
          <select id="sectionInput" value={form.section} onChange={(e) => onSectionChange(e.target.value as Section)}>
            {SECTIONS.map((section) => {
              const inUse = sectionInUse(meta, section);
              return (
                <option key={section} value={section} hidden={!inUse} disabled={!inUse}>
                  {section === "Section E" ? "Section E (Case-Study)" : section}
                </option>
              );
            })}
          </select>
        </div>
        <div className="field">
          <label htmlFor="marksInput">Marks</label>
          <input
            type="number"
            id="marksInput"
            min={1}
            max={20}
            inputMode="numeric"
            value={form.marks}
            onChange={(e) => onChange({ marks: e.target.value })}
          />
        </div>
        <div id="questionDivisionField" className={divisions ? "field" : "field hidden"}>
          <label htmlFor="questionDivisionInput">Science Division</label>
          <select
            id="questionDivisionInput"
            value={form.division}
            onChange={(e) => onChange({ division: e.target.value as ScienceDivision })}
          >
            {SCIENCE_DIVISIONS.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="typeInput">Question Type</label>
        <select id="typeInput" value={form.type} onChange={(e) => onChange({ type: e.target.value as QuestionType })}>
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div className={form.type === "ar" ? "field hidden" : "field"} id="mainQuestionField">
        <label htmlFor="questionInput" id="questionLabel">
          {form.type === "case" ? "Case-Study Passage" : "Question Text"}
        </label>
        <textarea
          id="questionInput"
          rows={3}
          placeholder="e.g., State Ohm's law and write its mathematical formula."
          {...typingBox("text")}
        />
      </div>

      <div id="arFields" className={form.type === "ar" ? "ar-fields" : "ar-fields hidden"}>
        <div className="field">
          <label htmlFor="assertionInput">Assertion (A)</label>
          <textarea id="assertionInput" placeholder="e.g., Silver chloride turns grey in sunlight." {...typingBox("assertion")} />
        </div>
        <div className="field">
          <label htmlFor="reasonInput">Reason (R)</label>
          <textarea
            id="reasonInput"
            placeholder="e.g., Decomposition of silver chloride into silver and chlorine takes place by sunlight."
            {...typingBox("reason")}
          />
        </div>
        <p className="form-hint">The standard CBSE options (a)–(d) are added automatically.</p>
      </div>

      <fieldset id="mcqFields" className={form.type === "mcq" ? "mcq-fields" : "mcq-fields hidden"}>
        <legend>MCQ Options</legend>
        <div className="mcq-grid">
          {OPTION_FIELDS.map((field, i) => {
            const letter = "abcd"[i]!;
            return (
              <div key={field}>
                <label htmlFor={field}>Option ({letter})</label>
                <input type="text" id={field} placeholder={`(${letter}) Option ${letter.toUpperCase()}`} {...typingBox(field)} />
              </div>
            );
          })}
        </div>
      </fieldset>

      <div id="caseFields" className={form.type === "case" ? "case-fields" : "case-fields hidden"}>
        <label htmlFor="subQuestionsInput">Sub-questions (one per line)</label>
        <textarea
          id="subQuestionsInput"
          rows={4}
          placeholder={"(i) Identify the type of reaction.\n(ii) Write the balanced equation.\n(iii) State one observation."}
          {...typingBox("subQuestions")}
        />
      </div>

      {/* Typing tools sit right under the text they insert into */}
      <QuickInsert insert={typing.insert} />

      <fieldset className="image-box">
        <legend>Diagram / Figure (Optional)</legend>
        <div className="image-controls">
          <button type="button" id="attachImgBtn" className="btn-reset" onClick={() => imageInput.current?.click()}>
            Attach Image
          </button>
          <button
            type="button"
            id="clearImgBtn"
            className={form.imageData ? "btn-remove" : "btn-remove hidden"}
            onClick={() => onChange({ imageData: "" })}
          >
            Remove Image
          </button>
          <input type="file" id="imageFileInput" accept="image/*" className="hidden" ref={imageInput} onChange={attachImage} />
        </div>
        <p className="form-hint">Shown under the Question on the Paper.</p>
        <img
          id="imagePreviewThumb"
          className={form.imageData ? "image-thumb" : "image-thumb hidden"}
          alt="Attached diagram preview"
          src={form.imageData || undefined}
        />
      </fieldset>

      <label className="checkbox-label">
        <input type="checkbox" id="hasOrCheckbox" checked={form.hasOr} onChange={(e) => onChange({ hasOr: e.target.checked })} />
        Add an Alternative Question ("OR")
      </label>

      <div id="orFields" className={form.hasOr ? "or-fields" : "or-fields hidden"}>
        <label htmlFor="orQuestionInput">Alternative Question</label>
        <textarea id="orQuestionInput" placeholder="Enter the Alternative Question..." {...typingBox("orText")} />
      </div>

      <div className="field">
        <label htmlFor="answerInput">Answer / Marking Scheme (Optional)</label>
        <textarea
          id="answerInput"
          placeholder="e.g., (b) Hydrogen — or key marking points for teachers."
          {...typingBox("answer")}
        />
      </div>

      <div className="form-actions">
        <button type="button" id="addQuestionBtn" className="btn-primary" onClick={onSubmit}>
          {editing ? "Save Changes" : "+ Add Question to Paper"}
        </button>
        <button type="button" id="cancelEditBtn" className={editing ? "btn-reset" : "btn-reset hidden"} onClick={onCancel}>
          Cancel
        </button>
      </div>
      <p id="errorMsg" className="error-msg" role="alert" style={{ display: showError ? "block" : "none" }}>
        Please enter a question, valid marks (1–20), and all required fields.
      </p>
    </Step>
  );
}

type HelperTab = "math" | "science" | "hindi" | "bengali";
const HELPER_TABS: { key: HelperTab; label: string }[] = [
  { key: "math", label: "Math" },
  { key: "science", label: "Science" },
  { key: "hindi", label: "हिन्दी" },
  { key: "bengali", label: "বাংলা" },
];

function Chips({ id, items, insert }: { id: string; items: string[]; insert: (text: string) => void }) {
  return (
    <div className="chip-grid" id={id}>
      {items.map((item) => (
        <button key={item} type="button" className="sym-chip" onClick={() => insert(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function Transliterator({
  lang,
  idPrefix,
  placeholder,
  label,
  emptyPreview,
  insert,
}: {
  lang: "hi" | "bn";
  idPrefix: string;
  placeholder: string;
  label: string;
  emptyPreview: string;
  insert: (text: string) => void;
}) {
  const [typed, setTyped] = useState("");
  return (
    <>
      <div className="translit-row">
        <input
          type="text"
          id={`${idPrefix}TranslitInput`}
          placeholder={placeholder}
          aria-label={label}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
        />
        <button
          type="button"
          id={`insert${idPrefix[0]!.toUpperCase()}${idPrefix.slice(1)}TranslitBtn`}
          className="btn-edit"
          onClick={() => {
            if (!typed.trim()) return;
            insert(phoneticTransliterate(typed, lang));
            setTyped("");
          }}
        >
          Insert
        </button>
      </div>
      <div id={`${idPrefix}TranslitPreview`} className="translit-preview">
        {typed ? phoneticTransliterate(typed, lang) : emptyPreview}
      </div>
    </>
  );
}

function QuickInsert({ insert }: { insert: (text: string) => void }) {
  const [tab, setTab] = useState<HelperTab>("math");
  const panel = (key: HelperTab) => (tab === key ? "helper-panel" : "helper-panel hidden");

  return (
    <details className="section-notes-box">
      <summary>Quick Insert: Math, Science, हिन्दी &amp; বাংলা</summary>
      <div className="notes-inner">
        <p className="form-hint">Inserts at the cursor in the last text box you clicked.</p>
        <div className="helper-tabs" role="group" aria-label="Typing tools">
          {HELPER_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={tab === key ? "helper-tab-btn active" : "helper-tab-btn"}
              data-helper-tab={key}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div id="helperPanelMath" className={panel("math")}>
          <Chips id="mathChips" items={MATH_ITEMS} insert={insert} />
        </div>
        <div id="helperPanelScience" className={panel("science")}>
          <Chips id="scienceChips" items={SCIENCE_ITEMS} insert={insert} />
        </div>
        <div id="helperPanelHindi" className={panel("hindi")}>
          <Transliterator
            lang="hi"
            idPrefix="hindi"
            placeholder="Type English (e.g. vigyan, prashna)..."
            label="Type English to convert to Hindi"
            emptyPreview="हिन्दी पूर्वावलोकन..."
            insert={insert}
          />
          <Chips id="hindiChips" items={HINDI_CHARS} insert={insert} />
        </div>
        <div id="helperPanelBengali" className={panel("bengali")}>
          <Transliterator
            lang="bn"
            idPrefix="bengali"
            placeholder="Type English (e.g. bigyan, proshno)..."
            label="Type English to convert to Bengali"
            emptyPreview="বাংলা প্রিভিউ..."
            insert={insert}
          />
          <Chips id="bengaliChips" items={BENGALI_CHARS} insert={insert} />
        </div>
      </div>
    </details>
  );
}
