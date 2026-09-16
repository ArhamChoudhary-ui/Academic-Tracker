import React, { useMemo } from "react";
import { Plus, Trash2, RotateCcw, Calculator, Sparkles, Award } from "lucide-react";
import {
  GRADE_OPTIONS,
  calculateGPA,
  validateCourse,
  createInitialCourses,
} from "../../utils/academicCalculator";

export default function InstantGpaSection({
  courses,
  onCoursesChange,
  onReset,
}) {
  // Live calculation
  const result = useMemo(() => calculateGPA(courses), [courses]);

  const handleAddCourse = () => {
    const newCourse = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: "",
      credits: 4,
      grade: "S",
    };
    onCoursesChange([...courses, newCourse]);
  };

  const handleUpdateCourse = (id, field, value) => {
    onCoursesChange(
      courses.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          [field]: field === "credits" ? (value === "" ? "" : Number(value)) : value,
        };
      })
    );
  };

  const handleRemoveCourse = (id) => {
    onCoursesChange(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="text-blue-400" size={24} />
            Instant GPA Calculator
          </h3>
          <p className="text-sm text-white/60 mt-1">
            Calculate your current semester GPA using individual course credits and VIT letter grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
            title="Reset courses to defaults"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddCourse}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/25 transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Plus size={15} />
            Add Course
          </button>
        </div>
      </div>

      {/* Prominent Result Card */}
      <div className="bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-blue-900/40 border border-blue-400/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Award size={16} className="text-blue-300" />
              Calculated Semester GPA
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                {result.isValid ? result.gpaFormatted : "0.00"}
              </span>
              <span className="text-sm font-semibold text-white/50">/ 10.00</span>
            </div>
            <p className="text-xs text-white/60">
              {result.isValid
                ? `Σ(Credits × Grade Points) ÷ Total Credits`
                : "Add courses with valid credits and grades to calculate"}
            </p>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Total Credits</p>
              <p className="text-xl font-bold text-white mt-0.5">{result.totalCredits}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Grade Points</p>
              <p className="text-xl font-bold text-white mt-0.5">{result.totalGradePoints}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Courses</p>
              <p className="text-xl font-bold text-white mt-0.5">{result.validCoursesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List / Table */}
      {courses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/20 rounded-2xl bg-white/5 space-y-4">
          <p className="text-lg font-semibold text-white/70">No courses added yet.</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Click "+ Add Course" to add subjects with their respective credits and grades.
          </p>
          <button
            type="button"
            onClick={handleAddCourse}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <Plus size={16} />
            Add Course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Column Header (Desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-white/50 uppercase tracking-wide">
            <div className="col-span-5">Course Title (Optional)</div>
            <div className="col-span-3">Credits</div>
            <div className="col-span-3">Grade</div>
            <div className="col-span-1 text-right">Remove</div>
          </div>

          {/* Rows */}
          {courses.map((course, idx) => {
            const error = validateCourse(course);
            return (
              <div
                key={course.id}
                className="bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-xl p-3 sm:p-4 transition-all duration-150 space-y-2 sm:space-y-0"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Course Name */}
                  <div className="sm:col-span-5">
                    <label className="block sm:hidden text-xs text-white/60 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={course.name || ""}
                      onChange={(e) => handleUpdateCourse(course.id, "name", e.target.value)}
                      placeholder={`e.g. Course ${idx + 1}`}
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      aria-label={`Course title for course ${idx + 1}`}
                    />
                  </div>

                  {/* Credits */}
                  <div className="sm:col-span-3">
                    <label className="block sm:hidden text-xs text-white/60 mb-1">Credits</label>
                    <input
                      type="number"
                      min="0.5"
                      max="30"
                      step="0.5"
                      value={course.credits}
                      onChange={(e) => handleUpdateCourse(course.id, "credits", e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      aria-label={`Credits for course ${idx + 1}`}
                      placeholder="Credits (e.g. 4)"
                    />
                  </div>

                  {/* Grade */}
                  <div className="sm:col-span-3">
                    <label className="block sm:hidden text-xs text-white/60 mb-1">Grade</label>
                    <select
                      value={course.grade}
                      onChange={(e) => handleUpdateCourse(course.id, "grade", e.target.value)}
                      className="w-full bg-blue-900/80 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all cursor-pointer"
                      aria-label={`Grade for course ${idx + 1}`}
                    >
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-white">
                          Grade {g} (Point: {g === "S" ? 10 : g === "A" ? 9 : g === "B" ? 8 : g === "C" ? 7 : g === "D" ? 6 : g === "E" ? 5 : 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      className="p-2 text-white/40 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
                      title="Remove course"
                      aria-label={`Remove course ${course.name || idx + 1}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Validation Message if invalid */}
                {error && (
                  <p className="text-xs text-amber-300/90 pl-1">{error}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Helper Footer with live status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-white/50 border-t border-white/5">
        <span>* Live calculation updates automatically as you type or change grades.</span>
        <button
          type="button"
          onClick={handleAddCourse}
          className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 font-semibold"
        >
          <Plus size={14} /> Add another course
        </button>
      </div>
    </div>
  );
}
