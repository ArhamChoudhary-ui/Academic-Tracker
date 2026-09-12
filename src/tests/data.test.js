import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SUBJECTS,
  DEFAULT_WEIGHTAGE,
  SUBJECT_WEIGHTAGE,
  getSubjectWeightage,
  createEmptyMarks,
  createEmptyClassAverage,
  createEmptySubjectData,
  ASSESSMENT_COMPONENTS,
} from "../utils/data";

// ─── Constants ────────────────────────────────────────────────────────────────

describe("SUBJECTS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(SUBJECTS)).toBe(true);
    expect(SUBJECTS.length).toBeGreaterThan(0);
  });

  it("contains expected subjects", () => {
    expect(SUBJECTS).toContain("Physics");
    expect(SUBJECTS).toContain("DSA");
  });
});

describe("DEFAULT_WEIGHTAGE", () => {
  it("internal + lab add up to 100", () => {
    expect(DEFAULT_WEIGHTAGE.internal + DEFAULT_WEIGHTAGE.lab).toBe(100);
  });
});

describe("SUBJECT_WEIGHTAGE", () => {
  it("each entry internal + lab = 100", () => {
    for (const [subject, w] of Object.entries(SUBJECT_WEIGHTAGE)) {
      expect(w.internal + w.lab).toBe(100);
    }
  });
});

// ─── getSubjectWeightage ──────────────────────────────────────────────────────

describe("getSubjectWeightage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns DEFAULT_WEIGHTAGE for an unknown subject", () => {
    const result = getSubjectWeightage("Alchemy 101");
    expect(result).toEqual(DEFAULT_WEIGHTAGE);
  });

  it("returns subject-specific weightage when defined", () => {
    const result = getSubjectWeightage("Discrete Mathematics");
    expect(result).toEqual(SUBJECT_WEIGHTAGE["Discrete Mathematics"]);
  });

  it("returns custom weightage stored in localStorage", () => {
    const custom = { internal: 60, lab: 40 };
    localStorage.setItem(
      "academic_tracker_weights",
      JSON.stringify({ CustomSubject: custom })
    );
    const result = getSubjectWeightage("CustomSubject");
    expect(result).toEqual(custom);
  });

  it("falls back to static config when localStorage has corrupt JSON", () => {
    localStorage.setItem("academic_tracker_weights", "not-valid-json");
    // Should not throw; falls back silently
    expect(() => getSubjectWeightage("Physics")).not.toThrow();
    expect(getSubjectWeightage("Physics")).toEqual(DEFAULT_WEIGHTAGE);
  });
});

// ─── Empty state factories ────────────────────────────────────────────────────

describe("createEmptyMarks", () => {
  it("returns an object with all mark keys set to null", () => {
    const marks = createEmptyMarks();
    const expectedKeys = ["cat1", "cat2", "quiz1", "quiz2", "quiz3", "fat", "lab"];
    for (const key of expectedKeys) {
      expect(marks).toHaveProperty(key, null);
    }
  });

  it("returns a fresh object on each call (no shared reference)", () => {
    const a = createEmptyMarks();
    const b = createEmptyMarks();
    a.cat1 = 42;
    expect(b.cat1).toBeNull();
  });
});

describe("createEmptyClassAverage", () => {
  it("returns an object with all keys set to null", () => {
    const avg = createEmptyClassAverage();
    expect(Object.values(avg).every((v) => v === null)).toBe(true);
  });
});

describe("createEmptySubjectData", () => {
  it("returns an object keyed by default SUBJECTS", () => {
    const data = createEmptySubjectData();
    for (const subject of SUBJECTS) {
      expect(data).toHaveProperty(subject);
    }
  });

  it("each subject entry has marks, classAverage, and notes", () => {
    const data = createEmptySubjectData();
    const entry = data[SUBJECTS[0]];
    expect(entry).toHaveProperty("marks");
    expect(entry).toHaveProperty("classAverage");
    expect(entry).toHaveProperty("notes");
  });

  it("accepts a custom subject list", () => {
    const customSubjects = ["TestA", "TestB"];
    const data = createEmptySubjectData(customSubjects);
    expect(Object.keys(data)).toEqual(customSubjects);
  });
});

// ─── ASSESSMENT_COMPONENTS ────────────────────────────────────────────────────

describe("ASSESSMENT_COMPONENTS", () => {
  it("each component has key, label, max, scaledMax", () => {
    for (const comp of ASSESSMENT_COMPONENTS) {
      expect(comp).toHaveProperty("key");
      expect(comp).toHaveProperty("label");
      expect(comp).toHaveProperty("max");
      expect(comp).toHaveProperty("scaledMax");
    }
  });

  it("FAT has max of 100", () => {
    const fat = ASSESSMENT_COMPONENTS.find((c) => c.key === "fat");
    expect(fat?.max).toBe(100);
  });

  it("CAT components have max of 50", () => {
    const cats = ASSESSMENT_COMPONENTS.filter((c) => c.key.startsWith("cat"));
    cats.forEach((c) => expect(c.max).toBe(50));
  });
});
