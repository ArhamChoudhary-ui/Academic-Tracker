import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Download,
  Settings,
  Trash2,
  X,
  FileText,
} from "lucide-react";
import SubjectCard from "./components/SubjectCard";
import Dashboard from "./components/Dashboard";
import Charts from "./components/Charts";
import StudyTracker from "./components/StudyTracker";
import StudyTimer from "./components/StudyTimer";
import StudyCalendar from "./components/StudyCalendar";
import SubjectPlanner from "./components/SubjectPlanner";
import SyllabusPdfHub from "./components/SyllabusPdfHub";
import ReportView from "./components/ReportView";
import SplashScreen from "./components/SplashScreen";
import LoadingScreen from "./components/LoadingScreen";
import { SUBJECTS, createEmptySubjectData } from "./utils/data";
import { clearAllStudySessions } from "./utils/study";
import { clearAllTimerSessions } from "./utils/timerStorage";
import {
  saveToStorage,
  loadFromStorage,
  saveTheme,
  loadTheme,
  clearStorage,
  exportToCSV,
} from "./utils/storage";

function App() {
  const [subjectsData, setSubjectsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [introStage, setIntroStage] = useState("splash");
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("subjects");
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const savedData = loadFromStorage();
    const dataToUse = savedData || createEmptySubjectData();
    setSubjectsData(dataToUse);
    setIsLoading(false);

    const savedTheme = loadTheme();
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (subjectsData !== null && !isLoading) {
      saveToStorage(subjectsData);
    }
  }, [subjectsData, isLoading]);

  useEffect(() => {
    if (introStage !== "loading") return;
    if (loadingComplete && !isLoading) {
      setIntroStage("app");
    }
  }, [introStage, loadingComplete, isLoading]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubjectUpdate = (subject, data) => {
    setSubjectsData((prev) => ({
      ...prev,
      [subject]: data,
    }));
  };

  const handleExport = () => {
    exportToCSV(subjectsData);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      clearStorage();
      clearAllStudySessions();
      clearAllTimerSessions();
      setSubjectsData(createEmptySubjectData());
    }
  };

  const handleDoubtClick = () => {
    window.open("https://chat.openai.com", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <AnimatePresence>
        {introStage === "splash" && (
          <SplashScreen
            onComplete={() => {
              setLoadingComplete(false);
              setIntroStage("loading");
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {introStage === "loading" && (
          <LoadingScreen onComplete={() => setLoadingComplete(true)} />
        )}
      </AnimatePresence>
      {introStage === "app" && (
        <>
          <header className="border-b border-white/10 sticky top-0 z-50 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold tracking-tight">
                  Academic Tracker
                </h1>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setShowReport(true)}
                    className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    title="View Report"
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={handleExport}
                    className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    title="Export to CSV"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    title="Settings"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </div>

              <nav className="flex gap-8 border-t border-white/10 overflow-x-auto -mx-6 px-6 sm:-mx-8 sm:px-8">
                {[
                  "subjects",
                  "dashboard",
                  "charts",
                  "study",
                  "timer",
                  "calendar",
                  "planner",
                  "syllabus",
                  "doubt",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={
                      tab === "doubt" ? handleDoubtClick : (
                        () => setActiveTab(tab)
                      )
                    }
                    className={`py-4 px-0 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      activeTab === tab ?
                        "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    {tab === "doubt" ? "DOUBT Clear..." : tab}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
            {activeTab === "subjects" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">My Subjects</h2>
                  <p className="text-white/60">
                    {SUBJECTS.length} subjects enrolled
                  </p>
                </div>
                <div className="space-y-0.5">
                  {SUBJECTS.map((subject) => (
                    <SubjectCard
                      key={subject}
                      subject={subject}
                      subjectData={subjectsData[subject]}
                      onUpdate={handleSubjectUpdate}
                    />
                  ))}
                </div>
              </div>
            )}
            {activeTab === "dashboard" && (
              <Dashboard subjectsData={subjectsData} />
            )}
            {activeTab === "charts" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Performance Charts
                  </h2>
                  <p className="text-white/60">
                    Visual breakdown of your marks
                  </p>
                </div>
                <Charts subjectsData={subjectsData} />
              </div>
            )}
            {activeTab === "study" && <StudyTracker />}
            {activeTab === "timer" && <StudyTimer />}
            {activeTab === "calendar" && <StudyCalendar />}
            {activeTab === "planner" && <SubjectPlanner />}
            {activeTab === "syllabus" && <SyllabusPdfHub />}
          </main>

          {showReport && subjectsData && (
            <ReportView
              subjectsData={subjectsData}
              onClose={() => setShowReport(false)}
            />
          )}

          {showSettings && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
              <div className="bg-blue-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto space-y-6 p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="border-t border-white/20"></div>
                <div>
                  <h3 className="text-sm font-semibold text-red-200 mb-3">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    Clear all marks and data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleClearData}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <Trash2 size={18} />
                    Clear All Data
                  </button>
                </div>
                <div className="border-t border-white/20"></div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <footer className="mt-16 py-8 border-t border-white/10 text-center text-sm text-white/60 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <p>Academic Tracker • Personal Mark Management</p>
            <p className="text-xs text-white/40 mt-1">Built by Arham</p>
          </footer>
        </>
      )}
    </div>
  );
}
export default App;
