# 📐 Academic Tracker - Calculations & Statistics Guide

This document provides detailed explanations of all mathematical calculations, statistical methods, and prediction algorithms used in the Academic Tracker application.

---

## 📊 Core Calculations

### 1. Internal Marks Calculation

**Formula:**

```
INTERNALS = (CAT1 × W₁) + (CAT2 × W₂) + (QUIZ1 × W₃) + (QUIZ2 × W₄) + (QUIZ3 × W₅)
```

**Default Weights:**

- CAT-1: 20% (0.20)
- CAT-2: 20% (0.20)
- QUIZ-1: 10% (0.10)
- QUIZ-2: 10% (0.10)
- QUIZ-3: 10% (0.10)

**Example:**

```
CAT-1 = 85
CAT-2 = 90
QUIZ-1 = 75
QUIZ-2 = 80
QUIZ-3 = 88

INTERNALS = (85 × 0.20) + (90 × 0.20) + (75 × 0.10) + (80 × 0.10) + (88 × 0.10)
          = 17 + 18 + 7.5 + 8 + 8.8
          = 59.3
```

**Note:** Weights are configurable in the Settings panel.

---

### 2. Subject Total Calculation

**Formula:**

```
Total = CAT1 + CAT2 + QUIZ1 + QUIZ2 + QUIZ3 + FAT + LAB
```

**Maximum Possible:**

```
Max Total = 700 (7 components × 100 marks each)
```

**Example:**

```
CAT-1 = 85
CAT-2 = 90
QUIZ-1 = 75
QUIZ-2 = 80
QUIZ-3 = 88
FAT = 92
LAB = 95

Total = 85 + 90 + 75 + 80 + 88 + 92 + 95 = 605
```

---

### 3. Percentage Calculation

**Formula:**

```
Percentage = (Total Marks / Maximum Marks) × 100
           = (Total / 700) × 100
```

**Example:**

```
Total = 605
Percentage = (605 / 700) × 100 = 86.43%
```

---

### 4. Grade Assignment

| Percentage Range | Letter Grade | Quality Points |
| ---------------- | ------------ | -------------- |
| 90% - 100%       | A+           | 4.0            |
| 80% - 89%        | A            | 3.7            |
| 70% - 79%        | B+           | 3.3            |
| 60% - 69%        | B            | 3.0            |
| 50% - 59%        | C            | 2.7            |
| 40% - 49%        | D            | 2.0            |
| Below 40%        | F            | 0.0            |

**Example:**

```
Percentage = 86.43% → Grade = A (3.7 GPA)
```

---

## 📈 Statistical Calculations

### 1. Mean (Average)

**Definition:** The arithmetic mean is the sum of all values divided by the count of values.

**Formula:**

```
Mean (μ) = (Σx) / n
         = (x₁ + x₂ + x₃ + ... + xₙ) / n
```

**Example:**

```
Marks: [85, 90, 75, 80, 88]
Mean = (85 + 90 + 75 + 80 + 88) / 5
     = 418 / 5
     = 83.6
```

**Use Case:** Overall performance indicator across subjects or assessments.

---

### 2. Median

**Definition:** The middle value when data is sorted in ascending order.

**Formula:**

- For odd count: `Median = x[(n+1)/2]`
- For even count: `Median = (x[n/2] + x[(n/2)+1]) / 2`

**Example 1 (Odd count):**

```
Marks: [85, 90, 75, 80, 88]
Sorted: [75, 80, 85, 88, 90]
n = 5 (odd)
Median = x[(5+1)/2] = x[3] = 85
```

**Example 2 (Even count):**

```
Marks: [85, 90, 75, 80, 88, 92]
Sorted: [75, 80, 85, 88, 90, 92]
n = 6 (even)
Median = (x[3] + x[4]) / 2 = (85 + 88) / 2 = 86.5
```

**Use Case:** Better than mean when data has outliers.

---

### 3. Mode

**Definition:** The most frequently occurring value in the dataset.

**Example:**

```
Marks: [85, 90, 85, 80, 88, 85]
Frequency:
  - 85: 3 times (highest)
  - 90: 1 time
  - 80: 1 time
  - 88: 1 time

Mode = 85
```

**Special Cases:**

- **No mode:** All values occur with same frequency
- **Bimodal:** Two values have highest frequency
- **Multimodal:** More than two values have highest frequency

**Use Case:** Identifying the most common performance level.

---

### 4. Standard Deviation

**Definition:** Measures the spread or dispersion of data from the mean.

**Formula:**

```
σ = √[Σ(x - μ)² / n]
```

**Steps:**

1. Calculate mean (μ)
2. Subtract mean from each value: (x - μ)
3. Square each difference: (x - μ)²
4. Find average of squared differences
5. Take square root

**Example:**

```
Marks: [85, 90, 75, 80, 88]
Mean (μ) = 83.6

Differences from mean:
  85 - 83.6 = 1.4
  90 - 83.6 = 6.4
  75 - 83.6 = -8.6
  80 - 83.6 = -3.6
  88 - 83.6 = 4.4

Squared differences:
  1.4² = 1.96
  6.4² = 40.96
  (-8.6)² = 73.96
  (-3.6)² = 12.96
  4.4² = 19.36

Sum of squared differences = 149.2
Variance = 149.2 / 5 = 29.84
Standard Deviation (σ) = √29.84 = 5.46
```

**Interpretation:**

- **Low σ (< 10):** Consistent performance
- **Medium σ (10-20):** Moderate variation
- **High σ (> 20):** Large variation in performance

**Use Case:** Measuring consistency across subjects or assessments.

---

### 5. Weighted Mean

**Definition:** Average where each value has a different weight/importance.

**Formula:**

```
Weighted Mean = (Σ(x × w)) / Σw
              = (x₁w₁ + x₂w₂ + ... + xₙwₙ) / (w₁ + w₂ + ... + wₙ)
```

**Example (Internal Marks):**

```
CAT-1 = 85, weight = 0.20
CAT-2 = 90, weight = 0.20
QUIZ-1 = 75, weight = 0.10
QUIZ-2 = 80, weight = 0.10
QUIZ-3 = 88, weight = 0.10

Weighted Mean = (85×0.20 + 90×0.20 + 75×0.10 + 80×0.10 + 88×0.10) / (0.20+0.20+0.10+0.10+0.10)
              = (17 + 18 + 7.5 + 8 + 8.8) / 0.70
              = 59.3 / 0.70
              = 84.71
```

**Use Case:** Calculating overall GPA, internal marks with different component weights.

---

## 🔮 Prediction Algorithm

### FAT Score Prediction

**Objective:** Predict Final Assessment Test (FAT) score based on continuous assessment performance.

**Algorithm:** Linear Trend Analysis with Momentum

**Steps:**

1. **Data Collection**

   ```
   Collect all available assessment scores:
   assessments = [CAT1, CAT2, QUIZ1, QUIZ2, QUIZ3]
   ```

2. **Calculate Base Performance**

   ```
   base_mean = Mean(assessments)
   ```

3. **Trend Analysis**

   ```
   Split assessments into two halves:
   first_half = assessments[0 : n/2]
   second_half = assessments[n/2 : n]

   first_mean = Mean(first_half)
   second_mean = Mean(second_half)

   trend = second_mean - first_mean
   ```

4. **Apply Trend with Damping**

   ```
   prediction = base_mean + (trend × 0.5)
   ```

5. **Boundary Constraints**
   ```
   final_prediction = max(0, min(100, prediction))
   ```

**Example:**

```javascript
// Given marks
CAT1 = 75
CAT2 = 80
QUIZ1 = 78
QUIZ2 = 85
QUIZ3 = 88

// Step 1: Collect data
assessments = [75, 80, 78, 85, 88]

// Step 2: Base performance
base_mean = (75 + 80 + 78 + 85 + 88) / 5 = 81.2

// Step 3: Trend analysis
first_half = [75, 80]  // n/2 = 2.5, floor = 2
second_half = [78, 85, 88]

first_mean = (75 + 80) / 2 = 77.5
second_mean = (78 + 85 + 88) / 3 = 83.67

trend = 83.67 - 77.5 = 6.17

// Step 4: Apply trend
prediction = 81.2 + (6.17 × 0.5) = 81.2 + 3.085 = 84.285

// Step 5: Boundary check (already within 0-100)
final_prediction = 84.29
```

**Interpretation:**

- **Positive trend:** Performance improving → Higher prediction
- **Negative trend:** Performance declining → Lower prediction
- **Zero trend:** Stable performance → Prediction equals mean

**Damping Factor (0.5):**

- Prevents over-optimistic/pessimistic predictions
- Accounts for exam difficulty variation
- More conservative estimate

**Limitations:**

- Assumes linear progression
- Doesn't account for external factors (study time, difficulty)
- Requires minimum 2 assessments for trend
- Less accurate with irregular patterns

---

## 🎓 GPA Calculation

### Overall GPA

**Formula:**

```
Overall GPA = Mean of individual subject GPAs
           = (GPA₁ + GPA₂ + ... + GPAₙ) / n
```

**Example:**

```
Subject GPAs:
- Probability & Statistics: 3.7 (86%)
- DSA: 4.0 (92%)
- OOPS: 3.3 (75%)
- Software Engineering: 3.7 (88%)
- Chemistry: 3.0 (68%)
- English: 3.7 (84%)

Overall GPA = (3.7 + 4.0 + 3.3 + 3.7 + 3.0 + 3.7) / 6
            = 21.4 / 6
            = 3.57
```

### Credit-Weighted GPA (Future Enhancement)

**Formula:**

```
CGPA = Σ(GPAᵢ × Creditsᵢ) / Σ Credits
```

**Example:**

```
If each subject has different credits:
- Prob & Stat: 3.7 GPA × 4 credits = 14.8
- DSA: 4.0 GPA × 4 credits = 16.0
- OOPS: 3.3 GPA × 3 credits = 9.9
...

CGPA = Σ(GPA × Credits) / Total Credits
```

---

## 📊 Performance Analysis

### Subject Comparison

**Relative Performance Index (RPI):**

```
RPI = (Subject Percentage - Overall Mean) / Standard Deviation

Interpretation:
- RPI > 1: Significantly above average
- RPI between 0-1: Above average
- RPI = 0: At average
- RPI between -1-0: Below average
- RPI < -1: Significantly below average
```

**Example:**

```
Subject: DSA = 92%
Overall Mean = 82%
Std Deviation = 8%

RPI = (92 - 82) / 8 = 10 / 8 = 1.25

Interpretation: DSA performance is 1.25 standard deviations above average
```

---

## 🔢 Data Validation

### Input Constraints

```javascript
// Mark validation
function validateMark(mark) {
  return mark >= 0 && mark <= 100;
}

// Weight validation
function validateWeights(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return Math.abs(total - 1.0) < 0.001; // Allow small floating point errors
}

// Null handling
function safeCalculation(marks) {
  return marks.filter((m) => m !== null && !isNaN(m));
}
```

---

## 📝 Formula Reference Sheet

| Metric        | Formula                    | Symbol |
| ------------- | -------------------------- | ------ |
| Mean          | Σx / n                     | μ      |
| Median        | Middle value when sorted   | M      |
| Mode          | Most frequent value        | Mo     |
| Variance      | Σ(x - μ)² / n              | σ²     |
| Std Dev       | √Variance                  | σ      |
| Weighted Mean | Σ(x×w) / Σw                | x̄w     |
| Percentage    | (Total / Max) × 100        | %      |
| GPA           | Grade point for percentage | -      |

---

## 🎯 Accuracy & Precision

- All calculations use **IEEE 754 double precision** (JavaScript Number)
- Displayed values rounded to **2 decimal places**
- Internal calculations maintain **full precision**
- Percentage calculations **accurate to 0.01%**
- GPA rounded to **nearest 0.1**

---

## 🧪 Testing Examples

### Test Case 1: Perfect Scores

```
All marks = 100
Expected:
- Total = 700
- Percentage = 100%
- Grade = A+
- GPA = 4.0
- Prediction = 100
```

### Test Case 2: Zero Scores

```
All marks = 0
Expected:
- Total = 0
- Percentage = 0%
- Grade = F
- GPA = 0.0
- Prediction = 0
```

### Test Case 3: Mixed Performance

```
CAT1=70, CAT2=75, Q1=65, Q2=70, Q3=72, FAT=80, LAB=85
Expected:
- Total = 517
- Percentage = 73.86%
- Grade = B+
- GPA = 3.3
- Internal = 70.5
- Prediction ≈ 75
```

---

**Last Updated:** January 2026  
**Version:** 1.0.0
