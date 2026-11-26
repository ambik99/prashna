import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_META, PAPER_VERSION, parsePaper } from "./index.ts";

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(new URL(`../../../tests/fixtures/${name}`, import.meta.url), "utf8"));

describe("parsePaper", () => {
  it("opens a Paper file saved by version 10 of the tool", () => {
    const result = parsePaper(fixture("paper-saved-by-v10.json"));
    if (!result.ok) throw new Error(result.message);
    const { paper } = result;

    expect(paper.version).toBe(PAPER_VERSION);
    expect(paper.meta.school).toBe("Fixture High School, Jalpaiguri");
    expect(paper.meta.targetMarks).toBe(80);
    expect(paper.meta.divisionMode).toBe("Combined");
    expect(paper.questions).toHaveLength(6);
    expect(paper.questions.map((q) => q.marks)).toEqual([1, 1, 2, 3, 5, 4]);
    // The v10 file has no Science Divisions on its Questions.
    expect(paper.questions.every((q) => q.division === "")).toBe(true);
    expect(paper.questions[4]?.orText).toBe(
      "Explain esterification and saponification reactions with balanced chemical equations.",
    );
    expect(paper.nextId).toBe(7);
  });

  it("rejects a JSON file that is not a Paper", () => {
    const result = parsePaper(fixture("not-a-paper.json"));
    expect(result).toMatchObject({ ok: false, reason: "not-a-paper" });
  });

  it("rejects a Paper from a newer version of Prashna", () => {
    const result = parsePaper({ version: PAPER_VERSION + 1, meta: {}, questions: [] });
    expect(result).toMatchObject({ ok: false, reason: "newer-version" });
  });

  it("fills missing details and Question fields the way the old app did", () => {
    const result = parsePaper({
      meta: { subject: "Mathematics", sectionMarks: { "Section B": 3 } },
      questions: [{ section: "Section B", text: "Prove that √2 is irrational." }],
    });
    if (!result.ok) throw new Error(result.message);
    const { paper } = result;

    expect(paper.meta.subject).toBe("Mathematics");
    expect(paper.meta.school).toBe(DEFAULT_META.school);
    expect(paper.meta.showWatermark).toBe(true);
    expect(paper.meta.sectionMarks).toEqual({ ...DEFAULT_META.sectionMarks, "Section B": 3 });
    expect(paper.questions[0]).toMatchObject({ id: 1, type: "standard", division: "", options: [], marks: 0 });
    expect(paper.nextId).toBe(2);
  });

  it("numbers Questions without an id after the highest existing id", () => {
    const result = parsePaper({
      meta: {},
      questions: [
        { id: 5, section: "Section A" },
        { section: "Section A" },
      ],
      nextId: 3,
    });
    if (!result.ok) throw new Error(result.message);
    expect(result.paper.questions.map((q) => q.id)).toEqual([5, 6]);
    expect(result.paper.nextId).toBe(7);
  });
});
