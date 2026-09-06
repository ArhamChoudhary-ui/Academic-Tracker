import React, { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Download,
  Plus,
  Settings,
  Trash2,
  X,
  FileText,
  Gamepad2,
  Target,
  BookOpen,
} from "lucide-react";
import SubjectCard from "./components/SubjectCard";
import AddSubjectModal from "./components/AddSubjectModal";
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
import {
  SUBJECTS,
  createEmptySubjectData,
  createEmptyMarks,
  createEmptyClassAverage,
} from "./utils/data";
import { clearAllStudySessions } from "./utils/study";
import { clearAllTimerSessions } from "./utils/timerStorage";
import {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  exportToCSV,
  saveWeights,
  loadWeights,
} from "./utils/storage";

function App() {
  const [subjectsData, setSubjectsData] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
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
    setSubjectsData(savedData || createEmptySubjectData());
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

  // Add a new subject dynamically
  const handleAddSubject = ({ name, weightage, notes }) => {
    if (!name) return;
    // Save custom weightage for this subject
    const existingWeights = loadWeights() || {};
    const updatedWeights = { ...existingWeights, [name]: weightage };
    saveWeights(updatedWeights);

    setSubjectsData((prev) => ({
      ...prev,
      [name]: {
        marks: createEmptyMarks(),
        classAverage: createEmptyClassAverage(),
        notes: notes || "",
      },
    }));
    setShowAddSubject(false);
    setExpandedSubject(name);
  };

  // Remove a single subject
  const handleRemoveSubject = (subject) => {
    setSubjectsData((prev) => {
      const updated = { ...prev };
      delete updated[subject];
      return updated;
    });
    if (expandedSubject === subject) setExpandedSubject(null);
    // Remove custom weight if present
    try {
      const weights = loadWeights() || {};
      if (weights[subject]) {
        delete weights[subject];
        saveWeights(weights);
      }
    } catch (e) {}
  };

  // Remove ALL subjects
  const handleRemoveAllSubjects = () => {
    if (
      window.confirm(
        "Remove ALL subjects from your dashboard? This cannot be undone. Your data will be cleared.",
      )
    ) {
      clearStorage();
      clearAllStudySessions();
      clearAllTimerSessions();
      setSubjectsData({});
      setExpandedSubject(null);
    }
  };

  // Restore default subjects
  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        "Restore default subjects? This will add the original subjects back alongside any existing ones.",
      )
    ) {
      setSubjectsData((prev) => {
        const defaults = createEmptySubjectData();
        return { ...defaults, ...(prev || {}) };
      });
    }
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
            {activeTab === "subjects" && subjectsData && (() => {
              const subjectsList = Object.keys(subjectsData);
              return (
                <div className="space-y-10">
                  {/* Header row */}
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-3">
                      <h2 className="text-4xl font-bold tracking-tight">
                        My Subjects
                      </h2>
                      <div className="h-px w-full bg-white/10" />
                      <p className="text-sm text-white/60">
                        {subjectsList.length === 0
                          ? "No subjects enrolled"
                          : `${subjectsList.length} subject${subjectsList.length === 1 ? "" : "s"} enrolled`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {subjectsList.length > 0 && (
                        <button
                          onClick={handleRemoveAllSubjects}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-400/30 text-red-300 hover:bg-red-400/10 hover:border-red-400/60 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 text-sm"
                          title="Remove all subjects"
                        >
                          <Trash2 size={16} />
                          Remove All
                        </button>
                      )}
                      <button
                        onClick={() => setShowAddSubject(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                      >
                        <Plus size={18} />
                        Add Subject
                      </button>
                    </div>
                  </div>

                  {/* Empty state */}
                  {subjectsList.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/20 rounded-2xl space-y-5">
                      <BookOpen size={48} className="mx-auto text-white/25" />
                      <div>
                        <p className="text-2xl font-bold text-white/80">No subjects yet</p>
                        <p className="text-sm text-white/50 mt-2">
                          Add your first subject to start tracking your marks.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <button
                          onClick={() => setShowAddSubject(true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                        >
                          <Plus size={18} />
                          Add Subject
                        </button>
                        <button
                          onClick={handleRestoreDefaults}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:bg-white/10 font-semibold transition-colors text-sm"
                        >
                          Restore Default Subjects
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-auto">
                      {subjectsList.map((subject) => (
                        <div
                          key={subject}
                          className={
                            expandedSubject === subject ?
                              "md:col-span-2 xl:col-span-3"
                            : ""
                          }
                        >
                          <SubjectCard
                            subject={subject}
                            subjectData={subjectsData[subject]}
                            onUpdate={handleSubjectUpdate}
                            onRemove={handleRemoveSubject}
                            isExpanded={expandedSubject === subject}
                            onToggle={() =>
                              setExpandedSubject((prev) =>
                                prev === subject ? null : subject,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
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


          {/* Add Subject Modal */}
          <AddSubjectModal
            isOpen={showAddSubject}
            onClose={() => setShowAddSubject(false)}
            onAdd={handleAddSubject}
            existingSubjects={subjectsData ? Object.keys(subjectsData) : []}
          />

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
