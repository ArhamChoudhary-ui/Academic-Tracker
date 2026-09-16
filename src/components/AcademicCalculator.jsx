import React, { useState, useEffect } from "react";
import {
  Calculator,
  GraduationCap,
  Sparkles,
  RotateCcw,
  BookOpen,
  Award,
  Check,
} from "lucide-react";
import InstantGpaSection from "./academicCalculator/InstantGpaSection";
import CgpaSection from "./academicCalculator/CgpaSection";
import VitGradingInfoSection from "./academicCalculator/VitGradingInfoSection";
import {
  loadAcademicCalculatorState,
  saveAcademicCalculatorState,
  createInitialCourses,
  createInitialSemesters,
} from "../utils/academicCalculator";

export default function AcademicCalculator() {
  // Load initial persisted state
  const [calculatorState, setCalculatorState] = useState(loadAcademicCalculatorState);
  const [activeSubTab, setActiveSubTab] = useState("cgpa"); // "cgpa" | "gpa"
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveAcademicCalculatorState(calculatorState);
  }, [calculatorState]);

  // ─── Sub-State Handlers ─────────────────────────────────────────────────────

  const handleCoursesChange = (newCourses) => {
    setCalculatorState((prev) => ({
      ...prev,
      courses: newCourses,
    }));
  };

  const handleResetGpa = () => {
    setCalculatorState((prev) => ({
      ...prev,
      courses: createInitialCourses(),
    }));
    showToast("Instant GPA calculator reset to defaults.");
  };

  const handleSemestersChange = (newSemesters) => {
    setCalculatorState((prev) => ({
      ...prev,
      semesters: newSemesters,
    }));
  };

  const handleResetCgpa = () => {
    setCalculatorState((prev) => ({
      ...prev,
      semesters: createInitialSemesters(),
    }));
    showToast("CGPA calculator reset to 8 default semesters.");
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
              VIT Academic Grading System
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Calculator className="text-blue-400" size={32} />
            Academic Calculator
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Official credit-weighted GPA & CGPA calculation for VIT University.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          {toastMessage && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold animate-fade-in">
              <Check size={14} />
              {toastMessage}
            </div>
          )}

          <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab("cgpa")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeSubTab === "cgpa"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <GraduationCap size={15} />
              CGPA Calculator
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("gpa")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeSubTab === "gpa"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Calculator size={15} />
              Instant GPA
            </button>
          </div>
        </div>
      </div>

      {/* Main Selected Calculator Card (Full Width, Spacious) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        {activeSubTab === "cgpa" ? (
          <CgpaSection
            semesters={calculatorState.semesters}
            onSemestersChange={handleSemestersChange}
            onReset={handleResetCgpa}
          />
        ) : (
          <InstantGpaSection
            courses={calculatorState.courses}
            onCoursesChange={handleCoursesChange}
            onReset={handleResetGpa}
          />
        )}
      </div>

      {/* VIT Grading System Informational Section */}
      <VitGradingInfoSection />
    </div>
  );
}
