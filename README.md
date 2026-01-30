# 📚 Academic Tracker - Personal Mark Management System

A comprehensive web application for students to track, analyze, and predict their academic performance across multiple subjects.

![Academic Tracker](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.0-38bdf8)
![Recharts](https://img.shields.io/badge/Recharts-2.10.3-8884d8)

## ✨ Features

### 📊 Core Functionality

- **Subject Management**: Track 6 subjects (Probability & Statistics, DSA, OOPS, Software Engineering, Chemistry, English)
- **Assessment Components**: CAT-1, CAT-2, QUIZ-1, QUIZ-2, QUIZ-3, INTERNALS (auto-calculated), FAT, LAB
- **Auto-calculation**: Automatic computation of totals, averages, and internal marks
- **Local Storage**: All data persists locally in your browser

### 📈 Statistics & Analytics

- **Mean, Median, Mode**: Complete statistical analysis of your marks
- **Weighted Internals**: Configurable weights for CAT and Quiz components
- **GPA Calculation**: Automatic GPA calculation on 4.0 scale
- **Letter Grades**: A+ to F grading system
- **Standard Deviation**: Measure consistency in performance

### 🔮 Predictive Analytics

- **FAT Score Prediction**: Uses linear trend analysis based on CAT and Quiz performance
- **Performance Trends**: Identify improving or declining subjects
- **Best/Worst Subject**: Automatically identifies strengths and weaknesses

### 📊 Visual Analytics

- **Bar Charts**: Subject-wise total marks comparison
- **Line Charts**: Performance trends over assessments
- **Radar Charts**: Overall subject performance visualization
- **Multi-component Charts**: Detailed assessment comparison

### 🎨 User Experience

- **Dark Mode**: Toggle between light and dark themes with persistence
- **Mobile-First**: Fully responsive design for all devices
- **Clean UI**: Modern, minimal interface using Tailwind CSS
- **Real-time Updates**: Instant calculations as you enter marks
- **Notes System**: Add notes and reminders for each subject

### 💾 Data Management

- **CSV Export**: Download your marks as CSV file
- **Auto-save**: Changes are automatically saved to local storage
- **Clear Data**: Option to reset all data

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 How to Use

### 1. Enter Marks

- Click on any subject card to expand it
- Enter marks for each assessment component (out of 100)
- INTERNALS are automatically calculated based on weighted CATs and Quizzes
- Add notes for the subject (optional)
- Click "Save Changes" button

### 2. View Statistics

- Navigate to the **Dashboard** tab
- See overall performance metrics:
  - Overall Average and GPA
  - Best and Worst subjects
  - Mean, Median, Mode
  - Standard Deviation
- View subject-wise breakdown table
- Check FAT score predictions

### 3. Visualize Progress

- Navigate to the **Charts** tab
- View multiple chart types:
  - Total marks bar chart
  - Assessment components comparison
  - Performance trends line chart
  - Radar chart for overall view

### 4. Configure Settings

- Click the ⚙️ Settings icon in header
- Adjust weights for internal marks calculation:
  - CAT-1, CAT-2, QUIZ-1, QUIZ-2, QUIZ-3
  - Default: CAT-1 & CAT-2 (20% each), Quizzes (10% each)
- Save changes to apply new calculations

### 5. Export Data

- Click the 📥 Download icon in header
- Your marks will be exported as CSV file
- Import into Excel or Google Sheets for further analysis

### 6. Toggle Theme

- Click the 🌙/☀️ icon to switch between dark and light mode
- Theme preference is saved automatically

## 🧮 Calculation Methods

### Internal Marks

```
INTERNALS = (CAT1 × 0.20) + (CAT2 × 0.20) + (QUIZ1 × 0.10) + (QUIZ2 × 0.10) + (QUIZ3 × 0.10)
```

_Weights are configurable in settings_

### Total Marks

```
Total = CAT1 + CAT2 + QUIZ1 + QUIZ2 + QUIZ3 + FAT + LAB
Maximum = 700 (7 components × 100)
```

### Percentage

```
Percentage = (Total / 700) × 100
```

### GPA Calculation

- 90%+ → 4.0 (A+)
- 80-89% → 3.7 (A)
- 70-79% → 3.3 (B+)
- 60-69% → 3.0 (B)
- 50-59% → 2.7 (C)
- 40-49% → 2.0 (D)
- Below 40% → 0.0 (F)

### FAT Prediction Algorithm

1. Collect all CAT and Quiz scores
2. Calculate mean of all assessments
3. Analyze trend by comparing first half vs second half
4. Apply trend adjustment: `Prediction = Mean + (Trend × 0.5)`
5. Cap result between 0-100

### Statistical Metrics

- **Mean**: Average of all marks
- **Median**: Middle value when sorted
- **Mode**: Most frequently occurring mark
- **Standard Deviation**: √(Σ(x - μ)² / n)

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.0
- **Charts**: Recharts 2.10.3
- **Icons**: Lucide React
- **Build Tool**: Vite 5.0.8
- **Data Storage**: Browser Local Storage

## 📁 Project Structure

```
Marks app/
├── src/
│   ├── components/
│   │   ├── SubjectCard.jsx      # Subject marks input component
│   │   ├── Dashboard.jsx        # Statistics and analytics
│   │   └── Charts.jsx           # Visual charts component
│   ├── utils/
│   │   ├── calculations.js      # All calculation functions
│   │   ├── data.js             # Data models and constants
│   │   └── storage.js          # Local storage utilities
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Key Features Explained

### Subject Card Component

- Expandable/collapsible interface
- Input validation (0-100 range)
- Auto-calculated internals
- Real-time total and percentage
- FAT prediction toggle
- Notes section
- Auto-save functionality

### Dashboard Component

- Six key metric cards
- Statistical analysis section
- FAT prediction cards with trend indicators
- Comprehensive subject breakdown table
- Color-coded grades and GPA

### Charts Component

- Responsive design using Recharts
- Multiple visualization types
- Custom tooltips with full subject names
- Dark mode compatible colors
- Interactive legends

## 🔒 Privacy & Security

- **100% Local**: All data stored in browser's local storage
- **No Backend**: No data transmitted to any server
- **No Login Required**: Completely offline-capable
- **Your Data**: Full control over your information

## 🌟 Future Enhancements (Potential)

- Semester-wise organization
- Multiple semester tracking
- PDF export with charts
- Goal setting and tracking
- Attendance tracking
- Assignment deadlines
- Mobile app version (React Native)
- Cloud sync option (optional)

## 🐛 Troubleshooting

### Data Not Saving

- Check browser's local storage is enabled
- Try clearing browser cache and refreshing

### Charts Not Displaying

- Ensure marks are entered for at least one subject
- Check browser console for errors

### Calculation Issues

- Verify all marks are between 0-100
- Check weight configuration totals 100%

## 📝 License

This project is open source and available for personal educational use.

## 👨‍💻 Developer

Built with ❤️ for students who want to track and improve their academic performance.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

**Happy Tracking! 📚✨**
