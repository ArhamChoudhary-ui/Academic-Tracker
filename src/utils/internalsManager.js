/**
 * internalsManager.js
 *
 * Manages the dynamic internal continuous assessment structure per subject.
 * Default format: three 10-mark quizzes (10-10-10) totaling 30 marks.
 * Users can customize this per subject to any combination:
 * e.g., 20-mark Case Study + 10-mark Quiz, 30-mark Project, 15+15 Assignments, etc.
 */

const STORAGE_KEY = "academic_tracker_subject_internals";

export const DEFAULT_INTERNAL_STRUCTURE = [
  { id: "quiz1", label: "Quiz 1", max: 10 },
  { id: "quiz2", label: "Quiz 2", max: 10 },
  { id: "quiz3", label: "Quiz 3", max: 10 },
];

export const INTERNAL_PRESETS = [
  {
    id: "three_quizzes",
    name: "Three Quizzes (10 + 10 + 10)",
    description: "Default standard: 3 quizzes of 10 marks each",
    tasks: [
      { id: "quiz1", label: "Quiz 1", max: 10 },
      { id: "quiz2", label: "Quiz 2", max: 10 },
      { id: "quiz3", label: "Quiz 3", max: 10 },
    ],
  },
  {
    id: "case_study_quiz",
    name: "Case Study + Quiz (20 + 10)",
    description: "In-depth case study (20 marks) and knowledge quiz (10 marks)",
    tasks: [
      { id: "case_study", label: "Case Study", max: 20 },
      { id: "quiz1", label: "Quiz", max: 10 },
    ],
  },
  {
    id: "term_project",
    name: "Term Project (30)",
    description: "Single comprehensive semester project evaluation",
    tasks: [
      { id: "project", label: "Term Project", max: 30 },
    ],
  },
  {
    id: "dual_assignments",
    name: "Two Assignments (15 + 15)",
    description: "Two continuous assessment assignments of 15 marks each",
    tasks: [
      { id: "assignment1", label: "Assignment 1", max: 15 },
      { id: "assignment2", label: "Assignment 2", max: 15 },
    ],
  },
  {
    id: "project_quiz",
    name: "Mini Project + Quiz (20 + 10)",
    description: "Practical project work (20 marks) and quiz (10 marks)",
    tasks: [
      { id: "mini_project", label: "Mini Project", max: 20 },
      { id: "quiz1", label: "Quiz", max: 10 },
    ],
  },
  {
    id: "research_presentation",
    name: "Paper + Presentation (20 + 10)",
    description: "Research paper review (20 marks) and seminar presentation (10 marks)",
    tasks: [
      { id: "research_paper", label: "Research Paper", max: 20 },
      { id: "presentation", label: "Presentation", max: 10 },
    ],
  },
];

let inMemoryInternalsCache = null;

function getStore() {
  if (inMemoryInternalsCache !== null) {
    return inMemoryInternalsCache;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    inMemoryInternalsCache = raw ? JSON.parse(raw) : {};
  } catch {
    inMemoryInternalsCache = {};
  }
  return inMemoryInternalsCache;
}

function persistStore(store) {
  inMemoryInternalsCache = store;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage quota or private mode fallback
  }
}

/**
 * Get internal assessment tasks for a specific subject.
 * Defaults to 3 quizzes of 10 marks each if not customized.
 */
export function getSubjectInternals(subject) {
  if (!subject) return [...DEFAULT_INTERNAL_STRUCTURE];
  const store = getStore();
  const custom = store[subject];
  if (Array.isArray(custom) && custom.length > 0) {
    return custom;
  }
  return [...DEFAULT_INTERNAL_STRUCTURE];
}

/**
 * Save customized internal assessment tasks for a specific subject.
 */
export function saveSubjectInternals(subject, tasks) {
  if (!subject || !Array.isArray(tasks)) return;
  const store = { ...getStore() };
  store[subject] = tasks;
  persistStore(store);
}

/**
 * Load all subject internals mappings.
 */
export function loadAllSubjectInternals() {
  return { ...getStore() };
}

/**
 * Apply a chosen internal tasks structure across all enrolled subjects.
 */
export function applyInternalsToAllSubjects(tasks, subjectsList = []) {
  const store = { ...getStore() };
  subjectsList.forEach((subject) => {
    store[subject] = tasks.map((t) => ({ ...t }));
  });
  persistStore(store);
}

/**
 * Reset a subject's internal structure to the default 10-10-10 format.
 */
export function resetSubjectInternals(subject) {
  const store = { ...getStore() };
  delete store[subject];
  persistStore(store);
}

/**
 * Calculate the total maximum internal marks for a set of tasks (default is 30).
 */
export function getTotalInternalMax(tasks = []) {
  return tasks.reduce((sum, task) => sum + (Number(task.max) || 0), 0);
}
