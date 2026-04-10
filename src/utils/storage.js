import {
  SUBJECTS,
  createEmptyMarks,
  mergeWithDefaultSubjectData,
} from "./data";

const STORAGE_KEY = "academic_tracker_data";
const THEME_KEY = "academic_tracker_theme";
const WEIGHTS_KEY = "academic_tracker_weights";
export const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};
export const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? mergeWithDefaultSubjectData(JSON.parse(data)) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Error saving theme:", error);
  }
};
export const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch (error) {
    console.error("Error loading theme:", error);
    return "light";
  }
};
export const saveWeights = (weights) => {
  try {
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  } catch (error) {
    console.error("Error saving weights:", error);
  }
};
export const loadWeights = () => {
  try {
    const weights = localStorage.getItem(WEIGHTS_KEY);
    return weights ? JSON.parse(weights) : null;
  } catch (error) {
    console.error("Error loading weights:", error);
    return null;
  }
};
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WEIGHTS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};
export const exportToCSV = (data) => {
  const normalizedData = mergeWithDefaultSubjectData(data);
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
  for (const subject of SUBJECTS) {
    const subjectData = normalizedData[subject] || {};
    const marks = subjectData.marks || createEmptyMarks();
    const total = Object.values(marks).reduce((sum, val) => {
      return (
        sum +
        (val !== null && val !== undefined && !isNaN(val) ? Number(val) : 0)
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
