import { clamp, getGrade } from "./calculations";

/**
 * Assessment components grouped by theory vs lab.
 * Each component stores a raw mark entered out of `max`;
 * its percentage is derived as (mark / max) * 100.
 */
export const THEORY_COMPONENTS = [
  { key: "cat1", label: "CAT-1", max: 50 },
  { key: "cat2", label: "CAT-2", max: 50 },
  { key: "assignments", label: "Assignments", max: 10 },
  { key: "theoryFat", label: "Theory FAT", max: 100 },
];

export const LAB_COMPONENTS = [
  { key: "labExperiments", label: "Lab Experiments", max: 100 },
  { key: "labFat", label: "Lab FAT", max: 100 },
];

export const CREDIT_PRESETS = [
  { label: "Theory only", theory: 4, lab: 0 },
  { label: "3 + 1", theory: 3, lab: 1 },
  { label: "2 + 1", theory: 2, lab: 1 },
  { label: "1 + 1", theory: 1, lab: 1 },
  { label: "Lab only", theory: 0, lab: 1 },
];

const DEFAULT_MARKS = Object.fromEntries(
  [...THEORY_COMPONENTS, ...LAB_COMPONENTS].map((component) => [
    component.key,
    "",
  ]),
);

const uid = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Create a fresh subject entry. Marks are stored as raw strings so inputs
 * stay fully controlled (typing "8." never snaps to "8" mid-edit).
 */
export const createEmptySubject = (overrides = {}) => ({
  id: uid(),
  name: "New Subject",
  theoryCredits: 3,
  labCredits: 0,
  ...overrides,
  marks: { ...DEFAULT_MARKS, ...(overrides.marks || {}) },
});

export const componentPercentage = (value, max) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = typeof value === "number" ? value : parseFloat(value);
  if (Number.isNaN(num)) return null;
  return clamp((num / max) * 100, 0, 100);
};

const average = (values) => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Compute a single subject's credit split and credit-weighted final grade.
 *
 *   Final % = Theory Score % × (Theory Credits / Total Credits)
 *           + Lab Score %    × (Lab Credits / Total Credits)
 *
 * Theory/lab scores are the mean percentage of the components entered for
 * that side. Theory-only (lab credits = 0) and lab-only (theory credits = 0)
 * subjects naturally reduce to a single side.
 */
export const calculateSubject = (subject) => {
  const theoryCredits = Math.max(0, Number(subject.theoryCredits) || 0);
  const labCredits = Math.max(0, Number(subject.labCredits) || 0);
  const totalCredits = theoryCredits + labCredits;
  const theoryWeight = totalCredits > 0 ? theoryCredits / totalCredits : 0;
  const labWeight = totalCredits > 0 ? labCredits / totalCredits : 0;

  const theoryPcts = THEORY_COMPONENTS.map((component) =>
    componentPercentage(subject.marks?.[component.key], component.max),
  ).filter((pct) => pct !== null);
  const labPcts = LAB_COMPONENTS.map((component) =>
    componentPercentage(subject.marks?.[component.key], component.max),
  ).filter((pct) => pct !== null);

  const theoryScore = theoryPcts.length > 0 ? average(theoryPcts) : 0;
  const labScore = labPcts.length > 0 ? average(labPcts) : 0;
  const finalPct =
    totalCredits > 0 ? theoryScore * theoryWeight + labScore * labWeight : 0;

  return {
    theoryCredits,
    labCredits,
    totalCredits,
    theoryWeight,
    labWeight,
    theoryScore,
    labScore,
    finalPct,
    entered: theoryPcts.length + labPcts.length,
    grade: getGrade(finalPct),
  };
};

/**
 * Overall cumulative result across all subjects: credit-weighted average of
 * each subject's final percentage, plus a 10.0-scale CGPA.
 */
export const calculateOverall = (subjects) => {
  const results = subjects.map((subject) => ({
    subject,
    result: calculateSubject(subject),
  }));
  const valid = results.filter((r) => r.result.totalCredits > 0);
  const totalCredits = valid.reduce(
    (sum, r) => sum + r.result.totalCredits,
    0,
  );
  const weightedSum = valid.reduce(
    (sum, r) => sum + r.result.finalPct * r.result.totalCredits,
    0,
  );
  const overallPct = totalCredits > 0 ? weightedSum / totalCredits : 0;
  const entered = results.reduce((sum, r) => sum + r.result.entered, 0);

  return {
    results,
    totalCredits,
    overallPct,
    cgpa: overallPct / 10,
    entered,
  };
};