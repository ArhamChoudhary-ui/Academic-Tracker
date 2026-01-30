# 🏗️ Project Architecture - Academic Tracker

## 📂 Complete File Structure

```
Marks app/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── .gitignore              # Git ignore rules
│   └── index.html              # HTML entry point
│
├── 📚 Documentation
│   ├── README.md               # Project overview and setup
│   ├── CALCULATIONS.md         # Detailed calculation explanations
│   ├── USER_GUIDE.md          # Complete usage guide
│   └── ARCHITECTURE.md        # This file - system architecture
│
└── 📁 src/
    ├── 🎨 Components
    │   ├── SubjectCard.jsx     # Individual subject card component
    │   ├── Dashboard.jsx       # Statistics and analytics dashboard
    │   └── Charts.jsx          # Visual charts component
    │
    ├── 🔧 Utils
    │   ├── calculations.js     # All mathematical functions
    │   ├── data.js            # Data models and constants
    │   └── storage.js         # Local storage utilities
    │
    ├── App.jsx                # Main application component
    ├── main.jsx              # React entry point
    └── index.css             # Global styles
```

---

## 🎯 Component Hierarchy

```
App (Root)
│
├── Header
│   ├── Title
│   ├── Export Button
│   ├── Settings Button
│   └── Theme Toggle
│
├── Navigation Tabs
│   ├── Subjects Tab
│   ├── Dashboard Tab
│   └── Charts Tab
│
├── Main Content Area
│   │
│   ├── [If Subjects Tab Active]
│   │   └── SubjectCard (×6)
│   │       ├── Card Header
│   │       ├── Assessment Inputs
│   │       ├── Statistics Display
│   │       ├── Prediction Section
│   │       └── Notes Area
│   │
│   ├── [If Dashboard Tab Active]
│   │   └── Dashboard
│   │       ├── Metric Cards (×6)
│   │       ├── Statistical Analysis
│   │       ├── FAT Predictions
│   │       └── Subject Breakdown Table
│   │
│   └── [If Charts Tab Active]
│       └── Charts
│           ├── Bar Chart (Total Marks)
│           ├── Stacked Bar Chart (Components)
│           ├── Line Chart (Trends)
│           └── Radar Chart (Overall)
│
├── Settings Modal (Conditional)
│   ├── Weights Configuration
│   ├── Danger Zone
│   └── Action Buttons
│
└── Footer
    └── Credits
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INPUT                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT STATE (App.jsx)                     │
│  • subjectsData: { [subject]: { marks, notes } }           │
│  • theme: 'light' | 'dark'                                  │
│  • weights: { cat1, cat2, quiz1, quiz2, quiz3 }           │
│  • activeTab: 'subjects' | 'dashboard' | 'charts'          │
└──────────┬────────────────────────────┬─────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐
│   LOCAL STORAGE      │    │  CALCULATIONS        │
│  • Save on change    │    │  • Mean, Median      │
│  • Load on mount     │    │  • Std Deviation     │
│  • Theme persist     │    │  • Predictions       │
│  • Weights persist   │    │  • GPA, Grades       │
└──────────────────────┘    └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │   COMPONENTS         │
                            │  • SubjectCard       │
                            │  • Dashboard         │
                            │  • Charts            │
                            └──────────────────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │   USER DISPLAY       │
                            │  • Updated UI        │
                            │  • Visual feedback   │
                            └──────────────────────┘
```

---

## 🧩 Component Details

### 1. App.jsx (Main Container)

**Responsibilities:**

- Global state management
- Route/tab management
- Theme control
- Settings modal
- Data persistence coordination

**State:**

```javascript
{
  subjectsData: {
    "Probability and Statistics": {
      marks: { cat1, cat2, quiz1, quiz2, quiz3, internals, fat, lab },
      notes: string
    },
    // ... other subjects
  },
  theme: 'light' | 'dark',
  activeTab: 'subjects' | 'dashboard' | 'charts',
  weights: { cat1, cat2, quiz1, quiz2, quiz3 }
}
```

**Key Functions:**

- `handleSubjectUpdate()` - Updates subject data
- `toggleTheme()` - Switches color theme
- `handleExport()` - Exports data to CSV
- `handleClearData()` - Resets all data
- `handleSaveWeights()` - Updates calculation weights

---

### 2. SubjectCard.jsx

**Purpose:** Display and edit marks for a single subject

**Props:**

```javascript
{
  subject: string,           // Subject name
  subjectData: {            // Current data
    marks: object,
    notes: string
  },
  onUpdate: function,       // Callback for updates
  weights: object           // Calculation weights
}
```

**Features:**

- Expandable/collapsible
- Real-time calculation
- Auto-save internals
- Prediction display
- Notes editor

**Local State:**

```javascript
{
  isExpanded: boolean,
  marks: object,
  notes: string,
  showPrediction: boolean
}
```

---

### 3. Dashboard.jsx

**Purpose:** Display statistics and analytics

**Props:**

```javascript
{
  subjectsData: object; // All subjects data
}
```

**Calculations:**

- Overall average
- GPA calculation
- Best/worst subjects
- Mean, median, mode
- Standard deviation
- FAT predictions per subject

**Sections:**

1. Metric cards (6)
2. Statistical analysis
3. Prediction cards
4. Subject breakdown table

---

### 4. Charts.jsx

**Purpose:** Visual data representation

**Props:**

```javascript
{
  subjectsData: object; // All subjects data
}
```

**Charts:**

1. **Bar Chart** - Total marks
   - Library: Recharts BarChart
   - Data: Subject → Total

2. **Stacked Bar Chart** - Components
   - Library: Recharts BarChart
   - Data: Subject → CAT1, CAT2, FAT, LAB

3. **Line Chart** - Trends
   - Library: Recharts LineChart
   - Data: Subject → CAT1, CAT2, FAT progression

4. **Radar Chart** - Overall performance
   - Library: Recharts RadarChart
   - Data: Subject → Total (360° view)

---

## 🔧 Utility Modules

### calculations.js

**Functions:**

```javascript
// Basic statistics
calculateMean(numbers)           → number
calculateMedian(numbers)         → number
calculateMode(numbers)           → number
calculateStdDev(numbers)         → number

// Weighted calculations
calculateWeightedMean(values, weights) → number
calculateInternals(marks, weights)     → number

// Subject calculations
calculateSubjectTotal(marks)         → number
calculateSubjectPercentage(marks)    → number

// Grading
getGrade(percentage)              → string
calculateGPA(percentage)          → number

// Predictions
predictFAT(marks)                → number
```

### data.js

**Exports:**

```javascript
SUBJECTS; // Array of subject names
ASSESSMENT_COMPONENTS; // Array of component definitions
DEFAULT_WEIGHTS; // Default weight configuration

createEmptyMarks(); // Returns empty marks object
createEmptySubjectData(); // Returns empty subject data
```

### storage.js

**Functions:**

```javascript
// Data persistence
saveToStorage(data)      → boolean
loadFromStorage()        → object | null

// Theme
saveTheme(theme)         → void
loadTheme()              → string

// Weights
saveWeights(weights)     → void
loadWeights()            → object | null

// Utilities
clearStorage()           → boolean
exportToCSV(data)        → void (downloads file)
```

---

## 🎨 Styling Architecture

### Tailwind CSS Classes

**Color Scheme:**

```css
Light Mode:
- Background: gray-50
- Cards: white
- Text: gray-900
- Borders: gray-200

Dark Mode:
- Background: gray-900
- Cards: gray-800
- Text: white
- Borders: gray-700
```

**Responsive Breakpoints:**

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
```

**Custom Gradients:**

```css
Primary: blue-500 → purple-600
Success: green-500 → emerald-600
Warning: yellow-500 → orange-600
Danger: red-500 → pink-600
```

---

## 💾 Data Models

### Subject Data Model

```typescript
interface SubjectData {
  marks: {
    cat1: number | null;
    cat2: number | null;
    quiz1: number | null;
    quiz2: number | null;
    quiz3: number | null;
    internals: number; // Auto-calculated
    fat: number | null;
    lab: number | null;
  };
  notes: string;
}
```

### Weights Model

```typescript
interface Weights {
  cat1: number; // 0.0 - 1.0
  cat2: number; // 0.0 - 1.0
  quiz1: number; // 0.0 - 1.0
  quiz2: number; // 0.0 - 1.0
  quiz3: number; // 0.0 - 1.0
}
```

### Storage Schema

```typescript
localStorage = {
  'academic_tracker_data': {
    [subject: string]: SubjectData
  },
  'academic_tracker_theme': 'light' | 'dark',
  'academic_tracker_weights': Weights
}
```

---

## 🔐 Security Considerations

### Data Privacy

- ✅ All data stored locally (no server)
- ✅ No network requests
- ✅ No authentication required
- ✅ No data collection
- ✅ No cookies or tracking

### Input Validation

```javascript
// Mark validation
0 <= mark <= 100

// Weight validation
0 <= weight <= 1
Σweights should be reasonable (typically 0.5-1.0)

// Null handling
All calculations handle null/undefined values
```

---

## ⚡ Performance Optimizations

### React Optimizations

1. **Conditional Rendering:** Components only render when needed
2. **Local State:** Card state isolated to prevent rerenders
3. **Effect Dependencies:** Careful useEffect dependency arrays
4. **Lazy Calculations:** Charts only calculate when tab active

### Storage Optimizations

1. **Debounced Saves:** Saves batched, not on every keystroke
2. **Compressed Data:** JSON stringification for storage
3. **Lazy Loading:** Data loaded once on mount

### Bundle Optimizations

1. **Code Splitting:** Vite automatic chunking
2. **Tree Shaking:** Unused code removed
3. **Minification:** Production builds minified
4. **Asset Optimization:** CSS purged of unused classes

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Data Entry:**

- [ ] Enter valid marks (0-100)
- [ ] Enter decimal marks
- [ ] Leave fields empty (null handling)
- [ ] Enter boundary values (0, 100)
- [ ] Test auto-calculation of internals

**Calculations:**

- [ ] Verify total calculation
- [ ] Check percentage accuracy
- [ ] Validate GPA assignment
- [ ] Test prediction algorithm
- [ ] Confirm statistics (mean, median, mode)

**UI/UX:**

- [ ] Theme toggle works
- [ ] Cards expand/collapse
- [ ] Tabs switch correctly
- [ ] Charts render properly
- [ ] Mobile responsive

**Data Persistence:**

- [ ] Data saves on update
- [ ] Data loads on refresh
- [ ] Theme persists
- [ ] Weights persist
- [ ] Clear data works

**Export:**

- [ ] CSV downloads correctly
- [ ] File format is valid
- [ ] All data included
- [ ] Date in filename

---

## 🚀 Deployment Options

### Option 1: Local Development

```bash
npm run dev
# Access at http://localhost:3000
```

### Option 2: Static Build

```bash
npm run build
# Deploy dist/ folder to any static host
```

### Option 3: Hosting Platforms

- **Vercel:** Connect GitHub, auto-deploy
- **Netlify:** Drag & drop dist folder
- **GitHub Pages:** Use gh-pages branch
- **Cloudflare Pages:** Connect repository

### Option 4: Self-Hosted

```bash
npm run build
npm run preview
# Or use any HTTP server for dist/
```

---

## 📈 Future Enhancement Ideas

### Phase 2 Features

- [ ] Multiple semesters
- [ ] Semester comparison
- [ ] Attendance tracking
- [ ] Assignment management
- [ ] Deadline reminders

### Phase 3 Features

- [ ] Mobile app (React Native)
- [ ] Cloud sync (optional)
- [ ] Collaboration (share with mentor)
- [ ] PDF export with charts
- [ ] AI-powered insights

### Phase 4 Features

- [ ] University-wide leaderboard
- [ ] Study group coordination
- [ ] Resource sharing
- [ ] Peer comparison (anonymous)
- [ ] Achievement badges

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for dependency updates
npm outdated

# Update dependencies
npm update
```

---

## 📦 Dependencies

### Production

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.10.3",
  "lucide-react": "^0.300.0"
}
```

### Development

```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.4.0",
  "vite": "^5.0.8"
}
```

---

## 🤝 Contributing Guidelines

### Code Style

- Use functional components
- Prefer hooks over class components
- Follow Airbnb JavaScript style guide
- Use meaningful variable names
- Comment complex logic

### Component Guidelines

- One component per file
- Props validation (optional: PropTypes)
- Clear component responsibilities
- Reusable where possible

### Git Workflow

```bash
# Feature branch
git checkout -b feature/your-feature

# Commit with clear message
git commit -m "Add: Feature description"

# Push and create PR
git push origin feature/your-feature
```

---

## 📞 Support & Contact

**Issues:** Report on GitHub
**Features:** Submit feature request
**Questions:** Check documentation first
**Contributions:** PRs welcome!

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Author:** Academic Tracker Team
