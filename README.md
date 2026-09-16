# Academic Tracker

A client-side academic tracking dashboard and credit-weighted grade calculator built for university students, tailored to the VIT 10-point grading system. Tracks continuous assessments, computes weighted internal marks, calculates semester GPA and cumulative CGPA, visualizes performance metrics, and logs study sessions with zero server requirements.

Everything runs entirely in the browser — no database setup, no account sign-up, and no data leaves your machine unless you configure optional end-to-end encrypted cloud sync.

---

## Features

### 1. Subject & Assessment Tracking
- **Course Dashboard**: Track CAT-1, CAT-2, FAT, Lab, and continuous internal assessment marks per subject.
- **Customizable Internal Structure**: Configure internal components directly inside each subject card without popups. Choose from standard presets or define custom tasks:
  - Three Quizzes (10 + 10 + 10 = 30) [Default]
  - Case Study + Quiz (20 + 10 = 30)
  - Term Project (30)
  - Dual Assignments (15 + 15 = 30)
- **Automatic Mark Scaling**: Raw assessment marks are dynamically scaled to standard university weightages (15% CAT-1, 15% CAT-2, 30% Internals, 40% FAT, with lab course adjustments).
- **Class Average & Predictive Benchmarks**: Compare individual scores against class averages and view projected FAT requirements based on past performance trends.

### 2. VIT Academic Calculator
- **Instant GPA Calculator**:
  - Enter course names, credit values (including decimal credits like 1.5, 3.5), and letter grades.
  - Real-time credit-weighted calculation using the VIT 10-point scale (S = 10, A = 9, B = 8, C = 7, D = 6, E = 5, F = 0).
  - Prominently displays semester GPA, total registered credits, total grade points, and course count.
- **Cumulative CGPA Calculator**:
  - Enter semester GPA and credit loads across semesters.
  - Pre-populated with 8 semesters; dynamically add or remove semesters as needed.
  - Uses strictly credit-weighted calculation rather than an unweighted average:
    $$\text{CGPA} = \frac{\sum(\text{Semester GPA} \times \text{Semester Credits})}{\sum(\text{Semester Credits})}$$

### 3. Analytics & Export
- **Visual Performance Charts**: Multi-dimensional charts (bar, line, and category breakdown) powered by Recharts.
- **Consolidated Academic Report**: View overall consistency metrics, unscaled vs. scaled mark distributions, and download clean CSV backups.
- **Goal Calculator**: Reverse-engineers required FAT or final exam scores to achieve a target overall course percentage.

### 4. Study Planner & Focus Timer
- **Pomodoro Focus Timer**: Integrated work-interval timer with customizable durations, completion sound notifications, session logging, and daily study streak tracking.
- **Study Planner**: Weekly and daily schedule calendar for managing syllabus milestones, assignments, and exam dates.

### 5. Syllabus Document Hub
- **Document Management**: Upload and view course syllabi client-side using `pdf.js`.
- **Sanitized Document Titles**: Strips internal raw extensions, timestamps, and cache hashes, presenting clean document labels.
- **Practice Question Generator & Notes Builder**: Generates structured revision notes, key definition lists, and exam practice questions locally from uploaded syllabus text without external API calls.

### 6. Break Mode
- Built-in arcade Tetris mini-game accessible from the top navigation bar for study breaks.

---

## VIT Grade Scale Reference

| Grade | Grade Points | Performance Level |
| :---: | :---: | :--- |
| **S** | 10 | Outstanding |
| **A** | 9 | Excellent |
| **B** | 8 | Very Good |
| **C** | 7 | Good |
| **D** | 6 | Fair |
| **E** | 5 | Pass |
| **F** | 0 | Fail |

*Note: Non-performance designations (W, U, P, Y) do not carry grade points and are excluded from GPA/CGPA credit-weighted calculations.*

---

## Technical Stack

| Category | Technologies |
|---|---|
| **Frontend Framework** | React 18 (Vite 5) |
| **Styling & UI** | Tailwind CSS 3, Lucide React Icons |
| **Data Visualization** | Recharts |
| **PDF Processing** | PDF.js (v3) |
| **Testing** | Vitest, @testing-library/react |
| **State & Storage** | LocalStorage, IndexedDB, optional Web Crypto E2E cloud sync |

---

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

```bash
# Clone repository
git clone https://github.com/ArhamChoudhary-ui/Academic-Tracker.git
cd Academic-Tracker

# Install dependencies (use legacy-peer-deps for React 18 peer compatibility)
npm install --legacy-peer-deps

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and minifies production assets to `/dist`.
- `npm run preview`: Locally previews the production build output.
- `npm test`: Runs the Vitest test suite.
- `npm run test:watch`: Runs tests in interactive watch mode during development.

---

## Project Structure

```
Academic-Tracker/
├── src/
│   ├── components/
│   │   ├── academicCalculator/     # CGPA, Instant GPA, and grading rule sections
│   │   ├── credit/                 # Credit breakdown cards and stats
│   │   ├── shared/                 # Reusable UI primitives (DropZones, Banners)
│   │   ├── timer/                  # Study timer modals and history
│   │   ├── AcademicCalculator.jsx  # Main academic calculator tab
│   │   ├── Charts.jsx              # Recharts performance visualization
│   │   ├── GoalCalculator.jsx      # Target grade reverse calculation
│   │   ├── SubjectCard.jsx         # Assessment inputs & inline internal configuration
│   │   ├── SubjectPlanner.jsx      # Planner & study timer view
│   │   ├── SyllabusPdfHub.jsx      # Syllabus reader & practice questions
│   │   └── TetrisGame.jsx          # Break mode mini-game
│   ├── hooks/                      # Custom hooks (PDF extractor, responsive sizing)
│   ├── tests/                      # Vitest unit test suites
│   ├── utils/                      # Core business logic (calculations, storage, sanitizers)
│   ├── App.jsx                     # Root application container & tab routing
│   └── main.jsx                    # React entry point
├── .github/workflows/ci.yml        # GitHub Actions continuous integration pipeline
├── index.html                      # HTML root template
├── tailwind.config.js              # Tailwind styling configuration
└── vite.config.js                  # Vite bundler configuration
```

---

## Privacy & Data Persistence

- All calculations, document parsing, and study timers operate 100% client-side in your browser.
- No analytics trackers, advertisements, or third-party tracking scripts are included.
- Core data is stored in browser `localStorage`. Clearing browser site data will reset the application.
- An optional end-to-end encrypted cloud sync feature allows multi-device synchronization using AES-GCM client-side encryption keys that never leave your device.

---

## License

Open source under the [MIT License](LICENSE), intended for personal and educational use.
