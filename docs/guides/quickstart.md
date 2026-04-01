# Quick Reference - Study Planner & Syllabus Manager

## Two New Features

### ✅ Study Planner (Calendar-Based Task Planning)

- **Tab**: "Planner"
- **What**: Plan study sessions day-by-day
- **Components**: StudyPlanner.jsx, PlannerDayModal.jsx
- **Storage**: `academic_tracker_planner_data`

**Quick Usage**:

1. Click "Planner" tab
2. Click any date
3. Add task (subject, topic, time, priority)
4. Check off when complete
5. Syllabus topic auto-completes ✨

### ✅ Syllabus Manager (Topic Hierarchy)

- **Tab**: "Syllabus"
- **What**: Define and track course topics
- **Components**: SyllabusManager.jsx
- **Storage**: `academic_tracker_syllabus_data`

**Quick Usage**:

1. Click "Syllabus" tab
2. Add topics (with difficulty)
3. Expand to add subtopics
4. Check off as completed
5. See progress % update

---

## The Key Integration

```
Planner Task (with topicId)
        ↓
Task Completed by User
        ↓
markTopicCompleted(subject, topicId) AUTOMATICALLY triggered
        ↓
Syllabus Topic Auto-Completed
        ↓
Progress % updates automatically
        ↓
Single source of truth - no duplicates!
```

---

## Core API (Most Common)

### Planner

```javascript
addPlannerTask(dateKey, {
  subject,
  topicId,
  topicName,
  estimatedMinutes,
  priority,
});
updatePlannerTask(dateKey, taskId, { completed: true });
getPlannerTasksForDate(dateKey);
deletePlannerTask(dateKey, taskId);
```

### Syllabus

```javascript
addTopic(subject, { name, difficulty });
markTopicCompleted(subject, topicId, true);
getSubjectProgress(subject, SUBJECTS);
getOverallProgress(SUBJECTS);
getAllTopicsFlattened(subject, SUBJECTS); // For dropdown
```

---

## File Locations

**New Files**:

```
src/components/StudyPlanner.jsx
src/components/PlannerDayModal.jsx
src/components/SyllabusManager.jsx
src/utils/plannerStorage.js
src/utils/syllabusStorage.js
```

**Modified**:

```
src/App.jsx (+3 lines: imports + tabs)
```

---

## Storage Keys (Separate & Safe)

```
academic_tracker_data           → Marks (unchanged)
academic_tracker_timer_sessions → Timer (unchanged)
academic_tracker_planner_data   → NEW: Tasks
academic_tracker_syllabus_data  → NEW: Topics
```

**Why separate?** Zero breaking changes, isolated data, independent features.

---

## Data Examples

**Planner Task**:

```javascript
{
  id: "2026-02-15-uuid",
  subject: "DSA",
  topicId: "trees-uuid",
  topicName: "Tree Traversals",
  estimatedMinutes: 120,
  priority: "high",
  completed: false
}
```

**Syllabus Topic**:

```javascript
{
  id: "trees-uuid",
  name: "Trees",
  completed: false,
  difficulty: "medium",
  notes: "",
  children: [
    { id: "trav-uuid", name: "Traversals", completed: false, children: [] }
  ]
}
```

---

## Features at a Glance

| Feature           | Planner | Syllabus    |
| ----------------- | ------- | ----------- |
| Monthly calendar  | ✅      | -           |
| Add tasks         | ✅      | ✅ (topics) |
| Edit/Delete       | ✅      | ✅          |
| Nested structure  | -       | ✅          |
| Progress tracking | ✅      | ✅          |
| Completion sync   | ✅      | ✅          |
| Dark mode         | ✅      | ✅          |
| Mobile responsive | ✅      | ✅          |

---

## Workflow Examples

### Example 1: Plan Your Week

1. Syllabus: Add topics (DSA → Trees, Sorting, etc.)
2. Planner: Click Monday → Add task "DSA: Trees"
3. Planner: Click Tuesday → Add task "DSA: Sorting"
4. Study and check off when done
5. Syllabus: See completion % increase

### Example 2: Manage Large Course

1. Syllabus: Add main units as topics
2. Syllabus: Expand each unit, add subtopics
3. Planner: Topics dropdown shows all (even nested)
4. Create tasks using any topic
5. Progress calculated across all topics

### Example 3: Track Exam Prep

1. Syllabus: Add all exam topics
2. Mark topics as you complete practice
3. Planner: Plan remaining topics before exam
4. Prioritize high-difficulty topics
5. Watch completion % approach 100%

---

## Error Handling

✅ **Covered**:

- Empty syllabus (shows message)
- Deleted topics (cached name still works)
- Missing selection (disabled button)
- localStorage issues (try-catch)
- First-time users (defaults)
- Works offline (100% client-side)

---

## Testing Checklist

- [ ] Add topic in Syllabus
- [ ] Add subtopic
- [ ] Go to Planner
- [ ] Check topic appears in dropdown
- [ ] Create task with that topic
- [ ] Mark task completed
- [ ] Go back to Syllabus
- [ ] See topic auto-marked completed
- [ ] Test dark mode
- [ ] Refresh page - data persists

---

## Documentation

| File                      | Purpose                      |
| ------------------------- | ---------------------------- |
| PLANNER_SYLLABUS_GUIDE.md | Complete user/dev guide      |
| API_REFERENCE.md          | Technical function reference |
| FEATURES_SUMMARY.md       | Feature overview             |
| This file                 | Quick cheat sheet            |

---

## Status

✅ **Complete** - Production Ready  
✅ **0 Breaking Changes** - Fully backward compatible  
✅ **Dark Mode** - Fully supported  
✅ **Mobile Responsive** - Works on all devices  
✅ **Error Handling** - Comprehensive  
✅ **Documented** - Multiple guides provided

---

## Common Questions

**Q: How do I add a topic to the planner?**  
A: Create it in Syllabus first, then it appears in Planner's topic dropdown.

**Q: Does completing a planner task update syllabus?**  
A: Yes, automatically! Just check the task checkbox.

**Q: Can I have subtopics?**  
A: Yes! In Syllabus, hover over a topic and click the + button.

**Q: Will my data disappear?**  
A: No, it's saved in localStorage. Persists across sessions.

**Q: Does this affect my marks?**  
A: No, completely separate features. Marks untouched.

---

## What's New

**3 Components**:

- StudyPlanner.jsx (calendar UI)
- PlannerDayModal.jsx (day details)
- SyllabusManager.jsx (topic manager)

**2 Utilities**:

- plannerStorage.js (task persistence)
- syllabusStorage.js (syllabus persistence)

**2 Tabs**:

- "Planner" (in navigation)
- "Syllabus" (in navigation)

**Integration**:

- Automatic task → topic completion sync

---

## Getting Started (3 Steps)

**Step 1**: Click "Syllabus" → Add your course topics

**Step 2**: Click "Planner" → Plan study sessions using those topics

**Step 3**: Study, complete tasks, watch progress update automatically!

---

**Ready to use!** 🚀
