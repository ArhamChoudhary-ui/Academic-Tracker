/**
 * academicCalculator.js
 * 
 * Centralized calculations, VIT grade mapping, validation, and storage
 * for the VIT Academic Calculator.
 */

export const STORAGE_KEY = "academicCalculatorState";

// ─── Centralized VIT Grade System ─────────────────────────────────────────────

export const GRADE_POINTS = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};

export const GRADE_OPTIONS = ["S", "A", "B", "C", "D", "E", "F"];

export const GRADE_DESCRIPTIONS = {
  S: "Outstanding (10)",
  A: "Excellent (9)",
  B: "Very Good (8)",
  C: "Good (7)",
  D: "Fair (6)",
  E: "Pass (5)",
  F: "Fail (0)",
};

/**
 * Non-performance grades that do not carry grade points and must not
 * contribute to the GPA/CGPA credit-weighted calculation.
 */
export const NON_POINT_GRADES = ["W", "U", "P", "Y"];

// ─── Default Generators ───────────────────────────────────────────────────────

export const createInitialCourses = () => [
  { id: "c-1", name: "Data Structures", credits: 4, grade: "S" },
  { id: "c-2", name: "Operating Systems", credits: 3, grade: "A" },
  { id: "c-3", name: "Mathematics", credits: 4, grade: "B" },
  { id: "c-4", name: "Python Lab", credits: 2, grade: "S" },
];

export const createInitialSemesters = () => [
  { id: "sem-1", name: "Semester 1", gpa: "", credits: "" },
  { id: "sem-2", name: "Semester 2", gpa: "", credits: "" },
  { id: "sem-3", name: "Semester 3", gpa: "", credits: "" },
  { id: "sem-4", name: "Semester 4", gpa: "", credits: "" },
  { id: "sem-5", name: "Semester 5", gpa: "", credits: "" },
  { id: "sem-6", name: "Semester 6", gpa: "", credits: "" },
  { id: "sem-7", name: "Semester 7", gpa: "", credits: "" },
  { id: "sem-8", name: "Semester 8", gpa: "", credits: "" },
];

export const createInitialCourseWiseSemesters = () => [
  {
    id: "cw-sem-1",
    name: "Semester 1",
    courses: [
      { id: "cw-1-1", name: "Calculus for Engineers", credits: 4, grade: "A" },
      { id: "cw-1-2", name: "Structured Programming", credits: 4, grade: "S" },
      { id: "cw-1-3", name: "Engineering Physics", credits: 3, grade: "B" },
    ],
  },
  {
    id: "cw-sem-2",
    name: "Semester 2",
    courses: [
      { id: "cw-2-1", name: "Discrete Mathematics", credits: 4, grade: "S" },
      { id: "cw-2-2", name: "Digital Logic & Design", credits: 4, grade: "A" },
    ],
  },
];

// ─── Validation Helpers ───────────────────────────────────────────────────────

/**
 * Validates a single course row.
 * Returns null if valid, or an error string if invalid.
 */
export function validateCourse(course) {
  if (!course) return "Course data is missing.";
  const cred = parseFloat(course.credits);
  if (isNaN(cred) || cred <= 0) {
    return "Credits must be greater than 0.";
  }
  if (!course.grade || typeof GRADE_POINTS[course.grade] !== "number") {
    if (NON_POINT_GRADES.includes(course.grade)) {
      return `Grade ${course.grade} is a non-point grade and excluded from GPA.`;
    }
    return "Select a valid grade (S, A, B, C, D, E, F).";
  }
  return null;
}

/**
 * Validates a single semester row.
 * Returns null if valid, or an error string if invalid.
 */
export function validateSemester(semester) {
  if (!semester) return "Semester data is missing.";
  // Both empty is considered unfilled, not invalid
  if (
    (semester.gpa === "" || semester.gpa === undefined || semester.gpa === null) &&
    (semester.credits === "" || semester.credits === undefined || semester.credits === null)
  ) {
    return null;
  }
  const gpa = parseFloat(semester.gpa);
  const credits = parseFloat(semester.credits);

  if (isNaN(gpa) || gpa < 0 || gpa > 10) {
    return "Enter a GPA between 0 and 10.";
  }
  if (isNaN(credits) || credits <= 0) {
    return "Credits must be greater than 0.";
  }
  return null;
}

// ─── Instant GPA Calculation ──────────────────────────────────────────────────

/**
 * Calculates credit-weighted GPA for a list of courses.
 * GPA = Σ(Credit × Grade Point) / Σ(Credits)
 * 
 * Rounding: displayed GPA rounded to 2 decimal places. Intermediate calculations unrounded.
 */
export function calculateGPA(courses = []) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return {
      gpa: 0,
      gpaFormatted: "0.00",
      totalCredits: 0,
      totalGradePoints: 0,
      validCoursesCount: 0,
      isValid: false,
    };
  }

  let totalCredits = 0;
  let totalGradePoints = 0;
  let validCoursesCount = 0;

  for (const course of courses) {
    const credits = parseFloat(course.credits);
    const grade = course.grade;

    if (
      !isNaN(credits) &&
      credits > 0 &&
      grade &&
      typeof GRADE_POINTS[grade] === "number" &&
      !NON_POINT_GRADES.includes(grade)
    ) {
      const gradePoint = GRADE_POINTS[grade];
      totalCredits += credits;
      totalGradePoints += credits * gradePoint;
      validCoursesCount += 1;
    }
  }

  if (totalCredits <= 0) {
    return {
      gpa: 0,
      gpaFormatted: "0.00",
      totalCredits: 0,
      totalGradePoints: 0,
      validCoursesCount,
      isValid: false,
    };
  }

  const rawGpa = totalGradePoints / totalCredits;
  const gpa = Math.round(rawGpa * 100) / 100;
  const gpaFormatted = rawGpa.toFixed(2);

  return {
    gpa,
    gpaFormatted,
    rawGpa,
    totalCredits: Math.round(totalCredits * 100) / 100,
    totalGradePoints: Math.round(totalGradePoints * 100) / 100,
    validCoursesCount,
    isValid: true,
  };
}

// ─── CGPA Calculation (Semester-Level) ────────────────────────────────────────

/**
 * Calculates credit-weighted CGPA across semesters.
 * CGPA = Σ(Semester GPA × Semester Credits) / Σ(Semester Credits)
 * 
 * Important VIT Rule: Never simply averages semester GPAs. Always weights by semester credits.
 */
export function calculateCGPA(semesters = []) {
  if (!Array.isArray(semesters) || semesters.length === 0) {
    return {
      cgpa: 0,
      cgpaFormatted: "0.00",
      totalCredits: 0,
      totalQualityPoints: 0,
      validSemestersCount: 0,
      isValid: false,
    };
  }

  let totalCredits = 0;
  let totalQualityPoints = 0;
  let validSemestersCount = 0;

  for (const sem of semesters) {
    const gpa = parseFloat(sem.gpa);
    const credits = parseFloat(sem.credits);

    if (
      !isNaN(gpa) &&
      gpa >= 0 &&
      gpa <= 10 &&
      !isNaN(credits) &&
      credits > 0
    ) {
      totalCredits += credits;
      totalQualityPoints += gpa * credits;
      validSemestersCount += 1;
    }
  }

  if (totalCredits <= 0) {
    return {
      cgpa: 0,
      cgpaFormatted: "0.00",
      totalCredits: 0,
      totalQualityPoints: 0,
      validSemestersCount,
      isValid: false,
    };
  }

  const rawCgpa = totalQualityPoints / totalCredits;
  const cgpa = Math.round(rawCgpa * 100) / 100;
  const cgpaFormatted = rawCgpa.toFixed(2);

  return {
    cgpa,
    cgpaFormatted,
    rawCgpa,
    totalCredits: Math.round(totalCredits * 100) / 100,
    totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
    validSemestersCount,
    isValid: true,
  };
}

// ─── Course-Level CGPA Calculation (Optional Advanced Mode) ───────────────────

/**
 * Calculates CGPA directly from individual course rows across all semesters.
 * CGPA = Σ(Course Credits × Grade Point) / Σ(Course Credits)
 */
export function calculateCourseLevelCGPA(semestersWithCourses = []) {
  if (!Array.isArray(semestersWithCourses) || semestersWithCourses.length === 0) {
    return {
      cgpa: 0,
      cgpaFormatted: "0.00",
      totalCredits: 0,
      totalGradePoints: 0,
      courseCount: 0,
      semesterCount: 0,
      isValid: false,
    };
  }

  let allCourses = [];
  let semesterCount = 0;

  for (const sem of semestersWithCourses) {
    if (Array.isArray(sem.courses) && sem.courses.length > 0) {
      semesterCount += 1;
      allCourses.push(...sem.courses);
    }
  }

  const gpaResult = calculateGPA(allCourses);

  return {
    cgpa: gpaResult.gpa,
    cgpaFormatted: gpaResult.gpaFormatted,
    rawCgpa: gpaResult.rawGpa,
    totalCredits: gpaResult.totalCredits,
    totalGradePoints: gpaResult.totalGradePoints,
    courseCount: gpaResult.validCoursesCount,
    semesterCount,
    isValid: gpaResult.isValid,
  };
}

// ─── Target GPA / What-If Calculation ─────────────────────────────────────────

/**
 * Calculates the required average GPA for upcoming credits to attain target CGPA.
 * 
 * Formula:
 * Required GPA = (Target CGPA × (Current Credits + Upcoming Credits) - Current CGPA × Current Credits) / Upcoming Credits
 */
export function calculateRequiredGPA(currentCGPA, currentCredits, upcomingCredits, targetCGPA) {
  const cGpa = parseFloat(currentCGPA);
  const cCred = parseFloat(currentCredits);
  const uCred = parseFloat(upcomingCredits);
  const tGpa = parseFloat(targetCGPA);

  if (isNaN(cGpa) || cGpa < 0 || cGpa > 10) {
    return {
      requiredGpa: 0,
      requiredGpaFormatted: "0.00",
      isValid: false,
      isAchievable: false,
      isAlreadyMet: false,
      error: "Enter a valid Current CGPA between 0 and 10.",
    };
  }

  if (isNaN(cCred) || cCred < 0) {
    return {
      requiredGpa: 0,
      requiredGpaFormatted: "0.00",
      isValid: false,
      isAchievable: false,
      isAlreadyMet: false,
      error: "Completed credits must be 0 or greater.",
    };
  }

  if (isNaN(uCred) || uCred <= 0) {
    return {
      requiredGpa: 0,
      requiredGpaFormatted: "0.00",
      isValid: false,
      isAchievable: false,
      isAlreadyMet: false,
      error: "Upcoming credits must be greater than 0.",
    };
  }

  if (isNaN(tGpa) || tGpa < 0 || tGpa > 10) {
    return {
      requiredGpa: 0,
      requiredGpaFormatted: "0.00",
      isValid: false,
      isAchievable: false,
      isAlreadyMet: false,
      error: "Target CGPA must be between 0 and 10.",
    };
  }

  const numerator = tGpa * (cCred + uCred) - cGpa * cCred;
  const rawRequiredGpa = numerator / uCred;
  const roundedRequired = Math.round(rawRequiredGpa * 100) / 100;
  const formatted = rawRequiredGpa.toFixed(2);

  if (rawRequiredGpa > 10) {
    return {
      requiredGpa: roundedRequired,
      requiredGpaFormatted: formatted,
      isValid: true,
      isAchievable: false,
      isAlreadyMet: false,
      error: `That target is not mathematically achievable with the entered credits (requires ${formatted} GPA).`,
    };
  }

  if (rawRequiredGpa <= 0) {
    return {
      requiredGpa: 0,
      requiredGpaFormatted: "0.00",
      isValid: true,
      isAchievable: true,
      isAlreadyMet: true,
      message: "Target is already secured! Even with 0.00 GPA in upcoming credits, you will exceed your target.",
    };
  }

  return {
    requiredGpa: roundedRequired,
    requiredGpaFormatted: formatted,
    rawRequiredGpa,
    isValid: true,
    isAchievable: true,
    isAlreadyMet: false,
    message: `You need to average a ${formatted} GPA across your upcoming ${uCred} credits.`,
  };
}

// ─── Local Storage Persistence ────────────────────────────────────────────────

/**
 * Loads calculator state from localStorage.
 */
export function loadAcademicCalculatorState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return {
        courses: createInitialCourses(),
        semesters: createInitialSemesters(),
        courseWiseSemesters: createInitialCourseWiseSemesters(),
        cgpaMode: "semester", // "semester" or "courses"
        whatIfState: {
          currentCGPA: "",
          currentCredits: "",
          upcomingCredits: 20,
          targetCGPA: 9.0,
        },
      };
    }
    const parsed = JSON.parse(serialized);
    return {
      courses: Array.isArray(parsed.courses) ? parsed.courses : createInitialCourses(),
      semesters: Array.isArray(parsed.semesters) ? parsed.semesters : createInitialSemesters(),
      courseWiseSemesters: Array.isArray(parsed.courseWiseSemesters)
        ? parsed.courseWiseSemesters
        : createInitialCourseWiseSemesters(),
      cgpaMode: parsed.cgpaMode === "courses" ? "courses" : "semester",
      whatIfState: parsed.whatIfState || {
        currentCGPA: "",
        currentCredits: "",
        upcomingCredits: 20,
        targetCGPA: 9.0,
      },
    };
  } catch {
    return {
      courses: createInitialCourses(),
      semesters: createInitialSemesters(),
      courseWiseSemesters: createInitialCourseWiseSemesters(),
      cgpaMode: "semester",
      whatIfState: {
        currentCGPA: "",
        currentCredits: "",
        upcomingCredits: 20,
        targetCGPA: 9.0,
      },
    };
  }
}

/**
 * Saves calculator state to localStorage.
 */
export function saveAcademicCalculatorState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Graceful ignore if localStorage is unavailable
  }
}
