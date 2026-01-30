export const scaleCATMarks = (catMarks) => {
  if (catMarks === null || catMarks === undefined) return 0;
  return (catMarks / 50) * 15;
};

export const scaleFATMarks = (fatMarks) => {
  if (fatMarks === null || fatMarks === undefined) return 0;
  return (fatMarks / 100) * 40;
};

export const scaleLABMarks = (labMarks) => {
  if (labMarks === null || labMarks === undefined) return 0;
  return (labMarks / 100) * 25;
};

export const calculateUnscaledInternal = (marks) => {
  const scaledCat1 = scaleCATMarks(marks.cat1);
  const scaledCat2 = scaleCATMarks(marks.cat2);
  const scaledFat = scaleFATMarks(marks.fat);
  const quiz1 = marks.quiz1 || 0;
  const quiz2 = marks.quiz2 || 0;
  const quiz3 = marks.quiz3 || 0;
  return scaledCat1 + scaledCat2 + quiz1 + quiz2 + quiz3 + scaledFat;
};

export const calculateScaledInternal = (marks) => {
  const unscaledInternal = calculateUnscaledInternal(marks);
  return (unscaledInternal / 100) * 75;
};

export const calculateFinalTotal = (marks) => {
  const scaledInternal = calculateScaledInternal(marks);
  const scaledLab = scaleLABMarks(marks.lab);
  return scaledInternal + scaledLab;
};

export const getScaledMarks = (marks) => {
  if (!marks)
    return {
      cat1: 0,
      cat2: 0,
      quiz1: 0,
      quiz2: 0,
      quiz3: 0,
      fat: 0,
      lab: 0,
      scaledInternal: 0,
      finalTotal: 0,
    };

  const cat1 = scaleCATMarks(marks.cat1);
  const cat2 = scaleCATMarks(marks.cat2);
  const quiz1 = marks.quiz1 || 0;
  const quiz2 = marks.quiz2 || 0;
  const quiz3 = marks.quiz3 || 0;
  const fat = scaleFATMarks(marks.fat);
  const lab = scaleLABMarks(marks.lab);
  const scaledInternal = calculateScaledInternal(marks);
  const finalTotal = calculateFinalTotal(marks);

  return {
    cat1,
    cat2,
    quiz1,
    quiz2,
    quiz3,
    fat,
    lab,
    scaledInternal,
    finalTotal,
  };
};

export const predictFAT = (marks) => {
  if (!marks) return 0;

  const cat1 = marks.cat1 || 0;
  const cat2 = marks.cat2 || 0;
  const quiz1 = marks.quiz1 || 0;
  const quiz2 = marks.quiz2 || 0;
  const quiz3 = marks.quiz3 || 0;

  const internals = [cat1, cat2, quiz1, quiz2, quiz3].filter(
    (v) => v !== null && v !== undefined,
  );

  if (internals.length === 0) return 50;

  const avgInternal = internals.reduce((a, b) => a + b, 0) / internals.length;
  const avgPercentage = (avgInternal / 10) * 100;

  const predictedFAT = (avgPercentage / 100) * 100;

  return Math.min(100, Math.max(0, predictedFAT));
};

export const calculateMean = (values) => {
  const validValues = values.filter((v) => isValidNumber(v));
  if (validValues.length === 0) return 0;
  return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
};

export const calculateMedian = (values) => {
  const validValues = values
    .filter((v) => isValidNumber(v))
    .sort((a, b) => a - b);
  if (validValues.length === 0) return 0;

  const mid = Math.floor(validValues.length / 2);
  if (validValues.length % 2 === 0) {
    return (validValues[mid - 1] + validValues[mid]) / 2;
  }
  return validValues[mid];
};

export const calculateMode = (values) => {
  const validValues = values.filter((v) => isValidNumber(v));
  if (validValues.length === 0) return 0;

  const frequency = {};
  let maxFreq = 0;
  let mode = validValues[0];

  for (const value of validValues) {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  }

  return mode;
};

export const calculateStandardDeviation = (values) => {
  const validValues = values.filter((v) => isValidNumber(v));
  if (validValues.length < 2) return 0;

  const mean = calculateMean(validValues);
  const squaredDiffs = validValues.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / validValues.length;

  return Math.sqrt(variance);
};

export const calculateStdDev = calculateStandardDeviation;

export const calculateWeightedMean = (values, weights) => {
  if (values.length !== weights.length) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < values.length; i++) {
    if (isValidNumber(values[i]) && isValidNumber(weights[i])) {
      weightedSum += values[i] * weights[i];
      totalWeight += weights[i];
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

export const getGrade = (percentage) => {
  if (!isValidNumber(percentage) || percentage === null) return "N/A";

  if (percentage >= 90) return "S";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 40) return "E";
  return "F";
};

export const calculateGPA = (percentage) => {
  if (!isValidNumber(percentage) || percentage === null) return 0;

  return percentage / 10;
};

export const calculatePercentage = (marks, maxMarks) => {
  if (maxMarks === 0 || !isValidNumber(marks) || !isValidNumber(maxMarks))
    return 0;
  return (marks / maxMarks) * 100;
};

export const isValidNumber = (value) => {
  return value !== null && value !== undefined && !isNaN(value);
};

export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

export const calculateConsistencyScore = (values) => {
  const validValues = values.filter((v) => isValidNumber(v));

  if (validValues.length < 2) return 100;

  const mean = calculateMean(validValues);
  const squaredDiffs = validValues.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / validValues.length;
  const stdDev = Math.sqrt(variance);

  const factor = 0.5;
  const score = Math.max(0, 100 - stdDev * factor);

  return parseFloat(score.toFixed(1));
};

export const getConsistencyLabel = (score) => {
  if (score >= 80) return "Very Consistent";
  if (score >= 60) return "Moderately Consistent";
  return "Inconsistent";
};

export const getConsistencyColor = (score) => {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};
