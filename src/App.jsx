import React, { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Download,
  Settings,
  Trash2,
  X,
  FileText,
  Gamepad2,
  Target,
} from "lucide-react";
import SubjectCard from "./components/SubjectCard";
import Charts from "./components/Charts";
import SubjectPlanner from "./components/SubjectPlanner";
import SyllabusPdfHub from "./components/SyllabusPdfHub";
import ReportView from "./components/ReportView";
import SplashScreen from "./components/SplashScreen";
import LoadingScreen from "./components/LoadingScreen";
import BottomNavigation from "./components/BottomNavigation";
import CloudSettings from "./components/CloudSettings";
import GoalCalculator from "./components/GoalCalculator";
import { CloudSyncProvider } from "./contexts/CloudSyncContext";
import { useResponsive } from "./hooks/useResponsive";

// Lazy load Tetris game
const TetrisGame = lazy(() => import("./components/TetrisGame"));
import { SUBJECTS, createEmptySubjectData } from "./utils/data";
import { clearAllStudySessions } from "./utils/study";
import { clearAllTimerSessions } from "./utils/timerStorage";
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  exportToCSV,
} from "./utils/storage";

function App() {
  const [subjectsData, setSubjectsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [introStage, setIntroStage] = useState("splash");
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("subjects");
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTetris, setShowTetris] = useState(false);
  const [showGoalCalc, setShowGoalCalc] = useState(false);
  const [showCloudSettings, setShowCloudSettings] = useState(false);

  // Responsive hook
  const { isMobile, screenWidth } = useResponsive();

  useEffect(() => {
    const savedData = loadFromStorage();
    const defaultData = createEmptySubjectData();
    const dataToUse =
      savedData ?
        Object.keys(defaultData).reduce(
          (acc, subject) => {
            const defaultSubjectData = defaultData[subject];
            const savedSubjectData = savedData[subject] || {};

            acc[subject] = {
              ...defaultSubjectData,
              ...savedSubjectData,
              marks: {
                ...defaultSubjectData.marks,
                ...(savedSubjectData.marks || {}),
              },
              classAverage: {
                ...defaultSubjectData.classAverage,
                ...(savedSubjectData.classAverage || {}),
              },
              notes: savedSubjectData.notes || "",
            };

            return acc;
          },
          { ...savedData },
        )
      : defaultData;

    setSubjectsData(dataToUse);
    setIsLoading(false);
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
                    onClick={() => setShowGoalCalc(true)}
                    className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    title="Goal Calculator"
                  >
                    <Target size={20} />
                  </button>
                  <button
                    onClick={() => setShowTetris(true)}
                    className="text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    title="Break Mode"
                  >
                    <Gamepad2 size={20} />
                  </button>
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
                {["subjects", "charts", "planner", "syllabus"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-0 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      activeTab === tab ?
                        "border-white text-white"
                      : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </header>

          <main
            className={`max-w-6xl mx-auto px-6 sm:px-8 py-12 ${isMobile ? "pb-32" : "pb-12"}`}
          >
            {activeTab === "subjects" && (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight">
                    My Subjects
                  </h2>
                  <div className="h-px w-full bg-white/10" />
                  <p className="text-sm text-white/60">
                    {SUBJECTS.length} subjects enrolled
                  </p>
                </div>
                <div className="space-y-3">
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
            {activeTab === "charts" && (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight">
                    Performance Charts
                  </h2>
                  <div className="h-px w-full bg-white/10" />
                  <p className="text-sm text-white/60">
                    Visual breakdown of your marks
                  </p>
                </div>
                <Charts subjectsData={subjectsData} />
              </div>
            )}
            {activeTab === "planner" && <SubjectPlanner />}
            {activeTab === "syllabus" && <SyllabusPdfHub />}
          </main>

          {/* Bottom Navigation for Mobile */}
          {isMobile && (
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}

          {showReport && subjectsData && (
            <ReportView
              subjectsData={subjectsData}
              onClose={() => setShowReport(false)}
            />
          )}

          {showGoalCalc && subjectsData && (
            <GoalCalculator
              subjectsData={subjectsData}
              onClose={() => setShowGoalCalc(false)}
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

                {/* Cloud Settings Section */}
                <CloudSettings
                  onClose={() => setShowSettings(false)}
                  subjectsData={subjectsData}
                />

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

          {/* Tetris Game Modal */}
          <Suspense fallback={null}>
            <TetrisGame
              isOpen={showTetris}
              onClose={() => setShowTetris(false)}
            />
          </Suspense>

          <footer className="mt-16 py-8 border-t border-white/10 text-center text-sm text-white/60 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <p>Academic Tracker • Personal Mark Management</p>
            <p className="text-xs text-white/40 mt-1">Built by Arham</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default function AppWithProviders() {
  return (
    <CloudSyncProvider>
      <App />
    </CloudSyncProvider>
  );
}
