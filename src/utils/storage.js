import {
  SUBJECTS,
  createEmptyMarks,
  createEmptySubjectData,
  mergeWithDefaultSubjectData,
} from "./data";

const STORAGE_KEY = "academic_tracker_data";
const THEME_KEY = "academic_tracker_theme";
const WEIGHTS_KEY = "academic_tracker_weights";

// TODO: add JSON backup export alongside CSV export
// FIXME: verify quota limits when users store extensive notes

export const saveToStorage = (marksRecordMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(marksRecordMap));
    return true;
  } catch {
    return false;
  }
};

export const loadFromStorage = () => {
  try {
    const rawStoredMarks = localStorage.getItem(STORAGE_KEY);
    if (!rawStoredMarks) {
      return {};
    }
    return mergeWithDefaultSubjectData(JSON.parse(rawStoredMarks));
  } catch {
    return {};
  }
};

export const getSavedSubjects = () => {
  const currentMarksMap = loadFromStorage();
  if (currentMarksMap && Object.keys(currentMarksMap).length > 0) {
    return Object.keys(currentMarksMap);
  }
  return SUBJECTS;
};

export const saveTheme = (selectedThemeMode) => {
  try {
    localStorage.setItem(THEME_KEY, selectedThemeMode);
  } catch {
    // Local storage unavailable
  }
};

export const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
};

export const saveWeights = (subjectWeightageMap) => {
  try {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(subjectWeightageMap));
  } catch {
    // Local storage unavailable
  }
};

export const loadWeights = () => {
  try {
    const rawWeights = localStorage.getItem(WEIGHTS_KEY);
    return rawWeights ? JSON.parse(rawWeights) : {};
  } catch {
    return {};
  }
};

export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WEIGHTS_KEY);
    return true;
  } catch {
    return false;
  }
};

export const exportToCSV = (marksRecordMap) => {
  const normalizedData = mergeWithDefaultSubjectData(marksRecordMap);
  const headers = [
    "Subject",
    "CAT-1",
    "CAT-2",
    "QUIZ-1",
    "QUIZ-2",
    "QUIZ-3",
    "INTERNALS",
    "FAT",
    "LAB",
    "Total",
  ];
  const rows = [];
  const subjects = Object.keys(normalizedData);
  for (const subject of subjects) {
    const subjectEntry = normalizedData[subject] || {};
    const marks = subjectEntry.marks || createEmptyMarks();
    const total = Object.values(marks).reduce((sum, scoreValue) => {
      return (
        sum +
        (scoreValue !== null && scoreValue !== undefined && !isNaN(scoreValue)
          ? Number(scoreValue)
          : 0)
      );
    }, 0);
    rows.push([
      subject,
      marks.cat1 || 0,
      marks.cat2 || 0,
      marks.quiz1 || 0,
      marks.quiz2 || 0,
      marks.quiz3 || 0,
      marks.internals?.toFixed(2) || 0,
      marks.fat || 0,
      marks.lab || 0,
      total.toFixed(2),
    ]);
  }
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `academic_marks_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
