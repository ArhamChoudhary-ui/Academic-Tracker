import { describe, it, expect } from "vitest";
import { buildStudyNotes } from "../utils/studyNotesBuilder";

describe("buildStudyNotes", () => {
  const MINIMAL_PDF_TEXT = "Introduction to Physics\nThis covers force and motion.\nNewton defined force as mass times acceleration.";

  it("returns a non-empty string", () => {
    const result = buildStudyNotes(MINIMAL_PDF_TEXT, "Physics");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(50);
  });

  it("includes the subject name in the output", () => {
    const result = buildStudyNotes(MINIMAL_PDF_TEXT, "Physics");
    expect(result).toContain("Physics");
  });

  it("includes the SUMMARY section header", () => {
    const result = buildStudyNotes(MINIMAL_PDF_TEXT, "Physics");
    expect(result).toContain("SUMMARY");
  });

  it("includes practice questions section", () => {
    const result = buildStudyNotes(MINIMAL_PDF_TEXT, "Physics");
    expect(result).toContain("QUESTIONS FOR PRACTICE");
  });

  it("includes the one-page revision section", () => {
    const result = buildStudyNotes(MINIMAL_PDF_TEXT, "Physics");
    expect(result).toContain("ONE-PAGE REVISION");
  });

  it("detects definition sentences and surfaces them", () => {
    const textWithDefinition = "Newton defined force as mass times acceleration.";
    const result = buildStudyNotes(textWithDefinition, "Physics");
    expect(result).toContain("Definitions Found");
  });

  it("handles completely empty PDF text without throwing", () => {
    expect(() => buildStudyNotes("", "Physics")).not.toThrow();
  });

  it("falls back to subject name as title when no headings found", () => {
    const plainText = "some lowercase text with no headings at all here.";
    const result = buildStudyNotes(plainText, "Chemistry");
    expect(result).toContain("Chemistry Study Notes");
  });

  it("does not include raw page-number-only lines in output", () => {
    const textWithPageNumbers = "Some content\n42\nMore content\n43";
    const result = buildStudyNotes(textWithPageNumbers, "Maths");
    // Page numbers stripped — the output should not have bare "42" lines
    // (they may appear as part of other numbers but not standalone)
    const lines = result.split("\n").map((l) => l.trim());
    expect(lines).not.toContain("42");
  });
});
