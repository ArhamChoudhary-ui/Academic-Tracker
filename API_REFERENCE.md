# API Reference - Planner & Syllabus

## plannerStorage.js

### Core Functions

#### `savePlannerData(data: Object) → boolean`

Saves planner data to localStorage.

```javascript
const data = { "2026-02-15": [task1, task2] };
savePlannerData(data);
```

#### `loadPlannerData() → Object`

Loads all planner data from localStorage.

```javascript
const allTasks = loadPlannerData();
// Returns: { "2026-02-15": [...], "2026-02-16": [...] }
```

#### `clearPlannerData() → boolean`

Clears all planner data.

```javascript
clearPlannerData();
```

### Task Management

#### `addPlannerTask(dateKey: string, task: Object) → Object|null`

Adds a new task to a specific date.

```javascript
const task = {
  subject: "DSA",
  topicId: "uuid-123",
  topicName: "Trees",
  estimatedMinutes: 120,
  priority: "high",
  completed: false,
};
const newTask = addPlannerTask("2026-02-15", task);
// Returns: task with auto-generated id
```

#### `updatePlannerTask(dateKey: string, taskId: string, updates: Object) → Object|null`

Updates an existing task.

```javascript
updatePlannerTask("2026-02-15", "task-id-123", { completed: true });
```

#### `deletePlannerTask(dateKey: string, taskId: string) → boolean`

Deletes a task.

```javascript
deletePlannerTask("2026-02-15", "task-id-123");
```

### Querying

#### `getPlannerTasksForDate(dateKey: string) → Array`

Gets all tasks for a specific date.

```javascript
const tasks = getPlannerTasksForDate("2026-02-15");
```

#### `getAllPlannerTasks() → Object`

Gets all tasks across all dates.

```javascript
const allTasks = getAllPlannerTasks();
```

#### `getUpcomingTasks(daysAhead: number = 7) → Array`

Gets upcoming tasks.

```javascript
const upcoming = getUpcomingTasks(7); // Next 7 days
// Returns: [{ date, tasks: [...] }, ...]
```

#### `getTasksBySubject(subject: string) → Array`

Gets all tasks for a specific subject.

```javascript
const dSATasks = getTasksBySubject("DSA");
// Returns: [{ ...task, dateKey }, ...]
```

---

## syllabusStorage.js

### Initialization

#### `createDefaultSyllabus(subjects: Array) → Object`

Creates empty syllabus structure.

```javascript
const empty = createDefaultSyllabus(SUBJECTS);
// Returns: { "DSA": [], "OOPS": [], ... }
```

### Core Functions

#### `saveSyllabusData(data: Object) → boolean`

Saves syllabus data to localStorage.

```javascript
saveSyllabusData(syllabusObject);
```

#### `loadSyllabusData(subjects: Array) → Object`

Loads syllabus, ensuring all subjects exist.

```javascript
const data = loadSyllabusData(SUBJECTS);
```

#### `clearSyllabusData() → boolean`

Clears all syllabus data.

```javascript
clearSyllabusData();
```

### Topic Management

#### `addTopic(subject: string, topic: Object, parentId?: string) → Object|null`

Adds a topic to a subject (optionally nested).

```javascript
// Top-level topic
addTopic("DSA", {
  name: "Trees",
  difficulty: "medium",
  notes: "Important data structure",
});

// Nested under parent
addTopic(
  "DSA",
  {
    name: "Traversals",
    difficulty: "easy",
  },
  "parent-uuid",
);
```

#### `updateTopic(subject: string, topicId: string, updates: Object) → Object|null`

Updates a topic.

```javascript
updateTopic("DSA", "uuid-123", {
  name: "Binary Trees",
  completed: true,
  notes: "Learned AVL trees",
});
```

#### `deleteTopic(subject: string, topicId: string) → boolean`

Deletes a topic (including nested).

```javascript
deleteTopic("DSA", "uuid-123");
```

#### `markTopicCompleted(subject: string, topicId: string, completed: boolean = true) → Object|null`

Marks/unmarks topic as completed.

```javascript
markTopicCompleted("DSA", "uuid-123", true);
```

### Querying

#### `getSyllabusForSubject(subject: string, subjects: Array) → Array`

Gets all topics for a subject.

```javascript
const topics = getSyllabusForSubject("DSA", SUBJECTS);
```

#### `getAllSyllabusData(subjects: Array) → Object`

Gets all topics for all subjects.

```javascript
const allData = getAllSyllabusData(SUBJECTS);
```

#### `getTopicById(subject: string, topicId: string, subjects: Array) → Object|null`

Finds a specific topic.

```javascript
const topic = getTopicById("DSA", "uuid-123", SUBJECTS);
```

#### `getAllTopicsFlattened(subject: string, subjects: Array) → Array`

Gets all topics including nested ones as flat list.

```javascript
const allFlat = getAllTopicsFlattened("DSA", SUBJECTS);
// Useful for dropdowns in planner
```

### Progress & Utilities

#### `getSubjectProgress(subject: string, subjects: Array) → Object`

Calculates progress for a subject.

```javascript
const progress = getSubjectProgress("DSA", SUBJECTS);
// Returns: { total: 15, completed: 8, percentage: 53 }
```

#### `getOverallProgress(subjects: Array) → Object`

Calculates progress across all subjects.

```javascript
const overall = getOverallProgress(SUBJECTS);
// Returns: { total: 100, completed: 45, percentage: 45 }
```

#### `findTopic(topics: Array, topicId: string) → Object|null`

Internal: Searches nested topics.

```javascript
const found = findTopic(syllabus, "uuid-123");
```

---

## Data Structures

### Planner Task Object

```javascript
{
  id: "2026-02-15-1708060800000",  // Auto-generated
  subject: "DSA",                   // From SUBJECTS
  topicId: "uuid-456",              // From syllabus topic
  topicName: "Tree Traversals",     // Cached for display
  estimatedMinutes: 120,            // 1-480 range
  priority: "high",                 // "low" | "medium" | "high"
  completed: false                  // Boolean
}
```

### Syllabus Topic Object

```javascript
{
  id: "uuid-123",                   // Auto-generated on create
  name: "Trees",                    // Topic name
  completed: false,                 // Boolean
  difficulty: "medium",             // "easy" | "medium" | "hard"
  notes: "Optional notes",          // String
  children: [                       // Nested topics (optional)
    {
      id: "uuid-456",
      name: "Traversals",
      completed: false,
      difficulty: "easy",
      notes: "",
      children: []
    }
  ]
}
```

### Progress Object

```javascript
{
  total: 20,                        // Total topics
  completed: 12,                    // Completed count
  percentage: 60                    // Percentage complete
}
```

---

## Integration Examples

### Example 1: Add Syllabus and Plan Study Session

```javascript
import { addTopic, getAllTopicsFlattened } from "../utils/syllabusStorage";
import { addPlannerTask } from "../utils/plannerStorage";

// Step 1: Add syllabus topic
addTopic("DSA", {
  name: "Trees",
  difficulty: "medium",
});

// Step 2: Plan a study session for that topic
const topics = getAllTopicsFlattened("DSA", SUBJECTS);
const treeTopic = topics.find((t) => t.name === "Trees");

addPlannerTask("2026-02-15", {
  subject: "DSA",
  topicId: treeTopic.id,
  topicName: treeTopic.name,
  estimatedMinutes: 120,
  priority: "high",
  completed: false,
});
```

### Example 2: Complete Task and Sync Syllabus

```javascript
import { updatePlannerTask } from "../utils/plannerStorage";
import { markTopicCompleted } from "../utils/syllabusStorage";

function handleTaskComplete(dateKey, taskId, topicId, subject) {
  // Update planner task
  updatePlannerTask(dateKey, taskId, { completed: true });

  // Auto-sync: Mark syllabus topic complete
  markTopicCompleted(subject, topicId, true);
}
```

### Example 3: Get Progress Statistics

```javascript
import {
  getOverallProgress,
  getSubjectProgress,
} from "../utils/syllabusStorage";
import { getTasksBySubject } from "../utils/plannerStorage";

function showDashboard() {
  // Overall progress
  const overall = getOverallProgress(SUBJECTS);
  console.log(`Overall: ${overall.percentage}% complete`);

  // Per-subject progress
  SUBJECTS.forEach((subject) => {
    const progress = getSubjectProgress(subject, SUBJECTS);
    const tasks = getTasksBySubject(subject);
    console.log(
      `${subject}: ${progress.percentage}% complete, ${tasks.length} planned`,
    );
  });
}
```

### Example 4: Nested Syllabus Structure

```javascript
import { addTopic } from "../utils/syllabusStorage";

// Create parent topic
const parentResult = addTopic("DSA", {
  name: "Trees",
  difficulty: "medium",
});

const parentId = parentResult.id;

// Add subtopic
addTopic(
  "DSA",
  {
    name: "Binary Trees",
    difficulty: "medium",
  },
  parentId,
);

addTopic(
  "DSA",
  {
    name: "BST Operations",
    difficulty: "hard",
  },
  parentId,
);
```

---

## Common Patterns

### Pattern 1: Populate Topic Dropdown

```javascript
const topics = getAllTopicsFlattened(selectedSubject, SUBJECTS);
return (
  <select>
    {topics.map((topic) => (
      <option key={topic.id} value={topic.id}>
        {topic.name}
      </option>
    ))}
  </select>
);
```

### Pattern 2: Track Completion

```javascript
function updateTaskCompletion(dateKey, taskId, task) {
  const newState = !task.completed;

  updatePlannerTask(dateKey, taskId, { completed: newState });

  if (newState) {
    markTopicCompleted(task.subject, task.topicId, true);
  }
}
```

### Pattern 3: Calculate Total Study Time

```javascript
function getTotalEstimatedTime(dateKey) {
  const tasks = getPlannerTasksForDate(dateKey);
  return tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
}
```

### Pattern 4: Find Incomplete High-Priority Tasks

```javascript
function getHighPriorityTodos(subject) {
  const tasks = getTasksBySubject(subject);
  return tasks.filter((task) => !task.completed && task.priority === "high");
}
```

### Pattern 5: Sync Topics to Planner

```javascript
function setupPlannerWithSyllabus(dateKey, subject) {
  const topics = getAllTopicsFlattened(subject, SUBJECTS);

  topics.forEach((topic) => {
    if (!topic.completed) {
      addPlannerTask(dateKey, {
        subject,
        topicId: topic.id,
        topicName: topic.name,
        estimatedMinutes: 60,
        priority: "medium",
        completed: false,
      });
    }
  });
}
```

---

## Error Handling

### Always Check Returns

```javascript
const newTopic = addTopic("DSA", { name: "Trees" });
if (newTopic) {
  console.log("Topic created:", newTopic.id);
} else {
  console.error("Failed to create topic");
}
```

### Validate Before Use

```javascript
const topics = getAllTopicsFlattened("DSA", SUBJECTS);
if (topics.length === 0) {
  alert("Add topics to syllabus first!");
  return;
}
```

### Handle Missing Data

```javascript
const task = getPlannerTasksForDate("2026-02-15")[0];
if (!task) {
  console.log("No tasks for this date");
  return;
}
```

---

## Performance Notes

- **Flat List**: `getAllTopicsFlattened()` recalculates every call (but data sizes are small)
- **Recursive Search**: `findTopic()` traverses nested structure (O(n) worst case)
- **Progress Calc**: Counts all topics recursively on every call
- **For Large Data**: Consider caching, but not needed for typical course syllabus (50-200 topics)

---

## localStorage Keys Reference

| Key                               | Managed By         | Purpose                  |
| --------------------------------- | ------------------ | ------------------------ |
| `academic_tracker_data`           | storage.js         | Marks & scores           |
| `academic_tracker_timer_sessions` | timerStorage.js    | Study timer sessions     |
| `academic_tracker_planner_data`   | plannerStorage.js  | **NEW**: Day-wise tasks  |
| `academic_tracker_syllabus_data`  | syllabusStorage.js | **NEW**: Syllabus topics |
| `academic_tracker_theme`          | storage.js         | Dark/light mode          |
| `academic_tracker_weights`        | storage.js         | Assessment weights       |

All keys are independent - clearing one doesn't affect others.
