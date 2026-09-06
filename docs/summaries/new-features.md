# New Features - Subject Planner & Syllabus PDF Hub

## 1. Subject Planner (Calendar-Based)

A simple, visual calendar interface for planning your study subjects by date.

### Features:

- **Monthly Calendar View**: Navigate between months to plan ahead
- **Color-Coded Planning**: Assign colors to your study plans for visual organization
- **Multiple Plans Per Date**: Add multiple subjects/topics for each day
- **Quick Overview**: See at a glance which dates have study plans

### How to Use:

1. Navigate to the **Planner** tab
2. Click on any date in the calendar
3. Add a study plan with:
   - **Subject**: Choose from predefined subjects or add "Other"
   - **Note/Topic**: Add specific topics or notes (optional)
   - **Color**: Pick a color for visual organization (Blue, Green, Purple, Red, Yellow, Orange)
4. Click "Add Plan" to save
5. View all plans for the date in the modal
6. Delete plans using the trash icon

### Colors Available:

- **Blue** - For general subjects
- **Green** - For topics you're confident about
- **Purple** - For advanced topics
- **Red** - For urgent/important topics
- **Yellow** - For review sessions
- **Orange** - For practice/assignments

### Data Storage:

- All data is stored locally in your browser's localStorage
- Storage key: `academic_tracker_subject_planner`
- Data persists across sessions
- No backend required - completely offline

---

## 2. Syllabus PDF Hub

Upload, store, and access your syllabus PDFs for each subject - all stored locally in your browser.

### Features:

- **PDF Upload**: Upload syllabus PDFs for each subject (max 10MB per file)
- **View PDFs**: Open PDFs in a new tab directly from the app
- **Download PDFs**: Download stored PDFs to your device
- **Replace/Delete**: Update or remove PDFs as needed
- **Storage Tracking**: Monitor how much browser storage you're using

### How to Use:

1. Navigate to the **Syllabus** tab
2. Find the subject card you want to upload a syllabus for
3. Click the upload area or "Upload PDF" button
4. Select a PDF file (max 10MB)
5. Once uploaded, you can:
   - **View**: Open the PDF in a new browser tab
   - **Download**: Save the PDF to your device
   - **Delete**: Remove the PDF
   - **Replace**: Upload a new PDF for the same subject

### Supported Subjects:

- DSA (Data Structures & Algorithms)
- DBMS (Database Management Systems)
- OS (Operating Systems)
- CN (Computer Networks)
- Mathematics
- OOP (Object-Oriented Programming)
- Web Development
- Other

### Technical Details:

- PDFs are converted to Base64 and stored in localStorage
- Maximum file size: 10MB per PDF
- Storage limit: Browser's localStorage limit (typically 5-10MB total)
- File metadata stored: fileName, fileSize, uploadDate

### Storage Warning:

⚠️ **Important**: PDFs are stored in your browser's local storage. While convenient for offline access, please note:

- Large files may affect browser performance
- Storage space is limited (typically 5-10MB total across all data)
- Clearing browser data will delete all PDFs
- It's recommended to keep backup copies of important syllabi

---

## Storage Utilities

### Subject Planner Storage (`subjectPlannerStorage.js`)

Functions available:

- `loadPlannerData()` - Load all planner data
- `savePlannerData(data)` - Save all planner data
- `clearPlannerData()` - Clear all planner data
- `addPlanToDate(dateKey, plan)` - Add a plan to a specific date
- `removePlanFromDate(dateKey, planId)` - Remove a plan from a date
- `getPlansForDate(dateKey)` - Get all plans for a specific date
- `updatePlan(dateKey, planId, updates)` - Update an existing plan
- `getAllDatesWithPlans()` - Get all dates that have plans

### Syllabus PDF Storage (`syllabusPdfStorage.js`)

Functions available:

- `loadSyllabusPdfs()` - Load all PDF metadata
- `saveSyllabusPdf(subject, file)` - Save a PDF (async)
- `removeSyllabusPdf(subject)` - Remove a PDF
- `getSyllabusPdf(subject)` - Get specific PDF data
- `clearAllPdfs()` - Remove all PDFs
- `getStorageSize()` - Get total storage used (bytes)
- `formatFileSize(bytes)` - Format bytes to human-readable size

---

## Components

### SubjectPlanner.jsx

- Main calendar interface
- Month navigation
- Color-coded date display
- Modal trigger for adding/editing plans

### SubjectPlannerModal.jsx

- Modal for managing plans on a specific date
- Form for adding new plans (subject, note, color)
- List of existing plans with delete functionality

### SyllabusPdfHub.jsx

- Subject cards layout
- PDF upload, view, download, delete functionality
- Storage size monitoring
- File size and date display

---

## Development

The features are built with:

- **React 18.2.0** - Functional components with hooks
- **Vite 5.4.21** - Fast development and build
- **Tailwind CSS 3.4.0** - Utility-first styling
- **Lucide React** - Modern icon library
- **localStorage API** - Data persistence
- **FileReader API** - PDF to Base64 conversion

All features work completely offline with no backend required!
