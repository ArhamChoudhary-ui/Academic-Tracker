# 🎓 User Guide - Academic Tracker

Complete walkthrough of the Academic Tracker application with step-by-step instructions.

---

## 📱 Application Overview

The Academic Tracker consists of three main sections:

1. **Subjects Tab** - Enter and manage marks
2. **Dashboard Tab** - View statistics and analytics
3. **Charts Tab** - Visualize performance graphically

---

## 🚀 Quick Start Guide

### First Time Setup

1. **Open the application** in your browser at `http://localhost:3000`
2. You'll see 6 subject cards (initially collapsed)
3. All subjects start with empty marks
4. Data automatically saves to your browser

### Basic Workflow

```
Enter Marks → View Statistics → Analyze Charts → Export Data
```

---

## 📝 Entering Marks

### Step 1: Select a Subject

Click on any subject card to expand it. Each subject has:

- **Header** showing subject name, current total, and percentage
- **Expandable content** with input fields and statistics

### Step 2: Input Assessment Scores

Fill in the marks for each component:

| Component | Description                        | Max Marks | Auto-calculated? |
| --------- | ---------------------------------- | --------- | ---------------- |
| CAT-1     | First Continuous Assessment Test   | 100       | No               |
| CAT-2     | Second Continuous Assessment Test  | 100       | No               |
| QUIZ-1    | First Quiz                         | 100       | No               |
| QUIZ-2    | Second Quiz                        | 100       | No               |
| QUIZ-3    | Third Quiz                         | 100       | No               |
| INTERNALS | Weighted average of CATs & Quizzes | 100       | **Yes** ✓        |
| FAT       | Final Assessment Test              | 100       | No               |
| LAB       | Laboratory/Practical               | 100       | No               |

**Tips:**

- Leave fields empty if assessment not yet completed
- System accepts decimal values (e.g., 85.5)
- INTERNALS updates automatically as you type
- All values must be between 0-100

### Step 3: View Predictions

Click **"Show Prediction"** button to see:

- Predicted FAT score based on current performance
- Trend analysis (improving/declining)
- Confidence indicator

### Step 4: Add Notes

Use the notes section to:

- Track important dates
- Set goals for next assessment
- Note weak areas to improve
- Add reminders

Example notes:

```
- Need to improve algorithms section
- FAT scheduled for March 15
- Goal: Score above 85
- Review recursion concepts
```

### Step 5: Save Changes

Click **"Save Changes"** button (two locations):

- In the subject header (while expanded)
- At the bottom of the expanded card

**Auto-save:** Changes automatically save to browser storage.

---

## 📊 Understanding the Dashboard

### Overview Cards

The dashboard displays 6 key metric cards:

#### 1. Overall Average

```
Shows: XX.XX%
Grade: A+ / A / B+ / B / C / D / F
```

Your average across all subjects

#### 2. GPA

```
Shows: X.XX / 4.0
```

Cumulative Grade Point Average

#### 3. Subjects

```
Shows: 6
```

Total number of enrolled subjects

#### 4. Best Subject

```
Shows: Subject Name
XX.XX%
```

Your strongest subject

#### 5. Needs Attention

```
Shows: Subject Name
XX.XX%
```

Subject requiring improvement

#### 6. Standard Deviation

```
Shows: XX.XX
```

Performance consistency metric

- Low value: Consistent performance
- High value: Variable performance

### Statistical Analysis Section

Three key statistics displayed:

| Statistic  | What it means                                       |
| ---------- | --------------------------------------------------- |
| **Mean**   | Average percentage across all subjects              |
| **Median** | Middle value when subjects are sorted by percentage |
| **Mode**   | Most common percentage (if applicable)              |

### FAT Predictions

For each subject, see:

- **Current FAT score** (if entered)
- **Predicted score** (based on trend)
- **Trend indicator**:
  - ↗ Green: Improving trend
  - ↘ Red: Declining trend

### Subject Breakdown Table

Comprehensive table showing:

- Subject name
- Total marks (out of 700)
- Percentage
- Letter grade (color-coded)
- GPA (individual subject)

**Color coding:**

- 🟢 Green: A+ / A grades
- 🔵 Blue: B+ / B grades
- 🟡 Yellow: C / D grades
- 🔴 Red: F grade

---

## 📈 Reading the Charts

### 1. Subject-wise Total Marks (Bar Chart)

**What it shows:**

- Total marks for each subject
- Quick comparison of overall performance
- Identifies strongest/weakest subjects

**How to read:**

- Taller bars = Higher total marks
- Hover over bars to see exact values
- X-axis: Subjects
- Y-axis: Total marks (0-700)

### 2. Assessment Components Comparison (Stacked Bar Chart)

**What it shows:**

- Breakdown of marks by component type
- CAT-1, CAT-2, FAT, LAB for each subject

**Color Legend:**

- 🟣 Purple: CAT-1
- 🌸 Pink: CAT-2
- 🟢 Green: FAT
- 🟠 Orange: LAB

**How to read:**

- Identify which components are strong/weak
- Compare component performance across subjects
- Spot patterns (e.g., always low in labs)

### 3. Performance Trends (Line Chart)

**What it shows:**

- How performance changes from CAT-1 → CAT-2 → FAT
- Trend lines for each assessment type

**How to read:**

- 📈 Rising lines: Improving performance
- 📉 Falling lines: Declining performance
- 🔄 Flat lines: Stable performance

### 4. Overall Subject Performance (Radar Chart)

**What it shows:**

- 360° view of all subjects
- Overall balance in performance

**How to read:**

- Larger shape = Better overall performance
- Pointed corners = Strongest subjects
- Indented corners = Weakest subjects
- Circular shape = Balanced performance
- Irregular shape = Unbalanced performance

---

## ⚙️ Settings Configuration

### Accessing Settings

1. Click the **⚙️ Settings** icon in header
2. Settings modal opens

### Configuring Internal Marks Weights

**Default Configuration:**

```
CAT-1:  20% (0.20)
CAT-2:  20% (0.20)
QUIZ-1: 10% (0.10)
QUIZ-2: 10% (0.10)
QUIZ-3: 10% (0.10)
Total:  70% (remaining 30% typically for attendance/behavior)
```

**Custom Configuration Example:**

```
If your college weights CATs more heavily:
CAT-1:  25% (0.25)
CAT-2:  25% (0.25)
QUIZ-1: 8%  (0.08)
QUIZ-2: 7%  (0.07)
QUIZ-3: 5%  (0.05)
```

**Steps to Change:**

1. Adjust sliders or enter decimal values
2. Watch percentage display update
3. Ensure total makes sense for your system
4. Click **"Save Settings"**
5. All INTERNALS recalculate automatically

### Clearing Data

**⚠️ Warning: This action cannot be undone!**

Use this to:

- Start fresh for new semester
- Reset all marks to zero
- Clear all notes

**Steps:**

1. Open Settings
2. Scroll to "Danger Zone"
3. Click **"Clear All Data"**
4. Confirm in popup dialog

---

## 💾 Data Management

### Exporting Data

**To Export as CSV:**

1. Click **📥 Download** icon in header
2. File downloads automatically
3. Default name: `academic_marks_YYYY-MM-DD.csv`

**CSV Structure:**

```csv
Subject,CAT-1,CAT-2,QUIZ-1,QUIZ-2,QUIZ-3,INTERNALS,FAT,LAB,Total
Probability and Statistics,85,90,75,80,88,59.30,92,95,605.00
DSA,92,88,85,90,87,60.50,95,98,635.00
...
```

**Use Cases:**

- Backup your data
- Share with parents/mentors
- Import into Excel for additional analysis
- Create custom charts
- Print as study material

### Data Persistence

**How it works:**

- All data stored in **browser's local storage**
- Survives browser restarts
- Survives computer restarts
- Specific to this browser and device

**Data NOT saved if:**

- You clear browser data/cache
- You use private/incognito mode
- You switch browsers
- You switch devices

**Backup recommendation:**

- Export CSV regularly
- Especially before:
  - Browser updates
  - System reinstalls
  - Clearing cache

---

## 🌓 Dark Mode

### Toggling Theme

**Method 1:** Click 🌙/☀️ icon in header
**Method 2:** Automatically detects system preference (if not previously set)

**Features:**

- Smooth transition animation
- All components adapt to theme
- Charts use theme-appropriate colors
- Preference saved automatically

**Benefits:**

- Reduces eye strain in low light
- Saves battery on OLED screens
- Modern, professional appearance

---

## 🎯 Pro Tips & Best Practices

### Entering Marks

1. **Enter marks immediately** after receiving results
2. **Use predictions** to set realistic FAT goals
3. **Review notes** before next assessment
4. **Export regularly** as backup

### Analyzing Performance

1. **Check dashboard weekly** to track trends
2. **Compare subjects** to identify weak areas
3. **Use charts** to visualize improvements
4. **Monitor standard deviation** for consistency

### Goal Setting

1. **Set targets** in notes section
2. **Use predictions** as benchmarks
3. **Track progress** via charts
4. **Adjust study time** based on weak subjects

### Optimization

1. **Focus on low-performing subjects** (red indicators)
2. **Maintain strong subjects** (green indicators)
3. **Balance time** based on credit hours
4. **Use trend analysis** for exam preparation

---

## 🔧 Troubleshooting

### Common Issues

#### Marks Not Saving

**Solution:**

- Check browser allows local storage
- Disable private/incognito mode
- Try different browser
- Export data as backup

#### Charts Not Showing

**Solution:**

- Enter marks for at least one subject
- Refresh the page
- Check browser console for errors
- Update browser to latest version

#### Predictions Seem Wrong

**Solution:**

- Ensure all marks are entered correctly
- Need at least 2 assessments for accurate prediction
- Check for data entry errors
- Review calculation logic in CALCULATIONS.md

#### INTERNALS Not Calculating

**Solution:**

- Check weights are configured (Settings)
- Ensure CAT/Quiz marks are entered
- Total weights should equal reasonable value
- Save settings after changes

#### Theme Not Persisting

**Solution:**

- Check browser allows local storage
- Try toggling theme again
- Clear cache and reconfigure
- Check browser permissions

---

## 📱 Mobile Usage

### Responsive Features

The app is fully mobile-optimized:

**Portrait Mode:**

- Subject cards stack vertically
- Full-width input fields
- Touch-friendly buttons
- Swipe-friendly interface

**Landscape Mode:**

- Multi-column layouts
- Charts adapt to screen size
- Horizontal scrolling for tables

**Touch Gestures:**

- Tap to expand subjects
- Swipe on charts to navigate
- Pinch to zoom on graphs (some charts)
- Long-press for tooltips

### Mobile Tips

1. **Add to Home Screen** for quick access
2. **Use landscape** for better chart viewing
3. **Export regularly** (mobile cache clears faster)
4. **Sync across devices** by exporting/importing CSV

---

## 🎓 Example Use Cases

### Use Case 1: Mid-Semester Check

```
Goal: Assess current standing and plan for FAT

1. Enter all CAT and Quiz marks
2. Go to Dashboard
3. Note overall GPA: 3.2/4.0
4. Identify weak subject: Chemistry (68%)
5. Check prediction: 72 (needs 85 for target)
6. Plan: Allocate more study time to Chemistry
7. Set note: "Review organic chemistry, target 85+"
```

### Use Case 2: FAT Preparation

```
Goal: Prioritize study time

1. Go to Dashboard → FAT Predictions
2. Note predictions:
   - DSA: 88 (comfortable)
   - Chemistry: 65 (critical!)
   - OOPS: 78 (borderline)
3. Allocate time:
   - Chemistry: 40% (critical)
   - OOPS: 35% (borderline)
   - DSA: 15% (maintenance)
   - Others: 10%
4. Set daily targets in notes
```

### Use Case 3: Semester Review

```
Goal: Analyze overall performance

1. Export data as CSV
2. Open in Excel/Sheets
3. Create pivot tables
4. Compare with previous semester
5. Identify improvement areas
6. Share with mentor/advisor
```

### Use Case 4: Parent Meeting

```
Goal: Show progress to parents

1. Open Dashboard tab
2. Show overall GPA: 3.5/4.0
3. Point out best subject: DSA (A+)
4. Discuss improvement plan for weak subject
5. Show trend charts (improving!)
6. Export CSV for their records
```

---

## 📚 Keyboard Shortcuts

| Action              | Shortcut |
| ------------------- | -------- |
| Toggle Theme        | Alt + T  |
| Open Settings       | Alt + S  |
| Export Data         | Alt + E  |
| Switch to Subjects  | Alt + 1  |
| Switch to Dashboard | Alt + 2  |
| Switch to Charts    | Alt + 3  |

_(Note: Shortcuts may vary by browser)_

---

## 🆘 Getting Help

### Resources

1. **README.md** - Project overview and setup
2. **CALCULATIONS.md** - Detailed calculation explanations
3. **USER_GUIDE.md** (this file) - Usage instructions

### Community

- Report issues on GitHub
- Suggest features via pull requests
- Share custom configurations
- Help fellow students

---

## ✅ Checklist for Success

**Daily:**

- [ ] Update marks immediately after receiving results
- [ ] Review notes for upcoming assessments

**Weekly:**

- [ ] Check dashboard for overall performance
- [ ] Analyze trends in charts
- [ ] Adjust study schedule based on weak areas

**Monthly:**

- [ ] Export data as backup
- [ ] Review predictions vs actual scores
- [ ] Update goals in notes section

**Semester:**

- [ ] Complete all mark entries
- [ ] Calculate final GPA
- [ ] Export comprehensive report
- [ ] Archive data before clearing for new semester

---

**Happy Tracking! 🎯📈**

_Version 1.0.0 - January 2026_
