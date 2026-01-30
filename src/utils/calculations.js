/**
 * Scale CAT marks from 50 to 15
 */
export const scaleCATMarks = (catMarks) => {
  if (catMarks === null || catMarks === undefined) return 0;
  return (catMarks / 50) * 15;
};
/**
 * Scale FAT marks from 100 to 40
 */
export const scaleFATMarks = (fatMarks) => {
  if (fatMarks === null || fatMarks === undefined) return 0;
  return (fatMarks / 100) * 40;
};
/**
 * Scale LAB marks from 100 to 25
 */
export const scaleLABMarks = (labMarks) => {
  if (labMarks === null || labMarks === undefined) return 0;
  return (labMarks / 100) * 25;
};
/**
 * Calculate unscaled internal total (before scaling to 75)
 * Formula: ScaledCAT1 + ScaledCAT2 + Q1 + Q2 + Q3 + ScaledFAT
 */
export const calculateUnscaledInternal = (marks) => {
  const scaledCat1 = scaleCATMarks(marks.cat1);
  const scaledCat2 = scaleCATMarks(marks.cat2);
  const scaledFat = scaleFATMarks(marks.fat);
  const quiz1 = marks.quiz1 || 0;
  const quiz2 = marks.quiz2 || 0;
  const quiz3 = marks.quiz3 || 0;
  return scaledCat1 + scaledCat2 + quiz1 + quiz2 + quiz3 + scaledFat;
};
/**
 * Calculate scaled internal total (scaled to 75)
 * Formula: (unscaledInternal / 100) * 75
 */
export const calculateScaledInternal = (marks) => {
  const unscaledInternal = calculateUnscaledInternal(marks);
  return (unscaledInternal / 100) * 75;
};
/**
 * Calculate final total (scaled internal + scaled lab)
 * Formula: ScaledInternal(75) + ScaledLab(25) = 100
 */
export const calculateFinalTotal = (marks) => {
  const scaledInternal = calculateScaledInternal(marks);
  const scaledLab = scaleLABMarks(marks.lab);
  return scaledInternal + scaledLab;
};
/**
 * Get all scaled marks for display
 */
export const getScaledMarks = (marks) => {
  return {
    cat1: scaleCATMarks(marks.cat1),
    cat2: scaleCATMarks(marks.cat2),
    quiz1: marks.quiz1 || 0,
    quiz2: marks.quiz2 || 0,
    quiz3: marks.quiz3 || 0,
    fat: scaleFATMarks(marks.fat),
    lab: scaleLABMarks(marks.lab),
    unscaledInternal: calculateUnscaledInternal(marks),
    scaledInternal: calculateScaledInternal(marks),
    finalTotal: calculateFinalTotal(marks),
  };
};
/**
 * Predict FAT score based on CAT and Quiz performance trends using linear regression
 */
export const predictFAT = (marks) => {
  const assessments = [];
  if (marks.cat1 !== null && marks.cat1 !== undefined) {
    assessments.push((marks.cat1 / 50) * 100);
  }
  if (marks.cat2 !== null && marks.cat2 !== undefined) {
    assessments.push((marks.cat2 / 50) * 100);
  }
  if (marks.quiz1 !== null && marks.quiz1 !== undefined) {
    assessments.push((marks.quiz1 / 10) * 100);
  }
  if (marks.quiz2 !== null && marks.quiz2 !== undefined) {
    assessments.push((marks.quiz2 / 10) * 100);
  }
  if (marks.quiz3 !== null && marks.quiz3 !== undefined) {
    assessments.push((marks.quiz3 / 10) * 100);
  }
  if (assessments.length === 0) return 0;
  if (assessments.length === 1) return assessments[0];
  const n = assessments.length;
  let sumXY = 0;
  let sumX = 0;
  let sumY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumXY += i * assessments[i];
    sumX += i;
    sumY += assessments[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const prediction = slope * n + intercept;
  return Math.max(0, Math.min(100, prediction));
};
/**
 * Calculate arithmetic mean (average) of an array of numbers
 * Safely handles null/undefined values
 */
export const calculateMean = (numbers) => {
  if (!Array.isArray(numbers)) return 0;
  const validNumbers = numbers.filter(
    (n) => n !== null && n !== undefined && !isNaN(n),
  );
  if (validNumbers.length === 0) return 0;
  const sum = validNumbers.reduce((acc, n) => acc + Number(n), 0);
  return sum / validNumbers.length;
};
/**
 * Calculate median (middle value) of an array of numbers
 * Safely handles null/undefined values and odd/even lengths
 */
export const calculateMedian = (numbers) => {
  if (!Array.isArray(numbers)) return 0;
  const validNumbers = numbers
    .filter((n) => n !== null && n !== undefined && !isNaN(n))
    .sort((a, b) => a - b);
  if (validNumbers.length === 0) return 0;
  const mid = Math.floor(validNumbers.length / 2);
  if (validNumbers.length % 2 === 0) {
    return (validNumbers[mid - 1] + validNumbers[mid]) / 2;
  }
  return validNumbers[mid];
};
/**
 * Calculate mode (most frequently occurring value) of an array of numbers
 * Returns first mode if multiple modes exist
 */
export const calculateMode = (numbers) => {
  if (!Array.isArray(numbers)) return 0;
  const validNumbers = numbers.filter(
    (n) => n !== null && n !== undefined && !isNaN(n),
  );
  if (validNumbers.length === 0) return 0;
  if (validNumbers.length === 1) return validNumbers[0];
  const frequency = {};
  validNumbers.forEach((n) => {
    frequency[n] = (frequency[n] || 0) + 1;
  });
  let maxFreq = 0;
  let mode = validNumbers[0];
  for (const [num, freq] of Object.entries(frequency)) {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = Number(num);
    }
  }
  return mode;
};
/**
 * Calculate standard deviation (measure of spread/variance)
 * Measures how far values deviate from the mean
 */
export const calculateStandardDeviation = (numbers) => {
  if (!Array.isArray(numbers)) return 0;
  const validNumbers = numbers.filter(
    (n) => n !== null && n !== undefined && !isNaN(n),
  );
  if (validNumbers.length === 0) return 0;
  if (validNumbers.length === 1) return 0;
  const mean = calculateMean(validNumbers);
  const squaredDifferences = validNumbers.map((n) => Math.pow(n - mean, 2));
  const variance =
    squaredDifferences.reduce((sum, diff) => sum + diff, 0) /
    validNumbers.length;
  return Math.sqrt(variance);
};
export const calculateStdDev = (numbers) => calculateStandardDeviation(numbers);
/**
 * Calculate weighted mean using values and their weights
 * Useful for calculating GPA or weighted scores
 */
export const calculateWeightedMean = (values, weights) => {
  if (!Array.isArray(values) || !Array.isArray(weights)) return 0;
  if (values.length !== weights.length) return 0;
  let weightedSum = 0;
  let totalWeight = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== null && values[i] !== undefined && !isNaN(values[i])) {
      weightedSum += values[i] * weights[i];
      totalWeight += weights[i];
    }
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};
/**
 * Get letter grade based on percentage score
 * Scale: S(90+), A(80-89), B(70-79), C(60-69), D(50-59), E(40-49), F(<40)
 */
export const getGrade = (percentage) => {
  if (percentage === null || percentage === undefined || isNaN(percentage))
    return "F";
  const pct = Number(percentage);
  if (pct >= 90) return "S";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  if (pct >= 40) return "E";
  return "F";
};
/**
 * Calculate GPA on 10-point scale based on percentage
 * Scale: 90+=10, 80+=9, 70+=8, 60+=7, 50+=6, 40+=5, <40=0
 */
export const calculateGPA = (percentage) => {
  if (percentage === null || percentage === undefined || isNaN(percentage))
    return 0;
  const pct = Number(percentage);
  if (pct >= 90) return 10;
  if (pct >= 80) return 9;
  if (pct >= 70) return 8;
  if (pct >= 60) return 7;
  if (pct >= 50) return 6;
  if (pct >= 40) return 5;
  return 0;
};
/**
 * Calculate percentage from a value (mainly for consistency)
 */
export const calculatePercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Number(value);
};
/**
 * Validate if a value is a valid number
 */
export const isValidNumber = (value) => {
  return value !== null && value !== undefined && !isNaN(value);
};
/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};
