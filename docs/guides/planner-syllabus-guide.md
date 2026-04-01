# Study Planner & Syllabus Manager - Integration Guide

## Overview

Two new features have been added to your academic tracker:

1. **Study Planner** - Plan study sessions day-by-day with task management
2. **Syllabus Manager** - Define and track syllabus topics with hierarchical structure

These features are tightly integrated and work seamlessly with your existing app.

---

## Feature 1: Study Planner

### Purpose

Plan what you will study on specific dates. View planned tasks, track completion, and estimate study time.

### Location

- **Tab**: "Planner" (in main navigation)
- **Component**: `src/components/StudyPlanner.jsx`
- **Modal**: `src/components/PlannerDayModal.jsx`

### Key Functionality

#### Monthly Calendar View

- Calendar grid showing all days in month
- Navigate between months with Previous/Next buttons
- Visual indicators:
  - **Blue border** = Today's date
  - **Progress bar** = Completion status (completed/total tasks)
  - Displays task count for each day

#### Day Details Modal

Click any date to open modal showing:

- All planned tasks for that day
- Task completion status with checkboxes
- Subject, topic name, estimated time, priority
- Delete task button
- Add new task form

#### Task Properties

```javascript
{
  id: "unique-id",
  subject: "DSA",           // From existing SUBJECTS
  topicId: "topic-uuid",    // From syllabus topics
  topicName: "Trees",       // Cached topic name
  estimatedMinutes: 120,    // User-set time
  priority: "high",         // low | medium | high
  completed: false
}
```

#### Add Task Form

- **Subject Selector** - Choose from existing subjects
- **Topic Selector** - Populated from syllabus topics for selected subject
- **Time Estimate** - Minutes (1-480 range)
- **Priority** - Low/Medium/High for visual organization
- Validation: Topic selection required

### Data Storage

- **Key**: `"academic_tracker_planner_data"`
- **Structure**: `{ "YYYY-MM-DD": [tasks...] }`
- **Persistence**: localStorage (survives reloads)
- **Separate Storage**: Doesn't interfere with marks/timer data

### Key Integration Point: Planner → Syllabus Sync

When a planned task is marked **completed**:

```
Task checkbox clicked
    ↓
updatePlannerTask() marks task.completed = true
    ↓
markTopicCompleted(subject, topicId, true) AUTOMATICALLY triggered
    ↓
Corresponding syllabus topic also marked as completed
```

This ensures:

- No duplicate topic tracking
- Planner-completion syncs to syllabus automatically
- Single source of truth for completion status

---

## Feature 2: Syllabus Manager

### Purpose

Define course syllabus with nested topics. Track completion percentage per subject and overall.

### Location

- **Tab**: "Syllabus" (in main navigation)
- **Component**: `src/components/SyllabusManager.jsx`

### Key Functionality

#### Subject Selection

- Quick-select buttons for all subjects
- Progress bar for selected subject

#### Progress Metrics

Displayed in cards:

- **Overall Progress** - % of all topics completed across all subjects
- **Subject Progress** - % of topics completed for selected subject
- **Visual Bar** - Real-time progress indicator

#### Topic Structure

Topics can be nested hierarchically:

```javascript
{
  id: "uuid",
  name: "Trees",
  completed: false,
  difficulty: "medium",    // easy | medium | hard
  notes: "",
  children: [              // Optional nested topics
    {
      id: "uuid",
      name: "Tree Traversals",
      completed: false,
      difficulty: "easy",
      children: []
    }
  ]
}
```

#### Topic Management

- **Expand/Collapse** - View nested subtopics
- **Complete Checkbox** - Mark topics complete (updates syllabus)
- **Edit** - Rename topic inline
- **Delete** - Remove topic from syllabus
- **Add Subtopic** - Create nested topic under any parent

#### Difficulty Badges

Visual indicators for topic difficulty:

- **Easy** - Green badge
- **Medium** - Yellow badge
- **Hard** - Red badge

### Data Storage

- **Key**: `"academic_tracker_syllabus_data"`
- **Structure**: `{ "Subject": [topics...] }`
- **Persistence**: localStorage
- **Separate Storage**: Doesn't affect marks data

### Progress Calculations

```
countCompletedTopics(topics)
  ↓
Recursively counts all completed topics
Including nested children
  ↓
Returns { total, completed }
  ↓
getSubjectProgress(subject)
  ↓
percentage = (completed / total) * 100
```

---

## Planner ↔ Syllabus Integration

### Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│      STUDY PLANNER (User Plans Tasks)       │
└──────────────────┬──────────────────────────┘
                   │
                   │ User selects topic from dropdown
                   ↓
┌─────────────────────────────────────────────┐
│   SYLLABUS MANAGER (Topic Source)           │
│   getAllTopicsFlattened(subject)            │
│   Returns: [all topics + subtopics]         │
└──────────────────┬──────────────────────────┘
                   │
                   │ Task created with topicId
                   ↓
┌─────────────────────────────────────────────┐
│   PLANNER STORAGE                           │
│   { "2026-02-15": [{task with topicId}] }  │
└──────────────────┬──────────────────────────┘
                   │
          User completes task
                   │
                   ↓
┌─────────────────────────────────────────────┐
│   updatePlannerTask(completed=true)         │
└──────────────────┬──────────────────────────┘
                   │
                   │ Trigger: handleToggleCompleted()
                   ↓
┌─────────────────────────────────────────────┐
│   markTopicCompleted(subject, topicId)      │
│   (AUTOMATIC - no user action needed)       │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│   SYLLABUS STORAGE                          │
│   Topic marked as completed                 │
│   Progress % updates automatically          │
└─────────────────────────────────────────────┘
```

### Key Properties

**Planner Task**:

```javascript
{
  subject: "DSA",
  topicId: "trees-traversal",  // ← Links to syllabus
  topicName: "Tree Traversals",
  completed: false
}
```

**Syllabus Topic**:

```javascript
{
  id: "trees-traversal",       // ← Referenced by planner
  name: "Tree Traversals",
  completed: false
}
```

### Behavior

1. **Creating a Task**: Topic MUST exist in syllabus first
   - Topic dropdown populated from syllabus topics
   - If syllabus empty → warning message shown

2. **Completing a Task**: Automatic syllabus sync
   - User checks task in planner
   - `markTopicCompleted(subject, topicId, true)` fires automatically
   - Syllabus topic progress updates
   - Completion % recalculates

3. **Adding Subtopic**: Affects planner options
   - New subtopic appears in planner topic dropdown
   - Can immediately be used in planned tasks

4. **Deleting a Topic**: Warning in planner
   - If user deletes topic from syllabus
   - Existing tasks still show cached topicName
   - New tasks can't select deleted topic

---

## Storage Architecture

### Separate Storage Keys

Four independent localStorage keys:

```javascript
"academic_tracker_data"; // Marks data (existing)
"academic_tracker_timer_sessions"; // Timer sessions (existing)
"academic_tracker_planner_data"; // New: Day-wise tasks
"academic_tracker_syllabus_data"; // New: Topics per subject
```

**Why Separate?**

- No breaking changes to existing marks system
- Clean data isolation
- Easy to clear one feature without affecting others
- Each feature has independent lifecycle

### Data Format

**Planner Data**:

```json
{
  "2026-02-15": [
    {
      "id": "2026-02-15-1708060800000",
      "subject": "DSA",
      "topicId": "uuid-123",
      "topicName": "Trees",
      "estimatedMinutes": 120,
      "priority": "high",
      "completed": false
    }
  ]
}
```

**Syllabus Data**:

```json
{
  "DSA": [
    {
      "id": "uuid-123",
      "name": "Trees",
      "completed": false,
      "difficulty": "medium",
      "notes": "",
      "children": [
        {
          "id": "uuid-456",
          "name": "Traversals",
          "completed": false,
          "difficulty": "easy",
          "notes": "",
          "children": []
        }
      ]
    }
  ]
}
```

---

## Storage Utilities

### plannerStorage.js

```javascript
savePlannerData(data); // Save full planner object
loadPlannerData(); // Load all tasks
clearPlannerData(); // Wipe all tasks
addPlannerTask(dateKey, task); // Add single task
updatePlannerTask(dateKey, taskId, updates); // Update task
deletePlannerTask(dateKey, taskId); // Remove task
getPlannerTasksForDate(dateKey); // Get tasks for specific date
getAllPlannerTasks(); // Get all tasks
getUpcomingTasks(daysAhead); // Get next N days of tasks
getTasksBySubject(subject); // Get all tasks for subject
```

### syllabusStorage.js

```javascript
saveSyllabusData(data); // Save full syllabus
loadSyllabusData(subjects); // Load with defaults
clearSyllabusData(); // Wipe all topics
addTopic(subject, topic, parentId); // Add topic
updateTopic(subject, topicId, updates); // Update topic
deleteTopic(subject, topicId); // Delete topic
getSyllabusForSubject(subject, subjects); // Get subject topics
getSubjectProgress(subject, subjects); // Get % complete
getOverallProgress(subjects); // Get all-subjects %
markTopicCompleted(subject, topicId); // Mark complete
getTopicById(subject, topicId, subjects); // Find topic
getAllTopicsFlattened(subject, subjects); // Get nested flat list
```

---

## User Workflows

### Workflow 1: Create Study Plan for Week

1. Go to **Syllabus** tab
2. Add topics you want to cover:
   - "DSA" → "Trees" → "Traversals"
   - Set difficulty levels
3. Go to **Planner** tab
4. Click each day you want to study
5. Add tasks:
   - Select subject (DSA)
   - Select topic (Trees → Traversals)
   - Set time (120 min)
   - Set priority (High)
6. Click "Add Task"
7. Repeat for other days/subjects

### Workflow 2: Track Study Progress

1. Complete a study session on planned day
2. Go to **Planner** tab → click date
3. Check the task ✓
4. Notice:
   - Task shows as completed (strikethrough)
   - Progress bar updates
   - Go to **Syllabus** tab
   - Same topic is now marked complete there too!
5. See overall progress % increase

### Workflow 3: Manage Syllabus

1. Go to **Syllabus** tab
2. Select subject
3. Add topics:
   - Click "Add Topic"
   - Type name, select difficulty
4. Expand topic to add subtopics
5. Track completion as you study
6. See progress % update in real-time

### Workflow 4: Prepare for Exams

1. In **Syllabus**: Add all topics from course
2. Check off completed topics as you study
3. In **Planner**: Plan remaining topics for days before exam
4. See which high-priority topics are still pending

---

## Error Handling & Edge Cases

### Empty Syllabus

- If no topics exist, planner shows warning
- "No topics available. Add topics in Syllabus Manager first."
- User directed to create topics first

### Missing Topic

- If topic deleted from syllabus but task exists
- Task still shows cached topic name
- Can't create new tasks with deleted topic
- Old tasks remain functional

### Nested Topics

- Planner shows ALL topics (including nested)
- Flat list in dropdown for easy selection
- Progress counts nested topics automatically

### First-Time User

- Both features start empty
- Defaults provided (empty arrays per subject)
- Clear instructions in UI

### Data Persistence

- All data saved to localStorage automatically
- Survives browser refresh
- Works offline (100% client-side)
- No network needed

---

## Styling & Theming

### Dark Mode

- Full dark mode support
- Uses same theme system as existing app
- All colors have dark: variants
- Consistent with marks/timer/calendar UI

### Responsive Design

- Mobile-first approach
- Calendar grid adapts to screen size
- Modal centered with overflow scroll
- Touch-friendly button sizes

### Visual Hierarchy

- Cards with gradients for key metrics
- Color-coded priorities (red/yellow/green)
- Progress bars for quick visual feedback
- Hover effects for interactivity hints

---

## Integration Checklist

✅ **Completed**:

- [x] Storage utilities created (separate from marks)
- [x] Syllabus Manager component built
- [x] Study Planner component built
- [x] Planner Day Modal built
- [x] Planner → Syllabus sync implemented
- [x] Two tabs added to App.jsx navigation
- [x] Dark mode support
- [x] Error checking passed
- [x] No breaking changes to existing features

✅ **Ready to Use**:

- New "Planner" tab
- New "Syllabus" tab
- Full UI with all interactions
- Automatic data sync
- localStorage persistence

---

## File Structure

```
src/
├── components/
│   ├── StudyPlanner.jsx          (NEW - Main planner UI)
│   ├── PlannerDayModal.jsx       (NEW - Day detail modal)
│   ├── SyllabusManager.jsx       (NEW - Topic management)
│   ├── StudyCalendar.jsx         (existing)
│   ├── StudyTimer.jsx            (existing)
│   └── ... (other existing components)
├── utils/
│   ├── plannerStorage.js         (NEW - Task storage logic)
│   ├── syllabusStorage.js        (NEW - Syllabus storage logic)
│   ├── timerStorage.js           (existing)
│   └── ... (other utilities)
└── App.jsx                        (MODIFIED - Added imports & tabs)
```

---

## Testing Checklist

- [ ] Create syllabus topics in Syllabus Manager
- [ ] Add nested subtopics
- [ ] See progress % update
- [ ] Go to Planner and add task for a date
- [ ] Verify topic dropdown shows all topics
- [ ] Complete a task
- [ ] Check that syllabus topic auto-marked complete
- [ ] Test month navigation in planner
- [ ] Test dark mode
- [ ] Refresh page - data should persist
- [ ] Delete topic from syllabus - task still shows
- [ ] Mark topic complete from syllabus
- [ ] See planner task available to complete separately
