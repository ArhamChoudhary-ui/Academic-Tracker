# Study Timer - Quick Start Guide

## Where to Find the Study Timer?

1. Open the app
2. Click **"Timer"** tab in the top navigation (next to "Study")
3. Start studying!

---

## Basic Usage (3 Steps)

### Step 1: Select Subject

```
Dropdown menu → Choose your subject (DSA, OOPS, etc.)
```

### Step 2: Set Target (Optional)

```
Hour input: 0
Minute input: 30
(This sets a 30-minute target)
```

### Step 3: Start & Study

```
Click "Start" → Timer begins
Click "Stop" → Session ends, feedback form appears
Rate focus (1-5) → Click "Save Session"
```

---

## Timer Buttons

| Button       | What It Does               | When to Use         |
| ------------ | -------------------------- | ------------------- |
| **Start**    | Begin new session          | When ready to study |
| **Pause**    | Stop timer temporarily     | Need a quick break  |
| **Resume**   | Continue from pause        | After short break   |
| **Stop**     | End session, save feedback | Session finished    |
| **Volume**   | Toggle alarm sound         | On/Off for alerts   |
| **🔥 Emoji** | Shows daily streak         | Motivation display  |

---

## Key Features

### Real-Time Timer

- **Display:** HH:MM:SS (e.g., 00:25:30)
- **Updates:** Every second
- **Large Text:** Easy to read

### Target Alarm

- **Set target time** (e.g., 30 minutes)
- **Timer reaches target** → Sound alert + visual notification
- **Auto-pauses** so you can decide to continue or stop

### Focus Rating

After stopping, rate your focus:

- **1** = Very Distracted
- **2** = Mostly Distracted
- **3** = Neutral
- **4** = Quite Focused
- **5** = Fully Focused

### Session Notes

Optional textarea to add notes:

- What did you study?
- Any challenges?
- Accomplishments?

### Pomodoro Mode

```
Toggle "Pomodoro (25/5)" checkbox
→ Auto-sets 25 minutes target
→ Perfect for traditional pomodoro sessions
```

---

## Session History

Shows your recent study sessions for selected subject:

- **Duration** in HH:MM:SS format
- **Target Status** (completed ✓ or target shown)
- **Focus Level** (1-5)
- **Date & Time** of session
- **Delete Button** to remove if needed

---

## Statistics (Per Subject)

**Total Minutes** - Sum of all your study time
**Sessions** - How many times you studied
**Avg Duration** - Average session length
**Streak** 🔥 - Consecutive days you studied

---

## Practical Scenarios

### Scenario 1: Exam Prep (2-Hour Session)

```
1. Select "Probability and Statistics"
2. Set: 2 hours, 0 minutes
3. Click Start
4. Study for 2 hours
5. Alarm triggers → Rate focus → Save
```

### Scenario 2: Quick Break Study (10 min)

```
1. Select "English"
2. Set: 0 hours, 10 minutes
3. Click Start
4. 10-minute focus burst
5. Alarm → Save session
```

### Scenario 3: Pomodoro (4 Cycles = 2 Hours)

```
1. Toggle Pomodoro (25/5 auto-sets)
2. Start → Study 25 min → Stop → Break 5 min
3. Repeat 4 times = 2 hours total
```

---

## Tips for Best Results

1. **Pick a subject first** - Start button requires subject selection
2. **Use realistic targets** - 25-60 min sessions are most effective
3. **Rate honestly** - 1-5 feedback helps identify patterns
4. **Add notes** - Capture what you learned or struggled with
5. **Check daily streak** - Aim for consistency, not perfection
6. **Use Pomodoro** - Great for focused, distraction-free study
7. **Sound alerts** - Enable sound so you don't miss the alarm

---

## Troubleshooting

### "Start button is greyed out"

→ Select a subject from dropdown first

### "No sound when timer ends"

→ Click volume button to enable sound, or check browser settings

### "Session not saving"

→ Make sure you clicked "Save Session", not "Discard"

### "Stats not updating"

→ Refresh page, or check if sessions are being saved to history

---

## Data Storage

✅ **All sessions saved locally** - No internet needed
✅ **Data persists** - Sessions remain even after closing browser
✅ **Private by default** - No cloud sync or sharing

To clear timer data:

```
Settings → Clear All Data → Yes
```

---

## Integration with Other Features

- **"Study" Tab:** Manual session logging (separate from Timer)
- **"Dashboard":** View overall marks and stats
- **"Charts":** See your performance trends
- **"Subjects":** Manage individual subject marks

The Timer is **independent** - your marks data stays separate!

---

## Keyboard Shortcut (Future)

Currently, no keyboard shortcuts. You must use the buttons.

---

## Mobile Usage

✅ Fully responsive on phones/tablets
✅ Large timer display for easy viewing
✅ Touch-friendly buttons
⚠️ Audio may require user interaction first (browser restriction)

---

## FAQ

**Q: Can I use the timer offline?**
A: Yes! Timer runs completely offline. Sessions save locally.

**Q: Does it sync across devices?**
A: No. Sessions only exist on this device/browser.

**Q: What happens if I close the browser?**
A: Sessions are saved. Next time you open, they'll still be there.

**Q: Can I edit a session after saving?**
A: Not directly. You can delete and create a new one.

**Q: Why are timer and study sessions separate?**
A: Timer = real-time tracking. Study = manual logging. Both useful!

**Q: How many sessions can I save?**
A: Thousands (limited by browser localStorage, typically 5-10MB).

---

## File Locations (For Developers)

```
/src/components/StudyTimer.jsx      ← Main component (400+ lines)
/src/utils/timerStorage.js          ← Storage utilities (140 lines)
/src/App.jsx                        ← Integration (added "timer" tab)
```

---

## Next Steps

1. ✅ Click "Timer" tab
2. ✅ Select a subject
3. ✅ Click Start
4. ✅ Study for 25 minutes
5. ✅ Get alert, rate focus, save session
6. ✅ Check your stats
7. ✅ Build your streak! 🔥

---

## Need Help?

Check the **STUDY_TIMER_GUIDE.md** file for detailed documentation and troubleshooting.

Happy studying! 📚⏱️
