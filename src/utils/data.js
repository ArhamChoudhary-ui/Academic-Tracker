export const SUBJECTS = [
  "Probability and Statistics",
  "DSA",
  "OOPS",
  "Software Engineering",
  "Chemistry",
  "English",
];
export const ASSESSMENT_COMPONENTS = [
  { key: "cat1", label: "CAT-1", max: 50, scaledMax: 15 },
  { key: "cat2", label: "CAT-2", max: 50, scaledMax: 15 },
  { key: "quiz1", label: "QUIZ-1", max: 10, scaledMax: 10 },
  { key: "quiz2", label: "QUIZ-2", max: 10, scaledMax: 10 },
  { key: "quiz3", label: "QUIZ-3", max: 10, scaledMax: 10 },
  { key: "fat", label: "FAT", max: 100, scaledMax: 40 },
  { key: "lab", label: "LAB", max: 100, scaledMax: 25 },
];
export const MAX_MARKS = {
  internal: 75, // Scaled internal total
  lab: 25, // Scaled lab
  final: 100, // Final total (internal + lab)
};
export const createEmptyMarks = () => ({
  cat1: null,
  cat2: null,
  quiz1: null,
  quiz2: null,
  quiz3: null,
  fat: null,
  lab: null,
});
export const createEmptyClassAverage = () => ({
  cat1: null,
  cat2: null,
  quiz1: null,
  quiz2: null,
  quiz3: null,
  fat: null,
  lab: null,
});
export const createEmptySubjectData = () => {
  const data = {};
  SUBJECTS.forEach((subject) => {
    data[subject] = {
      marks: createEmptyMarks(),
      classAverage: createEmptyClassAverage(),
      notes: "",
    };
  });
  return data;
};
