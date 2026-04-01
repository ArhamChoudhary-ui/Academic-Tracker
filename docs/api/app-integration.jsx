/**
 * INTEGRATION EXAMPLE
 * How to update App.jsx for encrypted storage
 *
 * This file shows the complete updated App component
 * with authentication and encrypted storage integrated
 */

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Download,
  Settings,
  Trash2,
  X,
  Save,
  FileText,
  LogOut,
  Clock,
} from "lucide-react";

// Import auth and encrypted storage
import UnlockScreen from "./components/UnlockScreen";
import {
  initializeAuth,
  isAuthenticated,
  logout,
  getSessionTimeRemaining,
} from "./utils/authManager";
import {
  saveToEncryptedStorage,
  loadFromEncryptedStorage,
  saveTheme,
  loadTheme,
  clearAllEncryptedData,
  exportToCSV,
} from "./utils/encryptedStorage";

// Import other components
import SubjectCard from "./components/SubjectCard";
import Dashboard from "./components/Dashboard";
import Charts from "./components/Charts";
import StudyTracker from "./components/StudyTracker";
import StudyTimer from "./components/StudyTimer";
import StudyCalendar from "./components/StudyCalendar";
import SubjectPlanner from "./components/SubjectPlanner";
import SyllabusPdfHub from "./components/SyllabusPdfHub";
import ReportView from "./components/ReportView";

import { SUBJECTS, createEmptySubjectData } from "./utils/data";
import { clearAllStudySessions } from "./utils/study";
import { clearAllTimerSessions } from "./utils/timerStorage";

function App() {
  // State management
  const [subjectsData, setSubjectsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);
  const [activeTab, setActiveTab] = useState("subjects");
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================================
  // AUTHENTICATION INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user has password set and is currently logged in
        await initializeAuth();

        if (isAuthenticated()) {
          // User already has valid session
          setAuthenticated(true);
          await loadData();
        } else {
          // Need to show unlock screen
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        setErrorMessage("Failed to initialize authentication");
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================================================
  // LOAD ENCRYPTED DATA
  // ============================================================================

  const loadData = async () => {
    try {
      const savedData = await loadFromEncryptedStorage();
      const dataToUse = savedData || createEmptySubjectData();
      setSubjectsData(dataToUse);
      setErrorMessage("");
    } catch (error) {
      console.error("Error loading encrypted data:", error);
      if (error.message.includes("not authenticated")) {
        setAuthenticated(false);
      } else {
        setErrorMessage("Failed to load encrypted data");
      }
      setSubjectsData(createEmptySubjectData());
    }
  };

  // ============================================================================
  // SAVE ENCRYPTED DATA (AUTO-SAVE)
  // ============================================================================

  useEffect(() => {
    if (subjectsData !== null && !isLoading && authenticated) {
      const saveAsync = async () => {
        try {
          await saveToEncryptedStorage(subjectsData);
          setErrorMessage(""); // Clear error on successful save
        } catch (error) {
          console.error("Error saving encrypted data:", error);
          if (error.message.includes("not authenticated")) {
            setAuthenticated(false);
          } else {
            setErrorMessage("Failed to save data");
          }
        }
      };

      saveAsync();
    }
  }, [subjectsData, isLoading, authenticated]);

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  useEffect(() => {
    const savedTheme = loadTheme();
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ============================================================================
  // SESSION TIMEOUT MONITORING
  // ============================================================================

  useEffect(() => {
    if (!authenticated) return;

    const timer = setInterval(() => {
      const remaining = getSessionTimeRemaining();
      setSessionTimeRemaining(remaining);

      // Auto-logout when session expires
      if (remaining === 0) {
        console.warn("Session expired - logging out");
        handleLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [authenticated]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleAuthenticated = async () => {
    setAuthenticated(true);
    await loadData();
  };

  const handleLogout = () => {
    logout(); // Clears session from memory and sessionStorage
    setAuthenticated(false);
    setSubjectsData(null);
    setSessionTimeRemaining(null);
  };

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

  const handleClearData = async () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to permanently delete ALL encrypted data?\nThis action CANNOT be undone.",
      )
    ) {
      try {
        await clearAllEncryptedData();
        await clearAllStudySessions();
        await clearAllTimerSessions();
        setSubjectsData(createEmptySubjectData());
        setErrorMessage("All data cleared");
      } catch (error) {
        console.error("Error clearing data:", error);
        setErrorMessage("Failed to clear data");
      }
    }
  };

  // ============================================================================
  // RENDER: SHOW UNLOCK SCREEN IF NOT AUTHENTICATED
  // ============================================================================

  if (!authenticated || isLoading) {
    return <UnlockScreen onAuthenticated={handleAuthenticated} />;
  }

  // ============================================================================
  // RENDER: MAIN APP (After Authentication)
  // ============================================================================

  if (!subjectsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your encrypted data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* ===================================================================== */}
      {/* HEADER */}
      {/* ===================================================================== */}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Title */}
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Academic Tracker
              </h1>
            </div>

            {/* Middle: Tab Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {[
                { id: "subjects", label: "Subjects" },
                { id: "tracker", label: "Tracker" },
                { id: "timer", label: "Timer" },
                { id: "calendar", label: "Calendar" },
                { id: "planner", label: "Planner" },
                { id: "syllabus", label: "Syllabus" },
                { id: "dashboard", label: "Dashboard" },
                { id: "charts", label: "Charts" },
                { id: "report", label: "Report" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id ?
                      "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right: Actions & Controls */}
            <div className="flex items-center space-x-4">
              {/* Session Timer */}
              {sessionTimeRemaining !== null && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(sessionTimeRemaining / 60)}m</span>
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={handleExport}
                title="Export marks to CSV"
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title="Toggle dark mode"
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {theme === "light" ?
                  <Moon className="w-5 h-5" />
                : <Sun className="w-5 h-5" />}
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                title="Settings"
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Logout (lock data)"
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* ERROR BANNER */}
      {/* ===================================================================== */}
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-300 text-center">
            {errorMessage}
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "subjects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBJECTS.map((subject) => (
              <SubjectCard
                key={subject}
                subject={subject}
                data={subjectsData[subject]}
                onUpdate={(data) => handleSubjectUpdate(subject, data)}
              />
            ))}
          </div>
        )}

        {activeTab === "tracker" && <StudyTracker data={subjectsData} />}
        {activeTab === "timer" && <StudyTimer />}
        {activeTab === "calendar" && <StudyCalendar />}
        {activeTab === "planner" && <SubjectPlanner />}
        {activeTab === "syllabus" && <SyllabusPdfHub />}
        {activeTab === "dashboard" && <Dashboard data={subjectsData} />}
        {activeTab === "charts" && <Charts data={subjectsData} />}
        {activeTab === "report" && <ReportView data={subjectsData} />}
      </main>

      {/* ===================================================================== */}
      {/* SETTINGS MODAL */}
      {/* ===================================================================== */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Session Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  🔒 Session
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                  Session expires in{" "}
                  {Math.floor((sessionTimeRemaining || 0) / 60)} minutes of
                  inactivity.
                </p>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowSettings(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors"
                >
                  Logout (Lock Data)
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border-2 border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  ⚠️ Danger Zone
                </h3>
                <p className="text-sm text-red-800 dark:text-red-400 mb-3">
                  Permanently delete all encrypted data (cannot be undone).
                </p>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    handleClearData();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Clear All Data
                </button>
              </div>

              {/* Info */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm text-gray-700 dark:text-gray-300">
                <p>🔐 All your data is encrypted with AES-256</p>
                <p>🔑 Your password is never stored</p>
                <p>📦 Data is stored locally in IndexedDB</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
