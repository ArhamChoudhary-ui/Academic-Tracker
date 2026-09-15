# Academic Tracker

A browser-based mark tracking tool for university students. Tracks internal assessment scores across subjects, computes weighted internals and predicted final marks, and provides a few analytics views.

Built for personal use — no backend, no login, no data leaves the browser.

---

## What it does

- **Subject cards** — enter CAT, quiz, FAT, and lab marks per subject. Internals are auto-weighted.
- **Dynamic subjects** — add or remove subjects from the dashboard; weightage is configurable per subject.
- **Goal Calculator** — given a target percentage, calculates the FAT score you need.
- **Report view** — GPA, consistency score, and a per-subject breakdown.
- **Charts** — bar, line, and radar views via Recharts.
- **AI Study Assistant** — upload a syllabus PDF and get a structured study-notes summary.
- **Exam Question Generator** — generates MCQs, 2-mark, 5-mark, numerical, and definition questions from a PDF.
- **Study timer** — Pomodoro-style timer with session logging.
- **CSV export** — download all marks as a spreadsheet.
- **Cloud sync** (optional) — encrypted sync using your own credentials; data is end-to-end encrypted client-side before upload.

All data (marks, PDFs, planner entries) is stored in `localStorage`. Clearing browser data clears the app.

---

## Tech

| Layer | Library |
|---|---|
| UI | React 18, Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| PDF parsing | pdf.js 3 |
| Build | Vite 5 |
| Storage | localStorage (+ optional encrypted cloud sync) |

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview      # preview the built output locally
```

---


## Calculation notes

**Internal marks** (default weights, configurable in settings):
```
Internals = CAT1×0.20 + CAT2×0.20 + QUIZ1×0.10 + QUIZ2×0.10 + QUIZ3×0.10
```

**FAT prediction** — linear trend on CAT/quiz scores:
```
Predicted FAT = Mean(assessments) + Trend×0.5
```
where `Trend = avg(second half scores) − avg(first half scores)`, capped to 0–100.

**GPA** (4.0 scale):

| % range | GPA |
|---|---|
| ≥ 90 | 4.0 |
| 80–89 | 3.7 |
| 70–79 | 3.3 |
| 60–69 | 3.0 |
| 50–59 | 2.7 |
| 40–49 | 2.0 |
| < 40 | 0.0 |

---

## Privacy

Everything runs in the browser. No analytics, no tracking, no server calls except the optional cloud sync you configure yourself. The AI features (study assistant, question generator) run entirely client-side using pdf.js and local text processing — no API calls are made.

---

## License

Open source, personal/educational use. Fork and adapt as needed.
