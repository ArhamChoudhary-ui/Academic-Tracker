export const SUBJECTS = [
  "Probability and Statistics",
  "Discrete Mathematics",
  "DSA",
  "Physics",
  "OOPS",
  "Operating Systems (OS)",
  "Software Engineering",
  "Chemistry",
  "English",
];

const SUBJECT_ALIASES = {
  "Discrete Maths": "Discrete Mathematics",
  OS: "Operating Systems (OS)",
  "Operating Systems": "Operating Systems (OS)",
};

export const DEFAULT_WEIGHTAGE = {
  internal: 75,
  lab: 25,
};

export const SUBJECT_WEIGHTAGE = {
  "Discrete Mathematics": {
    internal: 100,
    lab: 0,
  },
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

export const mergeWithDefaultSubjectData = (savedData) => {
  const defaultData = createEmptySubjectData();

  if (!savedData || typeof savedData !== "object") {
    return defaultData;
  }

  const normalizedSavedData = { ...savedData };

  Object.entries(SUBJECT_ALIASES).forEach(([legacyName, canonicalName]) => {
    if (
      normalizedSavedData[legacyName] &&
      !normalizedSavedData[canonicalName]
    ) {
      normalizedSavedData[canonicalName] = normalizedSavedData[legacyName];
    }
  });

  return SUBJECTS.reduce((acc, subject) => {
    const defaultSubjectData = defaultData[subject];
    const savedSubjectData = normalizedSavedData[subject] || {};

    acc[subject] = {
      ...defaultSubjectData,
      ...savedSubjectData,
      marks: {
        ...defaultSubjectData.marks,
        ...(savedSubjectData.marks || {}),
      },
      classAverage: {
        ...defaultSubjectData.classAverage,
        ...(savedSubjectData.classAverage || {}),
      },
      notes:
        typeof savedSubjectData.notes === "string" ?
          savedSubjectData.notes
        : "",
    };

    return acc;
  }, {});
};
