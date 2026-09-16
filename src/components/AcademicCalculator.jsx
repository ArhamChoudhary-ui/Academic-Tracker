import React, { useState, useEffect } from "react";
import {
  Calculator,
  GraduationCap,
  Sparkles,
  RotateCcw,
  BookOpen,
  Layers,
  Award,
  Check,
} from "lucide-react";
import InstantGpaSection from "./academicCalculator/InstantGpaSection";
import CgpaSection from "./academicCalculator/CgpaSection";
import TargetGpaSection from "./academicCalculator/TargetGpaSection";
import VitGradingInfoSection from "./academicCalculator/VitGradingInfoSection";
import {
  loadAcademicCalculatorState,
  saveAcademicCalculatorState,
  createInitialCourses,
  createInitialSemesters,
  createInitialCourseWiseSemesters,
  calculateCGPA,
} from "../utils/academicCalculator";

export default function AcademicCalculator() {
  // Load initial persisted state
  const [calculatorState, setCalculatorState] = useState(loadAcademicCalculatorState);
  const [activeSubTab, setActiveSubTab] = useState("all"); // "all" | "cgpa" | "gpa"
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

  const handleCourseWiseSemestersChange = (newCourseWise) => {
    setCalculatorState((prev) => ({
      ...prev,
      courseWiseSemesters: newCourseWise,
    }));
  };

  const handleCgpaModeChange = (newMode) => {
    setCalculatorState((prev) => ({
      ...prev,
      cgpaMode: newMode,
    }));
  };

  const handleResetCgpa = () => {
    setCalculatorState((prev) => ({
      ...prev,
      semesters: createInitialSemesters(),
      courseWiseSemesters: createInitialCourseWiseSemesters(),
    }));
    showToast("CGPA calculator reset to 8 default semesters.");
  };

  const handleWhatIfChange = (newWhatIf) => {
    setCalculatorState((prev) => ({
      ...prev,
      whatIfState: newWhatIf,
    }));
  };

  const handleAutoFillWhatIf = () => {
    const cgpaResult = calculateCGPA(calculatorState.semesters);
    if (cgpaResult.isValid) {
      setCalculatorState((prev) => ({
        ...prev,
        whatIfState: {
          ...prev.whatIfState,
          currentCGPA: cgpaResult.cgpaFormatted,
          currentCredits: cgpaResult.totalCredits,
        },
      }));
      showToast("Imported current CGPA and credits into What-If planner.");
    }
  };

  const cgpaResult = calculateCGPA(calculatorState.semesters);

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
              VIT Academic Grading System
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Calculator className="text-blue-400" size={32} />
            Academic Calculator
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Official credit-weighted GPA & CGPA forecasting engineered for the VIT 10-point grade scale.
          </p>
        </div>

        {/* View Switcher Filter */}
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
              onClick={() => setActiveSubTab("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              All Calculators
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("cgpa")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === "cgpa"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              CGPA
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("gpa")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === "gpa"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Instant GPA
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculators Section */}
      {activeSubTab === "all" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* CGPA Calculator Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <CgpaSection
              semesters={calculatorState.semesters}
              onSemestersChange={handleSemestersChange}
              courseWiseSemesters={calculatorState.courseWiseSemesters}
              onCourseWiseSemestersChange={handleCourseWiseSemestersChange}
              mode={calculatorState.cgpaMode}
              onModeChange={handleCgpaModeChange}
              onReset={handleResetCgpa}
            />
          </div>

          {/* Instant GPA Calculator Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <InstantGpaSection
              courses={calculatorState.courses}
              onCoursesChange={handleCoursesChange}
              onReset={handleResetGpa}
            />
          </div>
        </div>
      ) : activeSubTab === "cgpa" ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm max-w-4xl mx-auto">
          <CgpaSection
            semesters={calculatorState.semesters}
            onSemestersChange={handleSemestersChange}
            courseWiseSemesters={calculatorState.courseWiseSemesters}
            onCourseWiseSemestersChange={handleCourseWiseSemestersChange}
            mode={calculatorState.cgpaMode}
            onModeChange={handleCgpaModeChange}
            onReset={handleResetCgpa}
          />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm max-w-4xl mx-auto">
          <InstantGpaSection
            courses={calculatorState.courses}
            onCoursesChange={handleCoursesChange}
            onReset={handleResetGpa}
          />
        </div>
      )}

      {/* What-If / Target CGPA Section */}
      <TargetGpaSection
        state={calculatorState.whatIfState}
        onChange={handleWhatIfChange}
        onAutoFill={handleAutoFillWhatIf}
        canAutoFill={cgpaResult.isValid}
      />

      {/* VIT Grading System Informational Section */}
      <VitGradingInfoSection />
    </div>
  );
}
