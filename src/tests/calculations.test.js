import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  scaleCATMarks,
  scaleFATMarks,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateStandardDeviation,
  getGrade,
  calculateGPA,
  calculatePercentage,
  isValidNumber,
  clamp,
  calculateConsistencyScore,
  predictFAT,
  computeSubjectStanding,
} from "../utils/calculations";

// getSubjectWeightage hits localStorage; stub it so tests run without a browser
vi.mock("../utils/data", () => ({
  getSubjectWeightage: () => ({ internal: 75, lab: 25 }),
  SUBJECTS: ["Physics", "DSA"],
  DEFAULT_WEIGHTAGE: { internal: 75, lab: 25 },
}));

// ─── Mark scaling ─────────────────────────────────────────────────────────────

describe("scaleCATMarks", () => {
  it("scales 50/50 to 15", () => {
    expect(scaleCATMarks(50)).toBe(15);
  });

  it("scales 25/50 to 7.5", () => {
    expect(scaleCATMarks(25)).toBe(7.5);
  });

  it("returns 0 for null input", () => {
    expect(scaleCATMarks(null)).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(scaleCATMarks(undefined)).toBe(0);
  });

  it("handles 0 marks", () => {
    expect(scaleCATMarks(0)).toBe(0);
  });
});

describe("scaleFATMarks", () => {
  it("scales 100 to 40", () => {
    expect(scaleFATMarks(100)).toBe(40);
  });

  it("scales 50 to 20", () => {
    expect(scaleFATMarks(50)).toBe(20);
  });

  it("returns 0 for null", () => {
    expect(scaleFATMarks(null)).toBe(0);
  });
});

// ─── Statistics ───────────────────────────────────────────────────────────────

describe("calculateMean", () => {
  it("returns correct average for simple set", () => {
    expect(calculateMean([10, 20, 30])).toBe(20);
  });

  it("ignores null values", () => {
    expect(calculateMean([10, null, 30])).toBe(20);
  });

  it("returns 0 for empty array", () => {
    expect(calculateMean([])).toBe(0);
  });

  it("handles all nulls", () => {
    expect(calculateMean([null, null])).toBe(0);
  });
});

describe("calculateMedian", () => {
  it("returns middle value for odd-length array", () => {
    expect(calculateMedian([1, 3, 5])).toBe(3);
  });

  it("averages two middle values for even-length array", () => {
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
  });

  it("sorts values before finding median", () => {
    expect(calculateMedian([5, 1, 3])).toBe(3);
  });

  it("returns 0 for empty array", () => {
    expect(calculateMedian([])).toBe(0);
  });
});

describe("calculateMode", () => {
  it("returns most frequent value", () => {
    expect(calculateMode([1, 2, 2, 3])).toBe(2);
  });

  it("returns first value when all are unique", () => {
    expect(calculateMode([5, 10, 15])).toBe(5);
  });

  it("returns 0 for empty array", () => {
    expect(calculateMode([])).toBe(0);
  });
});

describe("calculateStandardDeviation", () => {
  it("returns 0 for single-element array", () => {
    expect(calculateStandardDeviation([42])).toBe(0);
  });

  it("returns 0 for identical values", () => {
    expect(calculateStandardDeviation([5, 5, 5])).toBe(0);
  });

  it("returns correct SD for known set", () => {
    // [2, 4, 4, 4, 5, 5, 7, 9] => mean=5, variance=4, sd=2
    const sd = calculateStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(sd).toBeCloseTo(2, 5);
  });
});

// ─── Grading ──────────────────────────────────────────────────────────────────

describe("getGrade", () => {
  it.each([
    [95, "S"],
    [85, "A"],
    [75, "B"],
    [65, "C"],
    [55, "D"],
    [45, "E"],
    [30, "F"],
  ])("maps %i%% to grade %s", (pct, expected) => {
    expect(getGrade(pct)).toBe(expected);
  });

  it("returns N/A for null", () => {
    expect(getGrade(null)).toBe("N/A");
  });

  it("returns N/A for NaN", () => {
    expect(getGrade(NaN)).toBe("N/A");
  });

  it("handles exact boundary 90 → S", () => {
    expect(getGrade(90)).toBe("S");
  });

  it("handles exact boundary 80 → A", () => {
    expect(getGrade(80)).toBe("A");
  });
});

describe("calculateGPA", () => {
  it("converts 80% to 8.0 GPA", () => {
    expect(calculateGPA(80)).toBe(8);
  });

  it("converts 100% to 10.0", () => {
    expect(calculateGPA(100)).toBe(10);
  });

  it("returns 0 for null", () => {
    expect(calculateGPA(null)).toBe(0);
  });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

describe("isValidNumber", () => {
  it("returns true for integers", () => expect(isValidNumber(5)).toBe(true));
  it("returns true for floats", () => expect(isValidNumber(3.14)).toBe(true));
  it("returns true for 0", () => expect(isValidNumber(0)).toBe(true));
  it("returns false for null", () => expect(isValidNumber(null)).toBe(false));
  it("returns false for undefined", () => expect(isValidNumber(undefined)).toBe(false));
  it("returns false for NaN", () => expect(isValidNumber(NaN)).toBe(false));
});

describe("clamp", () => {
  it("returns value when within range", () => expect(clamp(5, 0, 10)).toBe(5));
  it("clamps below min", () => expect(clamp(-3, 0, 10)).toBe(0));
  it("clamps above max", () => expect(clamp(15, 0, 10)).toBe(10));
  it("works at boundary min", () => expect(clamp(0, 0, 10)).toBe(0));
  it("works at boundary max", () => expect(clamp(10, 0, 10)).toBe(10));
});

describe("calculatePercentage", () => {
  it("returns 50 for 50/100", () => {
    expect(calculatePercentage(50, 100)).toBe(50);
  });

  it("returns 0 for maxMarks = 0", () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  it("returns 0 for null marks", () => {
    expect(calculatePercentage(null, 100)).toBe(0);
  });
});

// ─── Consistency score ────────────────────────────────────────────────────────

describe("calculateConsistencyScore", () => {
  it("returns 100 for single-element array", () => {
    expect(calculateConsistencyScore([80])).toBe(100);
  });

  it("returns 100 for identical values", () => {
    expect(calculateConsistencyScore([70, 70, 70])).toBe(100);
  });

  it("returns a lower score for spread-out values", () => {
    const score = calculateConsistencyScore([20, 80]);
    expect(score).toBeLessThan(100);
  });
});

// ─── FAT prediction ───────────────────────────────────────────────────────────

describe("predictFAT", () => {
  it("returns 0 for an object with no marks (all coerce to 0)", () => {
    // cat1..quiz3 all coerce to 0 via `|| 0`, so avg = 0 → prediction = 0
    expect(predictFAT({})).toBe(0);
  });

  it("returns 0 for null input", () => {
    expect(predictFAT(null)).toBe(0);
  });

  it("caps at 100", () => {
    const result = predictFAT({ cat1: 50, cat2: 50, quiz1: 10, quiz2: 10, quiz3: 10 });
    expect(result).toBeLessThanOrEqual(100);
  });

  it("returns non-negative value", () => {
    const result = predictFAT({ cat1: 0, cat2: 0, quiz1: 0 });
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

// ─── computeSubjectStanding ───────────────────────────────────────────────────

describe("computeSubjectStanding", () => {
  it("returns combined score between 0 and 100", () => {
    const result = computeSubjectStanding({
      quizScore: 70,
      quizMax: 100,
      theoryScore: 80,
      theoryMax: 100,
    });
    expect(result.combined).toBeGreaterThanOrEqual(0);
    expect(result.combined).toBeLessThanOrEqual(100);
  });

  it("uses default weights when not provided", () => {
    const result = computeSubjectStanding({ quizScore: 100, quizMax: 100, theoryScore: 100, theoryMax: 100 });
    expect(result.combined).toBe(100);
  });

  it("normalises weights so they sum to 1", () => {
    const result = computeSubjectStanding({
      quizScore: 50,
      quizMax: 100,
      theoryScore: 50,
      theoryMax: 100,
      weights: { quiz: 2, theory: 2 },
    });
    const { quiz, theory } = result.weights;
    expect(quiz + theory).toBeCloseTo(1, 5);
  });

  it("computes diff vs classAverage when provided", () => {
    const result = computeSubjectStanding({
      quizScore: 80,
      quizMax: 100,
      theoryScore: 80,
      theoryMax: 100,
      classAverage: 70,
    });
    expect(result.diff).not.toBeNull();
    expect(result.above).toBe(true);
  });

  it("returns null diff when no classAverage", () => {
    const result = computeSubjectStanding({ quizScore: 80, quizMax: 100, theoryScore: 80, theoryMax: 100 });
    expect(result.diff).toBeNull();
  });
});
