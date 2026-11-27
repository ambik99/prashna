// The "Generate a Paper" screen: the teacher picks Class, Subject, an
// optional Focus and difficulty, and Prashna writes a complete Paper with AI.
// The finished Paper waits here until the teacher loads it, which replaces
// the current Paper after the usual confirmation (App.tsx).

import {
  BLUEPRINT_CLASSES,
  DIFFICULTIES,
  FOCUS_MAX_LENGTH,
  blueprintSubjects,
  findBlueprint,
  type BlueprintClass,
  type Difficulty,
} from "@prashna/paper";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createBotCheck, ERROR_MESSAGES, requestPaper, type BotCheck, type PaperResult } from "../aiPaper.ts";

export type GeneratedPaper = Extract<PaperResult, { ok: true }>;

interface Props {
  open: boolean;
  /** The current Paper's Class and Subject, to start from when they have a Blueprint. */
  classLevel: string;
  subject: string;
  onClose: () => void;
  onLoad: (generated: GeneratedPaper) => void;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easier (revision)",
  standard: "Board standard",
  challenging: "Challenging",
};

type Phase = { name: "form" } | { name: "working"; started: number } | { name: "error"; message: string } | { name: "ready"; generated: GeneratedPaper };

function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

function startingChoice(classLevel: string, subject: string): { classLevel: BlueprintClass; subject: string } {
  const cls = (BLUEPRINT_CLASSES as string[]).includes(classLevel) ? (classLevel as BlueprintClass) : "Class 10";
  const subjects = blueprintSubjects(cls);
  return { classLevel: cls, subject: subjects.includes(subject) ? subject : (subjects[0] ?? "") };
}

export function GenerateDialog(props: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const botCheckBox = useRef<HTMLDivElement>(null);
  const botCheck = useRef<Promise<BotCheck> | null>(null);
  const online = useOnline();

  const [choice, setChoice] = useState(() => startingChoice(props.classLevel, props.subject));
  const [focus, setFocus] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [phase, setPhase] = useState<Phase>({ name: "form" });
  const [seconds, setSeconds] = useState(0);
  const working = phase.name === "working";

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (props.open && !element.open) {
      element.showModal();
      // Start from the current Paper's Class and Subject, unless a Paper is waiting.
      if (phase.name !== "ready" && phase.name !== "working") setChoice(startingChoice(props.classLevel, props.subject));
    } else if (!props.open && element.open) {
      element.close();
      // It was opened from the More menu, which has closed since.
      document.getElementById("moreBtn")?.focus();
    }
    // Only opening and closing matter here.
  }, [props.open]);

  // The elapsed time, so a long wait never looks stuck.
  useEffect(() => {
    if (phase.name !== "working") return;
    setSeconds(0);
    const timer = setInterval(() => setSeconds(Math.round((Date.now() - phase.started) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // The bot check lives in the dialog's contents, so it goes when they do.
  useEffect(() => {
    if (props.open) return;
    const check = botCheck.current;
    botCheck.current = null;
    void check?.then((c) => c.remove()).catch(() => {});
  }, [props.open]);

  const blueprint = findBlueprint(choice.classLevel, choice.subject);

  async function generate(event: FormEvent) {
    event.preventDefault();
    if (working || !online) return;
    setPhase({ name: "working", started: Date.now() });

    let token: string;
    try {
      botCheck.current ??= createBotCheck(botCheckBox.current!);
      token = await (await botCheck.current).token();
    } catch (error) {
      botCheck.current = null;
      const loaded = error instanceof Error && error.message === "bot-check";
      setPhase({ name: "error", message: loaded ? ERROR_MESSAGES["bot-check"] : ERROR_MESSAGES["bot-check-unavailable"] });
      return;
    }

    const result = await requestPaper({
      classLevel: choice.classLevel,
      subject: choice.subject,
      focus: focus.trim(),
      difficulty,
      turnstileToken: token,
    });
    setPhase(result.ok ? { name: "ready", generated: result } : { name: "error", message: result.message });
  }

  return (
    <dialog
      ref={dialog}
      id="generateDialog"
      className="generate-dialog"
      aria-labelledby="generateTitle"
      // Escape closes, except while a Paper is being written.
      onCancel={(event) => {
        event.preventDefault();
        if (!working) props.onClose();
      }}
      onClose={() => {
        if (props.open) props.onClose();
      }}
    >
      {/* Rendered only while open, so its fields never stand in for the editor's. */}
      {props.open && (
        <>
          <h3 id="generateTitle">Generate a Paper</h3>

          {phase.name === "ready" ? (
            <Ready generated={phase.generated} onLoad={() => props.onLoad(phase.generated)} onAgain={() => setPhase({ name: "form" })} />
          ) : (
            <form onSubmit={(event) => void generate(event)}>
              <p className="generate-intro">
                Prashna writes a complete Paper with its Marking Scheme, following the CBSE Blueprint. Check every Question
                before you use it.
              </p>
              <fieldset disabled={working}>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="generateClass">Class</label>
                    <select
                      id="generateClass"
                      value={choice.classLevel}
                      onChange={(e) => setChoice(startingChoice(e.target.value, choice.subject))}
                    >
                      {BLUEPRINT_CLASSES.map((name) => (
                        <option key={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="generateSubject">Subject</label>
                    <select
                      id="generateSubject"
                      value={choice.subject}
                      onChange={(e) => setChoice({ ...choice, subject: e.target.value })}
                    >
                      {blueprintSubjects(choice.classLevel).map((name) => (
                        <option key={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {blueprint && (
                  <p className="generate-blueprint" aria-label="CBSE Blueprint">
                    <strong>
                      {blueprint.maxMarks} Marks · {blueprint.time}
                    </strong>{" "}
                    {blueprint.pattern}
                  </p>
                )}
                <div className="field">
                  <label htmlFor="generateFocus">Focus (optional)</label>
                  <textarea
                    id="generateFocus"
                    rows={2}
                    maxLength={FOCUS_MAX_LENGTH}
                    placeholder="Chapters or topics, for example: Light, Electricity. Leave empty for the full syllabus."
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="generateDifficulty">Difficulty</label>
                  <select id="generateDifficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                    {DIFFICULTIES.map((value) => (
                      <option key={value} value={value}>
                        {DIFFICULTY_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              <div className="generate-messages">
                {!online && (
                  <p className="generate-note" role="status">
                    {ERROR_MESSAGES.offline} Everything else in Prashna works offline.
                  </p>
                )}
                {working && (
                  <div className="generate-progress" role="status">
                    <span className="generate-spinner" aria-hidden="true"></span>
                    <span>
                      Writing your Paper… This usually takes under a minute.
                      {seconds > 0 && <span className="generate-seconds"> {seconds}s</span>}
                    </span>
                  </div>
                )}
                {phase.name === "error" && (
                  <p className="generate-error" role="alert">
                    {phase.message}
                  </p>
                )}
              </div>

              <p className="generate-privacy">Only the Class, Subject, Focus and difficulty are sent. Your Papers stay on your device.</p>

              <div className="confirm-actions">
                <button type="button" className="btn-reset" disabled={working} onClick={props.onClose}>
                  Close
                </button>
                <button type="submit" className="btn-print" disabled={working || !online}>
                  {working ? "Generating…" : "Generate Paper"}
                </button>
              </div>
            </form>
          )}

          {/* Turnstile appears here only if it needs the teacher to tick a box. */}
          <div ref={botCheckBox} className="generate-bot-check"></div>
        </>
      )}
    </dialog>
  );
}

function Ready({ generated, onLoad, onAgain }: { generated: GeneratedPaper; onLoad: () => void; onAgain: () => void }) {
  const { paper, marks } = generated;
  const matches = marks.actual === marks.expected;
  return (
    <div className="generate-ready">
      <p role="status">
        Your Paper is ready: {paper.meta.classLevel} {paper.meta.subject}, {paper.questions.length} Questions, {marks.actual}{" "}
        marks.
      </p>
      {!matches && (
        <p className="generate-note">
          Its marks add up to {marks.actual}, not {marks.expected}. Target Marks will show the gap so you can fix it.
        </p>
      )}
      <p className="generate-intro">Loading it replaces your current Paper.</p>
      <div className="confirm-actions">
        <button type="button" className="btn-reset" onClick={onAgain}>
          Generate Another
        </button>
        <button type="button" className="btn-print" onClick={onLoad}>
          Load Paper
        </button>
      </div>
    </div>
  );
}
