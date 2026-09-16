import { describe, it, expect } from "vitest";
import {
  GRADE_POINTS,
  NON_POINT_GRADES,
  calculateGPA,
  calculateCGPA,
  calculateCourseLevelCGPA,
  calculateRequiredGPA,
  validateCourse,
  validateSemester,
} from "../utils/academicCalculator";

describe("academicCalculator - VIT Grade Mapping", () => {
  it("centralizes standard VIT grade points", () => {
    expect(GRADE_POINTS.S).toBe(10);
    expect(GRADE_POINTS.A).toBe(9);
    expect(GRADE_POINTS.B).toBe(8);
    expect(GRADE_POINTS.C).toBe(7);
    expect(GRADE_POINTS.D).toBe(6);
    expect(GRADE_POINTS.E).toBe(5);
    expect(GRADE_POINTS.F).toBe(0);
  });

  it("identifies non-point grades that must not carry grade points", () => {
    expect(NON_POINT_GRADES).toContain("W");
    expect(NON_POINT_GRADES).toContain("U");
    expect(NON_POINT_GRADES).toContain("P");
    expect(NON_POINT_GRADES).toContain("Y");
  });
});

describe("calculateGPA (Instant GPA)", () => {
  it("computes exact credit-weighted GPA matching the prompt example", () => {
    const courses = [
      { name: "Data Structures", credits: 4, grade: "S" }, // 4 * 10 = 40
      { name: "Operating Systems", credits: 3, grade: "A" }, // 3 * 9 = 27
      { name: "Mathematics", credits: 4, grade: "B" }, // 4 * 8 = 32
    ];
    // Total credits = 11, points = 99 -> 99 / 11 = 9.00
    const result = calculateGPA(courses);
    expect(result.isValid).toBe(true);
    expect(result.totalCredits).toBe(11);
    expect(result.totalGradePoints).toBe(99);
    expect(result.gpaFormatted).toBe("9.00");
    expect(result.gpa).toBe(9.00);
    expect(result.validCoursesCount).toBe(3);
  });

  it("ignores non-performance grades (e.g. W, U, P, Y)", () => {
    const courses = [
      { name: "Math", credits: 4, grade: "S" }, // 40
      { name: "Audit Course", credits: 2, grade: "P" }, // Ignored
      { name: "Withdrawn Course", credits: 3, grade: "W" }, // Ignored
    ];
    const result = calculateGPA(courses);
    expect(result.totalCredits).toBe(4);
    expect(result.totalGradePoints).toBe(40);
    expect(result.gpaFormatted).toBe("10.00");
  });

  it("handles decimal credits accurately", () => {
    const courses = [
      { name: "Lab", credits: 1.5, grade: "S" }, // 15
      { name: "Seminar", credits: 0.5, grade: "A" }, // 4.5
    ];
    // 19.5 / 2 = 9.75
    const result = calculateGPA(courses);
    expect(result.totalCredits).toBe(2);
    expect(result.totalGradePoints).toBe(19.5);
    expect(result.gpaFormatted).toBe("9.75");
  });

  it("handles empty or invalid courses safely without NaN or Infinity", () => {
    expect(calculateGPA([]).gpaFormatted).toBe("0.00");
    expect(calculateGPA(null).isValid).toBe(false);
    expect(calculateGPA([{ credits: 0, grade: "S" }]).gpaFormatted).toBe("0.00");
    expect(calculateGPA([{ credits: -4, grade: "S" }]).gpaFormatted).toBe("0.00");
  });
});

describe("calculateCGPA (Semester-Level)", () => {
  it("strictly uses credit-weighted formula instead of simple average", () => {
    const semesters = [
      { gpa: 9.1, credits: 20 }, // 182
      { gpa: 8.5, credits: 24 }, // 204
    ];
    // Total credits = 44, Quality Points = 386 -> 386 / 44 = 8.7727... -> 8.77
    // Notice simple average would be (9.1 + 8.5) / 2 = 8.80
    const result = calculateCGPA(semesters);
    expect(result.isValid).toBe(true);
    expect(result.totalCredits).toBe(44);
    expect(result.cgpaFormatted).toBe("8.77");
    expect(result.cgpa).toBe(8.77);
  });

  it("handles partially filled semesters, skipping unfilled ones", () => {
    const semesters = [
      { gpa: "9.00", credits: "20" },
      { gpa: "", credits: "" },
      { gpa: "8.50", credits: "20" },
    ];
    const result = calculateCGPA(semesters);
    expect(result.validSemestersCount).toBe(2);
    expect(result.totalCredits).toBe(40);
    expect(result.cgpaFormatted).toBe("8.75");
  });

  it("ignores invalid GPA entries (e.g. negative or > 10)", () => {
    const semesters = [
      { gpa: 11, credits: 20 }, // Invalid
      { gpa: -2, credits: 20 }, // Invalid
      { gpa: 9.0, credits: 20 }, // Valid
    ];
    const result = calculateCGPA(semesters);
    expect(result.validSemestersCount).toBe(1);
    expect(result.totalCredits).toBe(20);
    expect(result.cgpaFormatted).toBe("9.00");
  });
});

describe("calculateCourseLevelCGPA", () => {
  it("computes cumulative GPA across multiple semester course lists", () => {
    const semestersWithCourses = [
      {
        courses: [
          { credits: 4, grade: "S" }, // 40
          { credits: 4, grade: "A" }, // 36
        ],
      },
      {
        courses: [
          { credits: 4, grade: "B" }, // 32
        ],
      },
    ];
    // 108 / 12 = 9.00
    const result = calculateCourseLevelCGPA(semestersWithCourses);
    expect(result.isValid).toBe(true);
    expect(result.totalCredits).toBe(12);
    expect(result.cgpaFormatted).toBe("9.00");
  });
});

describe("calculateRequiredGPA (What-If Target)", () => {
  it("computes required GPA matching the prompt formula", () => {
    // Current: 8.75 CGPA with 44 credits
    // Upcoming: 20 credits
    // Target: 9.00 CGPA
    // Required = (9.00 * 64 - 8.75 * 44) / 20 = (576 - 385) / 20 = 191 / 20 = 9.55
    const result = calculateRequiredGPA(8.75, 44, 20, 9.00);
    expect(result.isValid).toBe(true);
    expect(result.isAchievable).toBe(true);
    expect(result.requiredGpaFormatted).toBe("9.55");
  });

  it("flags impossible targets (> 10 required GPA)", () => {
    // Current: 7.00 with 100 credits
    // Upcoming: 10 credits
    // Target: 9.50
    // Required = (9.50 * 110 - 7.00 * 100) / 10 = (1045 - 700) / 10 = 34.50
    const result = calculateRequiredGPA(7.00, 100, 10, 9.50);
    expect(result.isAchievable).toBe(false);
    expect(result.error).toContain("not mathematically achievable");
  });

  it("handles targets already met (required <= 0)", () => {
    const result = calculateRequiredGPA(9.50, 60, 20, 7.00);
    expect(result.isAchievable).toBe(true);
    expect(result.isAlreadyMet).toBe(true);
  });
});

describe("validateCourse and validateSemester", () => {
  it("validates course inputs properly", () => {
    expect(validateCourse({ credits: 4, grade: "S" })).toBeNull();
    expect(validateCourse({ credits: 0, grade: "S" })).toBe("Credits must be greater than 0.");
    expect(validateCourse({ credits: 4, grade: "Z" })).toBe("Select a valid grade (S, A, B, C, D, E, F).");
    expect(validateCourse({ credits: 4, grade: "W" })).toContain("non-point grade");
  });

  it("validates semester inputs properly", () => {
    expect(validateSemester({ gpa: 9.1, credits: 24 })).toBeNull();
    expect(validateSemester({ gpa: "", credits: "" })).toBeNull(); // Empty is allowed
    expect(validateSemester({ gpa: 11, credits: 20 })).toBe("Enter a GPA between 0 and 10.");
    expect(validateSemester({ gpa: -1, credits: 20 })).toBe("Enter a GPA between 0 and 10.");
    expect(validateSemester({ gpa: 9.0, credits: 0 })).toBe("Credits must be greater than 0.");
  });
});
