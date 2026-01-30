import React, { useState, useEffect } from "react";
import { Moon, Sun, Download, Settings, Trash2, X, Save } from "lucide-react";
import SubjectCard from "./components/SubjectCard";
import Dashboard from "./components/Dashboard";
import Charts from "./components/Charts";
import { SUBJECTS, createEmptySubjectData } from "./utils/data";
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
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("subjects");
  const [showSettings, setShowSettings] = useState(false);

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
      setSubjectsData(createEmptySubjectData());
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {}
      <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Academic Tracker
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Export to CSV"
              >
                <Download
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Settings"
              >
                <Settings
                  size={20}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ?
                  <Moon size={20} className="text-gray-700" />
                : <Sun size={20} className="text-yellow-400" />}
              </button>
            </div>
          </div>
          {}
          <div className="flex gap-2 border-t border-gray-200 dark:border-gray-700 -mb-px">
            {["subjects", "dashboard", "charts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab ?
                    "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>
      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ?
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading your data...
              </p>
            </div>
          </div>
        : <>
            {activeTab === "subjects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    My Subjects
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {SUBJECTS.length} subjects enrolled
                  </p>
                </div>
                {SUBJECTS.map((subject) => (
                  <SubjectCard
                    key={subject}
                    subject={subject}
                    subjectData={subjectsData[subject]}
                    onUpdate={handleSubjectUpdate}
                  />
                ))}
              </div>
            )}
            {activeTab === "dashboard" && (
              <Dashboard subjectsData={subjectsData} />
            )}
            {activeTab === "charts" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Performance Charts
                </h2>
                <Charts subjectsData={subjectsData} />
              </div>
            )}
          </>
        }
      </main>
      {}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {}
              <div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                  Danger Zone
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Clear all marks and data. This action cannot be undone.
                </p>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                  Clear All Data
                </button>
              </div>
              {}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {}
      <footer className="mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Academic Tracker - Personal Mark Management System</p>
        <p className="mt-1">Built by Arham</p>
      </footer>
    </div>
  );
}
export default App;
