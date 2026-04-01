# Study Timer Feature - Implementation Guide

## Overview

The **Study Timer** feature is a real-time study session tracker that allows users to:

- Start a focused study session with a built-in countdown timer
- Set target study durations with alarm notifications
- Track focus levels and take session notes
- Maintain daily study streaks
- View detailed session history per subject

## Files Created

### 1. `/src/utils/timerStorage.js` (140 lines)

**Purpose:** localStorage management for timer sessions

**Key Functions:**

```javascript
// Save a completed study session
saveTimerSession(session)
  → Returns: { id, subject, durationSeconds, targetSeconds, startTime, endTime, completedTarget, focusRating, notes, createdAt }

// Load all timer sessions from storage
loadTimerSessions()
  → Returns: Array of session objects

// Delete a specific session by ID
deleteTimerSession(sessionId)
  → Returns: boolean

// Get stats for a specific subject
getTimerStatsForSubject(subject)
  → Returns: { totalMinutes, sessionCount, averageDuration, targetsCompleted }

// Get stats for all subjects
getAllTimerStats(subjects)
  → Returns: Object with stats for each subject

// Calculate daily study streak
calculateDailyStreak()
  → Returns: number (consecutive days with study sessions)

// Format seconds to HH:MM:SS string
formatTime(seconds)
  → Returns: "01:30:45"

// Calculate progress toward target
calculateTargetCompletion(durationSeconds, targetSeconds)
  → Returns: number (0-100%)

// Clear all stored timer sessions
clearAllTimerSessions()
  → Returns: boolean
```

**Storage Key:** `"academic_tracker_timer_sessions"`

**Session Data Structure:**

```javascript
{
  id: number,                    // Timestamp-based unique ID
  subject: string,               // Subject name from SUBJECTS
  durationSeconds: number,       // Actual study duration
  targetSeconds: number,         // Target duration user set
  startTime: "2024-01-30T10:00:00.000Z",  // ISO string
  endTime: "2024-01-30T10:30:00.000Z",    // ISO string
  completedTarget: boolean,      // Did user reach target time?
  focusRating: number,           // 1-5 scale (user provided)
  notes: string | null,          // Optional user notes
  createdAt: "2024-01-30T10:30:00.000Z"   // Saved timestamp
}
```

---

### 2. `/src/components/StudyTimer.jsx` (400+ lines)

**Purpose:** Complete UI for the real-time study timer

**Key Features:**

#### Timer Display

- Large, easy-to-read digital clock (HH:MM:SS format)
- Real-time updates every second
- Automatic formatting with leading zeros

#### Pre-Session Setup

- **Subject Selection:** Dropdown to choose which subject user is studying
- **Target Duration:** Separate hour and minute inputs
- **Pomodoro Mode:** Toggle for automatic 25/5 minute intervals

#### Timer Controls

- **Start Button:** Begins timer (disabled if no subject selected)
- **Pause Button:** Pauses the timer mid-session
- **Resume Button:** Continues from paused state
- **Stop Button:** Ends session and triggers feedback form
- **Sound Toggle:** Enable/disable alarm sound for target reached

#### Target Progress

- Visual progress bar showing completion % of target
- Only displays if target duration is set
- Color changes to green when target is reached
- Shows percentage and remaining time

#### Alarm Notification

- When timer reaches target duration:
  - Visual notification with celebration message
  - Sound alert (can be disabled)
  - Automatic pause
  - Clear indication that target was met

#### Post-Session Feedback

- **Focus Rating:** 1-5 star rating (with descriptive labels)
- **Notes:** Optional textarea for session notes
- **Auto-Complete Detection:** Shows "Target Completed" badge if actual duration ≥ target
- **Save/Discard Options:** Clear buttons to save or discard session

#### Session Statistics (Per Subject)

- **Total Minutes:** Sum of all session durations
- **Session Count:** Total number of sessions for subject
- **Average Duration:** Mean duration of sessions
- **Daily Streak:** Consecutive days with study sessions
- **Visual Stat Cards:** Icons and color-coded display

#### Session History

- List of 10 most recent sessions for selected subject
- Shows:
  - Duration in HH:MM:SS format
  - Target status (completed or target time shown)
  - Focus rating (if provided)
  - Session notes excerpt
  - Timestamp (date and time)
  - Delete button for each session
- Scrollable container (max 400px height)
- Reverse chronological order (newest first)

**State Management:**

```javascript
const [isRunning, setIsRunning] = useState(false);
const [seconds, setSeconds] = useState(0); // Accumulated seconds
const [selectedSubject, setSelectedSubject] = useState("");
const [targetHours, setTargetHours] = useState(0);
const [targetMinutes, setTargetMinutes] = useState(25); // Default 25 min
const [targetReached, setTargetReached] = useState(false);
const [showFeedback, setShowFeedback] = useState(false); // Post-session form
const [focusRating, setFocusRating] = useState(3); // Default mid-range
const [notes, setNotes] = useState("");
const [soundEnabled, setSoundEnabled] = useState(true);
const [sessions, setSessions] = useState([]); // Session history
const [timerStats, setTimerStats] = useState({}); // Per-subject stats
const [dailyStreak, setDailyStreak] = useState(0);
const [pomodoroMode, setPomodoroMode] = useState(false);
```

**Key Hooks:**

- `useRef` for `setInterval` reference (prevents memory leaks)
- `useEffect` for timer logic (updates every 1000ms)
- `useEffect` for loading/calculating stats

**Sound Generation:**

- Uses Web Audio API (AudioContext) to generate alarm tone
- 800Hz sine wave, 0.5 second duration
- Exponential fade-out for smooth termination
- Fallback error handling for unsupported browsers

---

## Data Flow

```
User selects subject
        ↓
Sets target time (optional)
        ↓
Clicks "Start"
        ↓
Timer counts up → updates UI every 1000ms
        ↓
Either:
  a) User pauses/resumes
  b) Timer reaches target → triggers alarm → auto-pause
  c) User clicks Stop
        ↓
Feedback form appears
        ↓
User rates focus (1-5) + optional notes
        ↓
Clicks "Save Session"
        ↓
Session saved to localStorage via timerStorage.saveTimerSession()
        ↓
Session history updates
        ↓
Stats recalculated and displayed
```

---

## Integration Points

### App.jsx Changes

```javascript
// Added imports
import StudyTimer from "./components/StudyTimer";
import { clearAllTimerSessions } from "./utils/timerStorage";

// Added "timer" tab to navigation
{["subjects", "dashboard", "charts", "study", "timer"].map(tab => ...)}

// Added timer tab rendering
{activeTab === "timer" && <StudyTimer />}

// Updated clearData to include timers
handleClearData() {
  clearAllStudySessions();
  clearAllTimerSessions();  // NEW
}
```

### localStorage Keys

- **Study Timer Sessions:** `"academic_tracker_timer_sessions"`
- **Existing Study Sessions:** `"academic_tracker_study_sessions"` (from study.js)
- **Marks Data:** `"academic_tracker_data"`

⚠️ **Important:** Timer sessions are stored separately from general study sessions to avoid conflicts.

---

## Usage Examples

### Scenario 1: Basic 30-Minute Study Session

1. Navigate to "Timer" tab
2. Select "DSA" from subject dropdown
3. Set target: 0 hours, 30 minutes
4. Click "Start"
5. Timer counts 00:00:00 → 00:30:00
6. At 30 minutes: alarm sounds, visual notification
7. Rate focus: 4/5
8. Add notes: "Completed binary trees chapter"
9. Click "Save Session"
10. Session added to history

### Scenario 2: Pomodoro Session

1. Select subject
2. Toggle "Pomodoro (25/5)" checkbox
3. Target auto-set to 25 minutes
4. Start timer
5. Get alert at 25 minutes → take 5 minute break
6. Repeat

### Scenario 3: Unstructured Study (No Target)

1. Select subject
2. Leave target at 0:00
3. Start timer
4. Study for as long as needed
5. Manually click "Stop" when done
6. Provide feedback and save

---

## Features Explained

### Real-Time Timer

- Uses `setInterval` to update every 1000 milliseconds
- Safely cleans up interval on component unmount
- Prevents memory leaks with proper ref handling

### Sound Alert

- Generated using Web Audio API (no audio files needed)
- 800Hz sine wave tone
- 0.5 second duration with exponential fade
- Can be toggled on/off via button
- Gracefully handles browser compatibility issues

### Daily Streak

- Calculated from session createdAt dates
- Consecutive days only (gaps break the streak)
- Displayed in stats card with fire emoji 🔥
- Motivational indicator of study consistency

### Focus Rating

- 1-5 scale with descriptions:
  - 1: Very Distracted
  - 2: Mostly Distracted
  - 3: Neutral
  - 4: Quite Focused
  - 5: Fully Focused
- User-provided feedback (not automatic)
- Stored with session for analysis

### Target Completion Detection

- Formula: `(durationSeconds / targetSeconds) × 100`
- Capped at 100% to prevent overflow
- Used for progress bar visualization
- Marked as "completed" if actual ≥ target

---

## Styling

Uses existing Tailwind CSS classes from the project:

- **Colors:** Blue (primary), Purple (secondary), Green (success), Red (danger), Yellow/Orange (warning)
- **Dark Mode:** Full support via `dark:` prefix classes
- **Responsive:** Mobile-friendly grid layouts (1 col mobile, 4 col desktop)
- **Typography:** Consistent font sizing and weights with existing design

Key style patterns:

```jsx
// Large timer display
className = "text-7xl font-bold font-mono text-blue-600 dark:text-blue-400";

// Stat cards
className = "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6";

// Focus rating buttons
focusRating === rating ? "bg-blue-500 text-white scale-110" : "...";

// Progress bar
className = "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3";
```

---

## Performance Considerations

1. **setInterval Cleanup:** Interval properly cleared on unmount
2. **localStorage Limits:** Typical browser limit is 5-10MB; this feature should use <1MB even with 1000+ sessions
3. **Array Operations:** Session filtering/mapping is linear O(n), acceptable for typical use
4. **Audio Generation:** One-time generation per alert (not looped)
5. **State Updates:** Only update when necessary (focus only on actively running timer)

---

## Browser Compatibility

| Feature                        | Chrome | Firefox | Safari   | Edge | Opera |
| ------------------------------ | ------ | ------- | -------- | ---- | ----- |
| Timer (setTimeout/setInterval) | ✅     | ✅      | ✅       | ✅   | ✅    |
| localStorage                   | ✅     | ✅      | ✅       | ✅   | ✅    |
| Web Audio API                  | ✅     | ✅      | ✅ (11+) | ✅   | ✅    |
| Dark Mode                      | ✅     | ✅      | ✅       | ✅   | ✅    |

---

## Customization Guide

### Change Default Target Time

In `StudyTimer.jsx`, line with `const [targetMinutes, setTargetMinutes]`:

```javascript
const [targetMinutes, setTargetMinutes] = useState(45); // Change 25 to 45
```

### Change Alarm Frequency

In `timerStorage.js`, `calculateDailyStreak()`:

```javascript
// Current: consecutive days only
// To count weeks instead:
const weeksDiff = Math.floor(
  (currentDate - sessionDate) / (1000 * 60 * 60 * 24 * 7),
);
```

### Change Alarm Sound

In `StudyTimer.jsx`, `playAlertSound()`:

```javascript
oscillator.frequency.value = 1000; // Change 800 to higher/lower pitch
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1); // Longer duration
```

### Add More Stats

In `timerStorage.js`, extend `getTimerStatsForSubject()`:

```javascript
return {
  ...existing stats,
  longestSession: Math.max(...subjectSessions.map(s => s.durationSeconds)),
  shortestSession: Math.min(...subjectSessions.map(s => s.durationSeconds))
}
```

---

## Troubleshooting

### Timer not starting

- **Check:** Is a subject selected? (Start button requires selection)
- **Fix:** Choose subject from dropdown before clicking Start

### No sound on alarm

- **Check:** Is sound toggle enabled? (Check volume button)
- **Fix:** Click volume button to enable, or check browser audio permissions
- **Note:** Some browsers may block autoplay; check console for errors

### Sessions not saving

- **Check:** Did you click "Save Session" after feedback form?
- **Fix:** "Discard" button loses data; "Save Session" is required
- **Note:** Sessions only save after timer stops and feedback is submitted

### localStorage full error

- **Check:** How many sessions are stored? (localStorage typically 5-10MB)
- **Fix:** Delete old sessions or clear all data in Settings
- **Note:** Each session stores ~500 bytes; 1000 sessions = ~0.5MB

### Focus rating not displaying

- **Check:** Was the session saved with a focus rating?
- **Fix:** Ratings are optional; only show if provided
- **Note:** Default rating is 3; can be changed before saving

---

## Testing Checklist

- [ ] Timer starts and counts up correctly
- [ ] Subject dropdown works
- [ ] Target can be set (hours/minutes)
- [ ] Pause/Resume functions properly
- [ ] Stop button triggers feedback form
- [ ] Focus rating 1-5 works
- [ ] Notes textarea accepts input
- [ ] Session saves to localStorage
- [ ] Session appears in history
- [ ] Delete session removes from list
- [ ] Stats update after saving
- [ ] Daily streak calculates correctly
- [ ] Pomodoro mode auto-sets 25 min
- [ ] Sound alert triggers at target
- [ ] Sound can be toggled on/off
- [ ] Dark mode styling works
- [ ] Mobile responsiveness (test on small screen)
- [ ] Clear All Data removes timer sessions
- [ ] No console errors

---

## API Reference

### timerStorage.js Functions

```javascript
// Save a new session (called after user completes session + provides feedback)
const sessionId = saveTimerSession({
  subject: "DSA",
  durationSeconds: 1800,
  targetSeconds: 1500,
  completedTarget: true,
  focusRating: 4,
  notes: "Completed binary trees",
});

// Load all sessions
const allSessions = loadTimerSessions();
// Returns: [{ id, subject, durationSeconds, ... }, ...]

// Get stats for one subject
const stats = getTimerStatsForSubject("DSA");
// Returns: { totalMinutes: 120, sessionCount: 8, averageDuration: 15, targetsCompleted: 6 }

// Get stats for all subjects
const allStats = getAllTimerStats(SUBJECTS);
// Returns: { "DSA": {...}, "OOPS": {...}, ... }

// Delete a session
deleteTimerSession(1704029400000); // timestamp-based ID

// Format seconds to HH:MM:SS
formatTime(3661); // Returns: "01:01:01"

// Calculate progress
const progress = calculateTargetCompletion(900, 1200); // Returns: 75 (75% of target)

// Get daily streak
const streak = calculateDailyStreak(); // Returns: 5 (5 consecutive days)

// Clear all stored sessions
clearAllTimerSessions(); // Returns: true
```

---

## Known Limitations

1. **No offline sync:** Sessions saved to localStorage; no cloud backup
2. **Single device:** Data not synced across devices
3. **No pause persistence:** If browser crashes mid-session, pause state is lost
4. **Audio limitations:** May not work on some mobile browsers without user interaction first
5. **Timezone:** All times stored as UTC ISO strings; local conversion happens on display

---

## Future Enhancement Ideas

- [ ] Export timer sessions as CSV (like marks data)
- [ ] Weekly/monthly study reports
- [ ] Subject-specific study goals with progress tracking
- [ ] Study patterns analysis (best time of day, most productive subject)
- [ ] Leaderboard/competition mode with friends
- [ ] Integration with Google Calendar to block study time
- [ ] Productivity insights and recommendations
- [ ] Custom alarm sounds/notifications

---

## Architecture Notes

The Study Timer feature is **completely independent** from the existing Study Tracker:

- Separate localStorage key: `academic_tracker_timer_sessions` vs `academic_tracker_study_sessions`
- Separate component: `StudyTimer.jsx` vs `StudyTracker.jsx`
- Separate utilities: `timerStorage.js` vs `study.js`
- Both features can coexist without conflicts

This design allows users to:

- Use **StudyTimer** for real-time focused study sessions
- Use **StudyTracker** for logging completed study efforts
- Use both together for comprehensive study tracking

---

## Summary

The Study Timer feature provides a distraction-free, real-time study session tracker with:

- ✅ Real-time HH:MM:SS timer
- ✅ Customizable target durations
- ✅ Audio/visual alarm notifications
- ✅ Post-session feedback (focus rating + notes)
- ✅ Pomodoro mode support
- ✅ Session history with delete functionality
- ✅ Per-subject statistics
- ✅ Daily streak tracking
- ✅ Full dark mode support
- ✅ Mobile-responsive design
- ✅ localStorage persistence
- ✅ Zero breaking changes to existing features
