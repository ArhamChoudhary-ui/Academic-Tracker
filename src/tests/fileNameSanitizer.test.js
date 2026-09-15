import { describe, it, expect } from "vitest";
import {
  sanitizeDisplayFileName,
  getSafeDownloadFileName,
} from "../utils/fileNameSanitizer";

describe("fileNameSanitizer", () => {
  it("completely strips .freebuff extension", () => {
    const result = sanitizeDisplayFileName("physics_syllabus.pdf.freebuff", "Physics");
    expect(result).not.toContain(".freebuff");
    expect(result).not.toContain(".pdf");
  });

  it("sanitizes raw machine-generated filenames into human document titles", () => {
    const result = sanitizeDisplayFileName("dsa_lecture_notes_v2_compressed.pdf.freebuff", "DSA");
    expect(result).not.toContain(".freebuff");
    expect(result).toContain("Dsa Lecture Notes");
  });

  it("handles null or undefined by providing a natural subject-based title", () => {
    expect(sanitizeDisplayFileName(null, "Chemistry")).toBe("Chemistry Course Syllabus");
    expect(sanitizeDisplayFileName(undefined, "Maths")).toBe("Maths Course Syllabus");
  });

  it("handles random numbers or hashes gracefully", () => {
    const result = sanitizeDisplayFileName("1692837492.pdf.freebuff", "Operating Systems");
    expect(result).toBe("Operating Systems Course Outline");
  });

  it("getSafeDownloadFileName returns clean standard .pdf name without raw backend artifacts", () => {
    const safeName = getSafeDownloadFileName("raw_server_blob_123.pdf.freebuff", "Physics");
    expect(safeName).toMatch(/\.pdf$/);
    expect(safeName).not.toContain(".freebuff");
  });
});
