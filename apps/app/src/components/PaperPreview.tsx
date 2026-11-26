// The live preview: the Paper as it prints, with each Question's tools.

import type { Paper, Question } from "@prashna/paper";
import crest from "../assets/school-crest.jpg";
import { AR_OPTIONS } from "../content.ts";
import {
  MCQ_LABELS,
  marksLabel,
  numberedSections,
  paperHeader,
  paperQuestions,
  scienceDivisionsActive,
  sectionTitle,
  totalMarks,
} from "../paperView.ts";

interface Props {
  paper: Paper;
  showMarkingScheme: boolean;
  editingId: number | null;
  onMove: (id: number, direction: -1 | 1) => void;
  onSaveToBank: (q: Question) => void;
  onEdit: (id: number) => void;
  onRemove: (q: Question, number: number) => void;
}

export function PaperPreview({ paper, showMarkingScheme, editingId, onMove, onSaveToBank, onEdit, onRemove }: Props) {
  const header = paperHeader(paper.meta);
  const questions = paperQuestions(paper);
  const divisions = scienceDivisionsActive(paper.meta);

  return (
    <section className="paper-sheet theme-light" aria-label="Question Paper Preview">
      <img
        id="paperWatermarkImg"
        className={paper.meta.showWatermark ? "paper-watermark" : "paper-watermark hidden"}
        src={crest}
        alt=""
        aria-hidden="true"
      />
      <div className="paper-top">
        <div id="modeBanner" className={showMarkingScheme ? "paper-mode-banner" : "paper-mode-banner hidden"}>
          Marking Scheme
        </div>
        <div className="paper-school" id="previewSchool">
          {header.school}
        </div>
        <div className="paper-exam" id="previewExam">
          {header.exam}
        </div>
        <div className="paper-meta">
          <span id="previewClassSubject">{header.classSubject}</span>
          <span id="previewTime">Time: {header.time}</span>
          <span id="previewTotalMarks">Max. Marks: {totalMarks(questions)}</span>
        </div>
      </div>

      <div className="instructions">
        {/* paper.css keeps these line breaks (white-space: pre-line), as the printed layout expects */}
        {"\n"}
        <strong>General Instructions:</strong>
        {"\n"}
        <span id="previewInstructions">{header.instructions}</span>
        {"\n"}
      </div>

      <div id="questionsContainer">
        {paper.questions.length === 0 ? (
          <p className="empty-state">No questions added yet. Use the form on the left to add your first question.</p>
        ) : (
          numberedSections(paper, questions).map((block) => (
            <div key={block.section} className="section-block">
              <div className="section-title">{sectionTitle(block.section)}</div>
              {block.note && <div className="section-subtitle">{block.note}</div>}
              {block.items.map(({ question: q, number }, index) => (
                <div key={q.id} className={q.id === editingId ? "question-item editing-highlight" : "question-item"}>
                  <div className="question-body">
                    {q.type === "ar" ? (
                      <>
                        <div className="q-text">{number}. Two statements are given — Assertion (A) and Reason (R).</div>
                        <div className="ar-statement">
                          <strong>Assertion (A):</strong> <span>{q.assertion}</span>
                        </div>
                        <div className="ar-statement">
                          <strong>Reason (R):</strong> <span>{q.reason}</span>
                        </div>
                        <div className="ar-options-preview">
                          {AR_OPTIONS.map((option) => (
                            <div key={option}>{option}</div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="q-text">
                        {number}. {q.text}
                      </div>
                    )}

                    {q.imageData && <img src={q.imageData} alt="Question diagram" className="question-diagram" />}

                    {q.type === "mcq" && q.options.length === 4 && (
                      <div className="mcq-options-preview">
                        {q.options.map((option, i) => (
                          <div key={i}>
                            {MCQ_LABELS[i]} {option}
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === "case" && q.subQuestions.length > 0 && (
                      <div className="case-subquestions">
                        {q.subQuestions.map((sub, i) => (
                          <div key={i}>{sub}</div>
                        ))}
                      </div>
                    )}

                    {q.orText && (
                      <>
                        <div className="or-divider">OR</div>
                        <div className="or-alt-text">{q.orText}</div>
                      </>
                    )}

                    {showMarkingScheme && (
                      <div className="answer-box">
                        <strong>Marking Scheme:</strong> <span>{q.answer ? q.answer : "No Marking Scheme added yet."}</span>
                      </div>
                    )}
                  </div>

                  <div className="question-actions">
                    {divisions && q.division && <span className="division-badge">{q.division}</span>}
                    <span className="question-marks">{marksLabel(q.marks)}</span>
                    <button type="button" className="btn-icon" title="Move Up" disabled={index === 0} onClick={() => onMove(q.id, -1)}>
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      title="Move Down"
                      disabled={index === block.items.length - 1}
                      onClick={() => onMove(q.id, 1)}
                    >
                      ↓
                    </button>
                    <button type="button" className="btn-bank" title="Save to Question Bank" onClick={() => onSaveToBank(q)}>
                      + Bank
                    </button>
                    <button type="button" className="btn-edit" onClick={() => onEdit(q.id)}>
                      Edit
                    </button>
                    <button type="button" className="btn-remove" onClick={() => onRemove(q, number)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
