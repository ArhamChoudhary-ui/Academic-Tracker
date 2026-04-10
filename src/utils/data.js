export const SUBJECTS = [
  "Probability and Statistics",
  "Discrete Maths",
  "DSA",
  "Physics",
  "OOPS",
  "OS",
  "Software Engineering",
  "Chemistry",
  "English",
];

export const DEFAULT_WEIGHTAGE = {
  internal: 75,
  lab: 25,
};

export const SUBJECT_WEIGHTAGE = {
  OOPS: {
    internal: 50,
    lab: 50,
  },
};

export const getSubjectWeightage = (subject) => {
  return SUBJECT_WEIGHTAGE[subject] || DEFAULT_WEIGHTAGE;
};

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
  internal: DEFAULT_WEIGHTAGE.internal, // Default scaled internal total
  lab: DEFAULT_WEIGHTAGE.lab, // Default scaled lab
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
