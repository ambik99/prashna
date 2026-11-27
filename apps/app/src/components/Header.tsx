// The top bar: the Paper's title, save status, theme toggle, Question Bank,
// the "More" menu of less frequent actions, Export Word and Print. On phones
// Print and Export move into the More menu, which becomes a bottom sheet.

import { useEffect, useRef, type CSSProperties, type ChangeEvent, type Ref } from "react";
import { TEMPLATES } from "../content.ts";

export interface SaveStatus {
  text: string;
  color?: string;
}

interface Props {
  paperTitle: string;
  status: SaveStatus;
  phone: boolean;
  headerRef: Ref<HTMLElement>;
  bankOpen: boolean;
  bankToggleRef: Ref<HTMLButtonElement>;
  onToggleBank: () => void;
  moreOpen: boolean;
  setMoreOpen: (open: boolean, options?: { returnFocus?: boolean }) => void;
  showMarkingScheme: boolean;
  onTemplate: (key: string, name: string) => void;
  onGenerate: () => void;
  onSavePaper: () => void;
  onLoadPaper: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onToggleMarkingScheme: () => void;
  onPrintMarkingScheme: () => void;
  onExportWord: () => void;
  onPrint: () => void;
}

export function Header(props: Props) {
  const { phone, moreOpen, setMoreOpen } = props;
  const menu = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Opening the menu focuses its first control.
  useEffect(() => {
    if (moreOpen) menu.current?.querySelector<HTMLElement>("select, button")?.focus();
  }, [moreOpen, phone]);

  // A click or tap anywhere else closes the menu.
  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest?.(".more-menu, #moreBtn")) setMoreOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [moreOpen, setMoreOpen]);

  const exportButton = (
    <button type="button" id="exportDocBtn" className="btn-reset" onClick={props.onExportWord}>
      Export Word (.doc)
    </button>
  );
  const printButton = (
    <button type="button" id="printBtn" className="btn-print" onClick={props.onPrint}>
      Print / Save as PDF
    </button>
  );
  const statusStyle: CSSProperties | undefined = props.status.color ? { color: props.status.color } : undefined;

  return (
    <header className="app-header" ref={props.headerRef}>
      <div className="title-group">
        <h1 className="brand">Prashna</h1>
        <span className="title-sep" aria-hidden="true"></span>
        <p id="paperTitle" className="paper-title" title={props.paperTitle}>
          {props.paperTitle}
        </p>
        <span id="saveStatus" className="save-status" style={statusStyle}>
          {props.status.text}
        </span>
      </div>
      <div className="header-actions">
        {/* theme.js turns this into the light and dark theme toggle */}
        <button type="button" data-theme-toggle></button>
        <button
          type="button"
          id="bankToggleBtn"
          ref={props.bankToggleRef}
          className="btn-reset"
          aria-expanded={props.bankOpen}
          aria-controls="bankPanel"
          onClick={props.onToggleBank}
        >
          Question Bank
        </button>
        <div className="more">
          <div id="sheetBackdrop" className="sheet-backdrop" hidden={!(moreOpen && phone)}></div>
          <button
            type="button"
            id="moreBtn"
            className="btn-reset more-btn"
            aria-expanded={moreOpen}
            aria-controls="moreMenu"
            onClick={() => setMoreOpen(!moreOpen)}
          >
            More
          </button>
          <div
            id="moreMenu"
            ref={menu}
            className="more-menu"
            hidden={!moreOpen}
            // Choosing an action closes the menu.
            onClick={(event) => {
              if ((event.target as Element).closest("button")) setMoreOpen(false);
            }}
            // So does keyboard focus leaving it.
            onBlur={(event) => {
              const next = event.relatedTarget as Element | null;
              if (next && !next.closest(".more")) setMoreOpen(false);
            }}
          >
            {/* On phones, Print and Export move here from the top bar */}
            <div id="morePrimary" className="more-group more-primary">
              {phone && (
                <>
                  {printButton}
                  {exportButton}
                </>
              )}
            </div>
            <div className="more-group">
              <label htmlFor="templateSelect" className="more-label">
                Template
              </label>
              <select
                id="templateSelect"
                className="template-select"
                aria-label="Load CBSE Template"
                value=""
                onChange={(event) => {
                  const key = event.target.value;
                  if (!key) return;
                  props.onTemplate(key, event.target.selectedOptions[0]?.textContent ?? key);
                  setMoreOpen(false);
                }}
              >
                <option value="">Load CBSE Template...</option>
                {TEMPLATES.map((template) => (
                  <option key={template.key} value={template.key}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button type="button" id="generateBtn" className="more-item" onClick={props.onGenerate}>
                Generate a Paper (AI)
              </button>
            </div>
            <div className="more-group">
              <span className="more-label">Paper file</span>
              <button type="button" id="exportBtn" className="more-item" onClick={props.onSavePaper}>
                Save Paper (.json)
              </button>
              <button type="button" id="importBtn" className="more-item" onClick={() => fileInput.current?.click()}>
                Load Paper
              </button>
              <input
                type="file"
                id="importFileInput"
                ref={fileInput}
                accept=".json"
                className="hidden"
                onChange={props.onLoadPaper}
              />
              <button type="button" id="resetBtn" className="more-item" onClick={props.onReset}>
                Reset Sample
              </button>
            </div>
            <div className="more-group">
              <span className="more-label">Marking Scheme</span>
              <button
                type="button"
                id="toggleKeyBtn"
                className={props.showMarkingScheme ? "more-item active" : "more-item"}
                onClick={props.onToggleMarkingScheme}
              >
                {props.showMarkingScheme ? "Hide Marking Scheme" : "Show Marking Scheme"}
              </button>
              <button type="button" id="printAnswerKeyBtn" className="more-item" onClick={props.onPrintMarkingScheme}>
                Print Marking Scheme
              </button>
            </div>
            <div className="more-group">
              {/* get-app.js gives this its behaviour */}
              <button type="button" className="more-item" data-get-app>
                Get the App
              </button>
              <span className="more-version">Version 10.0</span>
            </div>
          </div>
        </div>
        {!phone && (
          <>
            {exportButton}
            {printButton}
          </>
        )}
      </div>
    </header>
  );
}
