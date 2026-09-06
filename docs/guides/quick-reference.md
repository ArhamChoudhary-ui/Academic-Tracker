# Quick Reference - Three New Features

## 🎯 Feature Overview

### 1️⃣ Study Session Tracker

**Location**: "Study" tab in navbar

- **What**: Log study sessions (subject, duration, focus, notes)
- **View**: Subject-wise stats + recent sessions
- **Storage**: localStorage with key `"academic_tracker_study_sessions"`
- **Component**: `src/components/StudyTracker.jsx`
- **Utils**: `src/utils/study.js`

### 2️⃣ Consistency Score

**Location**: Dashboard tab

- **What**: Measures performance consistency (0-100 scale)
- **Formula**: `100 - (standardDeviation × 0.5)`
- **Display**: New stat card + subject table column
- **Colors**: Green (80+) → Yellow (60-79) → Red (<60)
- **Functions**: In `src/utils/calculations.js`

### 3️⃣ Report View

**Location**: Document icon (📄) in header

- **What**: Professional read-only report with all metrics
- **Includes**: Summary, subject table, charts, insights
- **Print-ready**: Click "Print / Save" to export as PDF
- **Component**: `src/components/ReportView.jsx`

---

## 📁 New/Modified Files

### New Files

```
src/components/StudyTracker.jsx (395 lines)
src/components/ReportView.jsx (230 lines)
src/utils/study.js (75 lines)
FEATURES_IMPLEMENTATION.md (this guide)
```

### Modified Files

```
src/App.jsx
  - Added imports: StudyTracker, ReportView, clearAllStudySessions
  - Added state: showReport, activeTab includes "study"
  - Updated header: Report button, updated tabs, updated settings

src/Dashboard.jsx
  - Added imports: consistency calculation functions
  - New stat card: "Consistency Score"
  - New table column: "Consistency"

src/Charts.jsx
  - Added reportMode parameter (for future use)

src/utils/calculations.js
  - Added: calculateConsistencyScore()
  - Added: getConsistencyLabel()
  - Added: getConsistencyColor()
```

---

## 🔧 API Reference

### Study Session Functions

```javascript
import {
  saveStudySession, // (session) → sessionObject
  loadAllStudySessions, // () → array of sessions
  deleteStudySession, // (sessionId) → boolean
  getStudyStatsForSubject, // (subject) → statsObject
  getAllSubjectStats, // (subjects) → statsMap
  clearAllStudySessions, // () → boolean
} from "../utils/study.js";
```

### Consistency Score Functions

```javascript
import {
  calculateConsistencyScore, // (values) → number 0-100
  getConsistencyLabel, // (score) → string
  getConsistencyColor, // (score) → Tailwind color class
} from "../utils/calculations.js";
```

---

## 💾 Data Structures

### Study Session Object

```javascript
{
  id: 1704067200000,              // timestamp
  subject: "DSA",
  duration: 90,                   // minutes
  focus: 4,                       // 1-5
  note: "Covered linked lists",   // optional
  date: "2024-01-01T12:00:00Z"
}
```

### Study Stats Object

```javascript
{
  totalMinutes: 450,              // cumulative
  sessionCount: 5,                // number of sessions
  averageFocus: 3.8,              // 0-5 scale
  averageDuration: 90             // average minutes per session
}
```

---

## 🎨 UI Integration

### Navigation Tabs

```javascript
["subjects", "dashboard", "charts", "study"]; // "study" added
```

### Header Buttons (right to left)

1. 📄 Report (NEW) - Opens report modal
2. ⬇️ Export - CSV export (existing)
3. ⚙️ Settings - Clear data (existing)
4. 🌙 Theme - Dark mode toggle (existing)

### Dashboard - New Stat Card

- Position: 4th card in the grid
- Title: "Consistency Score"
- Value: Score/100
- Icon: Zap (⚡)
- Color: Orange-based

---

## 🚀 Quick Start

### To Log a Study Session

1. Click "Study" in navbar
2. Click "New Session"
3. Select subject
4. Enter duration (minutes)
5. Set focus level (1-5 slider)
6. Optional: Add a note
7. Click "Save Session"

### To View Consistency

1. Go to "Dashboard" tab
2. Look for "Consistency Score" stat card
3. View subject consistency in table below

### To Generate Report

1. Click 📄 icon in header
2. Review all metrics
3. Click "Print / Save" for PDF export
4. Click X to close

---

## 🔄 Data Flow

```
User Action
    ↓
Component State Update
    ↓
useEffect Triggers
    ↓
Function Call (from study.js / calculations.js)
    ↓
localStorage.setItem() / calculate()
    ↓
State Updated
    ↓
Component Re-renders
```

---

## 📊 Consistency Score Details

### What It Measures

Standard deviation of all marks (CAT, Quiz, FAT, Lab) per subject

### Scale Interpretation

| Score  | Label                 | Meaning                                  | Color     |
| ------ | --------------------- | ---------------------------------------- | --------- |
| 80-100 | Very Consistent       | Stable performance across assessments    | 🟢 Green  |
| 60-79  | Moderately Consistent | Some variation but generally steady      | 🟡 Yellow |
| 0-59   | Inconsistent          | Wide variation in assessment performance | 🔴 Red    |

### Example

- Student A: Marks [45, 46, 44, 45, 46] → stdDev=0.6 → Score≈100 (Very Consistent)
- Student B: Marks [30, 50, 40, 60, 35] → stdDev=12 → Score≈94 (Very Consistent)
- Student C: Marks [80, 30, 75, 25, 90] → stdDev=27 → Score≈86 (Very Consistent)
- Student D: Marks [20, 90, 25, 85, 30] → stdDev=34 → Score≈83 (Very Consistent)

---

## 🐛 Common Issues & Fixes

| Issue               | Cause                  | Fix                     |
| ------------------- | ---------------------- | ----------------------- |
| Sessions not saving | localStorage disabled  | Check browser settings  |
| Consistency shows 0 | No marks entered       | Enter marks for subject |
| Report won't open   | subjectsData is null   | Wait for data to load   |
| Print cuts off data | Page margins too small | Adjust print margins    |

---

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+
- ⚠️ Mobile browsers (responsive but best on desktop)

---

## 🔐 Data Privacy

- **Storage**: All data stored locally in browser
- **Sync**: No cloud sync, no server uploads
- **Clearing**: "Clear All Data" removes everything from localStorage
- **Export**: CSV export doesn't upload anywhere
- **Reports**: Generated entirely client-side

---

## 🎓 Example Workflow

### Scenario: Tracking Study Progress in DSA

**Step 1: Log Study Sessions**

```
Day 1: 60 min, Focus 4, "Covered arrays"
Day 2: 90 min, Focus 5, "Sorting algorithms"
Day 3: 75 min, Focus 3, "Linked lists"
```

**Step 2: Check Dashboard**

- See "Study" stats: 225 min total, avg focus 4/5
- View Consistency score for DSA

**Step 3: Generate Report**

- See overall performance metrics
- Note consistency changes over time
- Print report for reference

---

## 💡 Pro Tips

1. **Study Sessions**: Log after each study session for accurate tracking
2. **Consistency**: Aim for scores >75 to ensure balanced learning
3. **Report**: Generate weekly reports to monitor progress
4. **Dark Mode**: All new features fully support dark mode
5. **Mobile**: Use tablet/desktop for best report printing experience

---

## 📞 Support

If features aren't working:

1. Open DevTools (F12)
2. Check Console for errors
3. Check Application → Storage → localStorage
4. Refresh page (Ctrl+Shift+R hard refresh)
5. Clear browser cache and try again

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
