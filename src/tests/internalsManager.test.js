import { describe, it, expect, beforeEach } from "vitest";
import {
  DEFAULT_INTERNAL_STRUCTURE,
  INTERNAL_PRESETS,
  getSubjectInternals,
  saveSubjectInternals,
  applyInternalsToAllSubjects,
  resetSubjectInternals,
  getTotalInternalMax,
} from "../utils/internalsManager";

describe("internalsManager", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to three 10-mark quizzes totaling 30 marks", () => {
    const tasks = getSubjectInternals("Physics");
    expect(tasks).toHaveLength(3);
    expect(tasks[0].max).toBe(10);
    expect(tasks[1].max).toBe(10);
    expect(tasks[2].max).toBe(10);
    expect(getTotalInternalMax(tasks)).toBe(30);
  });

  it("saves and retrieves custom assessment structures per subject", () => {
    const customCaseStudyAndQuiz = [
      { id: "case_study", label: "Case Study Analysis", max: 20 },
      { id: "quiz1", label: "Module Quiz", max: 10 },
    ];
    saveSubjectInternals("OOPS", customCaseStudyAndQuiz);

    const loaded = getSubjectInternals("OOPS");
    expect(loaded).toHaveLength(2);
    expect(loaded[0].label).toBe("Case Study Analysis");
    expect(loaded[0].max).toBe(20);
    expect(loaded[1].max).toBe(10);
    expect(getTotalInternalMax(loaded)).toBe(30);

    // Other subjects remain unaffected default (10-10-10)
    expect(getSubjectInternals("Physics")).toHaveLength(3);
  });

  it("resets a subject back to default 10-10-10 format", () => {
    saveSubjectInternals("DSA", [{ id: "project", label: "Term Project", max: 30 }]);
    expect(getSubjectInternals("DSA")).toHaveLength(1);

    resetSubjectInternals("DSA");
    expect(getSubjectInternals("DSA")).toHaveLength(3);
    expect(getTotalInternalMax(getSubjectInternals("DSA"))).toBe(30);
  });

  it("applies an internal structure to all specified subjects", () => {
    const termProject = [{ id: "project", label: "Term Project", max: 30 }];
    applyInternalsToAllSubjects(termProject, ["SubjA", "SubjB"]);

    expect(getSubjectInternals("SubjA")).toHaveLength(1);
    expect(getSubjectInternals("SubjB")).toHaveLength(1);
    expect(getSubjectInternals("SubjA")[0].max).toBe(30);
  });

  it("contains preset options for standard curriculum formats", () => {
    expect(INTERNAL_PRESETS.length).toBeGreaterThanOrEqual(4);
    const caseStudyPreset = INTERNAL_PRESETS.find((p) => p.id === "case_study_quiz");
    expect(caseStudyPreset).toBeDefined();
    expect(caseStudyPreset.tasks[0].max).toBe(20);
    expect(caseStudyPreset.tasks[1].max).toBe(10);
  });
});
