# Study Timer - Visual Integration Guide

## App Navigation Structure

```
ACADEMIC TRACKER
├─ SUBJECTS      (Manage marks per subject)
├─ DASHBOARD     (View overall stats)
├─ CHARTS        (Performance visualizations)
├─ STUDY         (Manual session logging)
└─ TIMER         ← NEW! (Real-time timer)
```

---

## Study Timer UI Layout

```
┌─────────────────────────────────────────────┐
│  STUDY TIMER - FOCUSED STUDY SESSION        │
├─────────────────────────────────────────────┤
│                                             │
│  Subject: [DSA ▼]  ☑ Pomodoro (25/5)       │
│                                             │
│           00:25:30                          │ ← Large timer display
│           (HH:MM:SS)                        │
│                                             │
│  Target: 00:25:00                           │
│  ████████████████████░░ 100%                │ ← Progress bar
│                                             │
│  Hours: [0]  Minutes: [25]                  │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ Start│ │Pause │ │ Stop │ │ 🔊   │      │ ← Control buttons
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│  ✅ Target Time Reached! 🎉                 │ (when alarm triggers)
│                                             │
└─────────────────────────────────────────────┘

AFTER CLICKING STOP:
┌─────────────────────────────────────────────┐
│  SESSION COMPLETE!                          │
├─────────────────────────────────────────────┤
│                                             │
│  Rate Your Focus (1-5):                     │
│  [1] [2] [3] [4] [5⬚]                      │ ← Focus rating
│  Quite Focused                              │
│                                             │
│  Notes (Optional):                          │
│  ┌──────────────────────────────────┐      │
│  │ Completed binary trees chapter   │      │
│  └──────────────────────────────────┘      │
│                                             │
│  ┌─────────────────┐ ┌──────────────┐     │
│  │ Save Session    │ │  Discard     │     │
│  └─────────────────┘ └──────────────┘     │
│                                             │
└─────────────────────────────────────────────┘

STATISTICS CARDS:
┌──────────────────┬──────────────────┐
│  Total Minutes   │    Sessions      │
│  🕐 120          │    🎯 8          │
├──────────────────┼──────────────────┤
│  Avg Duration    │   Daily Streak   │
│  ⏱️ 15 min        │    🔥 5 days     │
└──────────────────┴──────────────────┘

SESSION HISTORY:
┌────────────────────────────────────────┐
│  Recent Sessions - DSA                 │
├────────────────────────────────────────┤
│  #3  01:30:45  ✓ Target Completed     │
│      Focus: 4/5                        │
│      "Completed binary trees chapter"  │
│      Jan 30, 2024 at 02:30 PM  [❌]   │
│                                        │
│  #2  00:25:00  ✓ Target Completed     │
│      Focus: 5/5                        │
│      Jan 30, 2024 at 01:45 PM  [❌]   │
│                                        │
│  #1  00:20:00  Target: 00:25:00       │
│      Focus: 3/5                        │
│      "Quick review session"            │
│      Jan 29, 2024 at 06:00 PM  [❌]   │
└────────────────────────────────────────┘
```

---

## Component File Structure

```
StudyTimer.jsx (400+ lines)
│
├─ Header Section
│  ├─ Subject Dropdown
│  ├─ Pomodoro Toggle
│  └─ Status Line
│
├─ Timer Display Section
│  ├─ Large Timer (00:25:30)
│  ├─ Target Time Display
│  ├─ Progress Bar
│  └─ Target Completion %
│
├─ Input Section
│  ├─ Hours Input
│  ├─ Minutes Input
│  └─ [Combined → targetSeconds]
│
├─ Controls Section
│  ├─ Start Button
│  ├─ Pause Button
│  ├─ Resume Button
│  ├─ Stop Button
│  └─ Sound Toggle
│
├─ Alert Notification (conditional)
│  ├─ "Target Time Reached!" message
│  └─ 🎉 Celebration emoji
│
├─ Feedback Form (conditional)
│  ├─ Focus Rating (1-5)
│  ├─ Notes Textarea
│  ├─ Save Button
│  └─ Discard Button
│
├─ Statistics Cards (conditional)
│  ├─ Total Minutes Card
│  ├─ Session Count Card
│  ├─ Avg Duration Card
│  └─ Daily Streak Card (🔥)
│
└─ Session History (conditional)
   ├─ Session List Container
   ├─ Session Item (×10)
   │  ├─ Session #
   │  ├─ Duration
   │  ├─ Status Badge
   │  ├─ Focus Rating
   │  ├─ Notes excerpt
   │  ├─ Timestamp
   │  └─ Delete Button
   └─ Auto-scroll to bottom
```

---

## Storage Architecture

```
BROWSER localStorage
│
├─ "academic_tracker_data"
│  └─ Marks for all subjects (EXISTING)
│
├─ "academic_tracker_study_sessions"
│  └─ Manual study session logs (EXISTING)
│
├─ "academic_tracker_timer_sessions"   ← NEW
│  └─ Automatic timer session tracking
│     ├─ Session #1 { subject, duration, target, focus, ... }
│     ├─ Session #2 { subject, duration, target, focus, ... }
│     └─ ... (1000s possible)
│
└─ "academic_tracker_theme"
   └─ Light/Dark mode preference (EXISTING)
```

**Data Isolation:** Timer sessions stored separately from marks data for safety and organization.

---

## State Flow Diagram

```
┌─────────────────────────────────────────────┐
│ Initial State (Component Mount)             │
├─────────────────────────────────────────────┤
│ isRunning: false                            │
│ seconds: 0                                  │
│ selectedSubject: ""                         │
│ targetHours: 0, targetMinutes: 25           │
│ targetReached: false                        │
│ showFeedback: false                         │
│ focusRating: 3                              │
│ notes: ""                                   │
│ soundEnabled: true                          │
│ sessions: [] (loaded from localStorage)     │
│ timerStats: {} (calculated)                 │
│ dailyStreak: 0 (calculated)                 │
│ pomodoroMode: false                         │
└─────────────────────────────────────────────┘
                       │
                       ▼
         User Selects Subject
                       │
                       ▼
       ┌───────────────────────────┐
       │  User Clicks "Start"      │
       │  isRunning: true          │
       │  setInterval begins       │
       └───────────────────────────┘
                       │
                       ▼
            Timer Updates Every 1s
          seconds: 1, 2, 3, ... N
                       │
              ┌────────┴────────┐
              │                 │
          Timer ≥         User Click
          Target?         "Pause"?
              │                 │
             YES               YES
              │                 │
              ▼                 ▼
      targetReached: true  isRunning: false
      playAlertSound()     clearInterval()
      setIsRunning(false)
              │                 │
              └────────┬────────┘
                       │
                       ▼
         User Clicks "Stop" or
         Resumes from pause
                       │
                       ▼
           ┌───────────────────────┐
           │ showFeedback: true    │
           │ Form appears          │
           └───────────────────────┘
                       │
         ┌─────────────┴────────────┐
         │                          │
    "Save Session"           "Discard"
         │                          │
         ▼                          ▼
  saveTimerSession()       handleReset()
  (to localStorage)        (clear all)
         │                          │
         ▼                          ▼
  loadSessions()            showFeedback: false
  (refresh history)         seconds: 0
  updateStats()
  dailyStreak++
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
           Ready for New Session
```

---

## localStorage Entry Example

```json
{
  "academic_tracker_timer_sessions": [
    {
      "id": 1704029400000,
      "subject": "DSA",
      "durationSeconds": 1865,
      "targetSeconds": 1500,
      "startTime": "2024-01-30T10:00:00.000Z",
      "endTime": "2024-01-30T10:31:05.000Z",
      "completedTarget": true,
      "focusRating": 4,
      "notes": "Completed binary trees chapter. Good focus!",
      "createdAt": "2024-01-30T10:31:05.000Z"
    },
    {
      "id": 1704025800000,
      "subject": "OOPS",
      "durationSeconds": 1200,
      "targetSeconds": 1500,
      "startTime": "2024-01-30T09:00:00.000Z",
      "endTime": "2024-01-30T09:20:00.000Z",
      "completedTarget": false,
      "focusRating": 3,
      "notes": null,
      "createdAt": "2024-01-30T09:20:00.000Z"
    }
  ]
}
```

---

## Feature Activation Flow

```
USER VISITS APP
    │
    ▼
  Sees 5 Tabs
  (Subjects | Dashboard | Charts | Study | Timer) ← NEW
    │
    ▼
  Clicks "Timer" Tab
    │
    ▼
  StudyTimer Component Loads
    │
    ├─ Load all sessions from localStorage
    ├─ Calculate daily streak
    └─ Calculate per-subject stats
    │
    ▼
  Display Timer UI
    │
    ├─ Subject dropdown (empty)
    ├─ Pomodoro toggle
    ├─ Timer display (00:00:00)
    ├─ Target inputs
    ├─ Control buttons
    └─ Statistics cards (hidden if no subject)
    │
    ▼
  User Selects Subject
    │
    ▼
  Statistics Update
    │
    ├─ Load that subject's sessions
    ├─ Calculate total minutes
    ├─ Calculate session count
    ├─ Calculate average duration
    └─ Display all in stat cards
    │
    ▼
  User Starts Session
    │
    └─ (described in State Flow above)
```

---

## Time Display Examples

```
formatTime() Function Examples:

0 seconds         → 00:00:00
5 seconds         → 00:00:05
60 seconds        → 00:01:00
90 seconds        → 00:01:30
3600 seconds      → 01:00:00
3661 seconds      → 01:01:01
3665 seconds      → 01:01:05
5400 seconds      → 01:30:00 (1.5 hours)
7200 seconds      → 02:00:00 (2 hours)
86400 seconds     → 24:00:00 (1 day)
```

---

## Button State Transitions

```
TIMER CONTROLS STATE MACHINE

┌─────────────────────────┐
│ INITIAL STATE           │
│ Buttons: [Start][🔊]    │
└────────┬────────────────┘
         │
         │ Click Start (duration > 0)
         ▼
┌─────────────────────────┐
│ RUNNING STATE           │
│ Buttons: [Pause][Stop]  │
├─────────────────────────┤
│ Timer: 00:00:01 →       │
│        00:00:02 →       │
│        ...              │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │          │
    │Click     │Target Reached
    │Pause     │or Click Stop
    │          │
    ▼          ▼
PAUSED     FEEDBACK
│          │
│          ├─ Show form
│Click     ├─ Rate 1-5
│Resume    ├─ Notes
│          └─ Save or Discard
│              │
│              ├─ Save → localStorage
│              │         DONE
│              │
│              └─ Discard → BACK TO INITIAL
│
└──→ Resume to RUNNING
```

---

## Color Scheme

### Light Mode

- **Primary Timer:** Blue (#2563EB)
- **Background:** White with gray borders
- **Text:** Dark gray/black
- **Success/Target Reached:** Green (#22C55E)
- **Warning/Alert:** Yellow (#EAB308)
- **Focus Rating Buttons:**
  - Unselected: White with border
  - Selected: Blue with white text

### Dark Mode

- **Primary Timer:** Blue (#60A5FA)
- **Background:** Gray-800 (#1F2937)
- **Text:** White with gray headings
- **Success:** Green (#4ADE80)
- **Warning:** Yellow (#FACC15)
- **Focus Buttons:**
  - Unselected: Gray-800 with gray border
  - Selected: Blue with white text

---

## Responsive Design

```
DESKTOP (1024px+)
┌─────────────────────────────────┐
│ [Subject ▼] [Pomodoro ☑]        │
│                                 │
│         00:25:30                │
│                                 │
│ Progress: ████████░░ 100%       │
│ [Hours: 0] [Minutes: 25]        │
│ [Start] [Pause] [Stop] [🔊]     │
│                                 │
│ ┌──┬──┬──┬──┐                   │
│ │  │  │  │🔥│ (4 stat cards)    │
│ └──┴──┴──┴──┘                   │
│                                 │
│ Recent Sessions                 │
│ ├─ Session 1                    │
│ ├─ Session 2                    │
│ └─ Session 3                    │
└─────────────────────────────────┘

TABLET (768px-1024px)
┌──────────────────────┐
│ [Subject ▼] [Pomodoro]
│                      │
│      00:25:30        │
│                      │
│ Progress: ████░░ 100%│
│ [0] [25]             │
│ [Start][Pause][Stop] │
│                      │
│ ┌──┬──┐              │
│ │  │  │ (2x2 grid)   │
│ ├──┼──┤              │
│ │  │🔥│              │
│ └──┴──┘              │
│                      │
│ Sessions             │
│ (scrollable list)    │
└──────────────────────┘

MOBILE (< 768px)
┌──────────────┐
│[Subject ▼]   │
│[Pomodoro ☑]  │
│              │
│   00:25:30   │
│              │
│Progress █░░  │
│100%          │
│              │
│[Hours: 0]    │
│[Mins: 25]    │
│              │
│[Start]       │
│[Pause]       │
│[Stop]        │
│[🔊]          │
│              │
│ ┌─────────┐  │
│ │ Card 1  │  │
│ └─────────┘  │
│ ┌─────────┐  │
│ │ Card 2  │  │
│ └─────────┘  │
│ ┌─────────┐  │
│ │ Card 3  │  │
│ └─────────┘  │
│ ┌─────────┐  │
│ │ Card 4  │  │
│ └─────────┘  │
│              │
│ Sessions     │
│ (scroll)     │
└──────────────┘
```

---

## Integration Points (Code)

### 1. App.jsx - Navigation

```jsx
{["subjects", "dashboard", "charts", "study", "timer"].map(tab => (
  <button ... >{tab}</button>
))}
```

### 2. App.jsx - Route

```jsx
{
  activeTab === "timer" && <StudyTimer />;
}
```

### 3. App.jsx - Cleanup

```jsx
const handleClearData = () => {
  clearAllTimerSessions();  ← Added
  // ... other clears
}
```

### 4. App.jsx - Imports

```jsx
import StudyTimer from "./components/StudyTimer";
import { clearAllTimerSessions } from "./utils/timerStorage";
```

---

## Success Indicators

✅ **Feature is working when:**

1. "Timer" tab appears in navigation
2. Dropdown shows all 9 subjects
3. Timer displays 00:00:00
4. Start button is clickable
5. Timer updates every second
6. Stop creates feedback form
7. Sessions save to history
8. Stats update in real-time
9. Daily streak shows 🔥
10. Dark mode toggles correctly

✅ **No errors in console**
✅ **App runs on localhost:3001**
✅ **No marks/dashboard issues**

---

## Quick Testing Script

```javascript
// In browser console while on Timer tab:

// Test 1: Check localStorage key exists
localStorage.getItem("academic_tracker_timer_sessions");
// Should return: "[]" or array of sessions

// Test 2: Manually add a test session
const testSession = {
  id: Date.now(),
  subject: "DSA",
  durationSeconds: 3661,
  targetSeconds: 3600,
  completedTarget: true,
  focusRating: 4,
  notes: "Test session",
};
const sessions = JSON.parse(
  localStorage.getItem("academic_tracker_timer_sessions") || "[]",
);
sessions.push(testSession);
localStorage.setItem(
  "academic_tracker_timer_sessions",
  JSON.stringify(sessions),
);

// Refresh page - session should appear in history!
```

---

## Perfect! You're ready to go! 🚀
