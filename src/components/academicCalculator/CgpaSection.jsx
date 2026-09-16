import React, { useMemo } from "react";
import { Plus, Trash2, RotateCcw, GraduationCap, Award, BookOpen, Layers } from "lucide-react";
import {
  GRADE_OPTIONS,
  calculateCGPA,
  calculateCourseLevelCGPA,
  validateSemester,
  validateCourse,
} from "../../utils/academicCalculator";

export default function CgpaSection({
  semesters,
  onSemestersChange,
  courseWiseSemesters,
  onCourseWiseSemestersChange,
  mode = "semester", // "semester" or "courses"
  onModeChange,
  onReset,
}) {
  // Live calculation based on mode
  const semesterResult = useMemo(() => calculateCGPA(semesters), [semesters]);
  const courseResult = useMemo(
    () => calculateCourseLevelCGPA(courseWiseSemesters),
    [courseWiseSemesters]
  );

  const activeResult = mode === "courses" ? courseResult : semesterResult;

  // ─── Standard Semester Handlers ─────────────────────────────────────────────

  const handleAddSemester = () => {
    const nextNumber = semesters.length + 1;
    const newSem = {
      id: `sem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `Semester ${nextNumber}`,
      gpa: "",
      credits: "",
    };
    onSemestersChange([...semesters, newSem]);
  };

  const handleUpdateSemester = (id, field, value) => {
    onSemestersChange(
      semesters.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          [field]: value,
        };
      })
    );
  };

  const handleRemoveSemester = (id) => {
    onSemestersChange(semesters.filter((s) => s.id !== id));
  };

  // ─── Course-Level Handlers ──────────────────────────────────────────────────

  const handleAddCourseWiseSemester = () => {
    const nextNumber = courseWiseSemesters.length + 1;
    const newSem = {
      id: `cw-sem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `Semester ${nextNumber}`,
      courses: [
        {
          id: `cw-c-${Date.now()}-1`,
          name: "",
          credits: 4,
          grade: "S",
        },
      ],
    };
    onCourseWiseSemestersChange([...courseWiseSemesters, newSem]);
  };

  const handleRemoveCourseWiseSemester = (semId) => {
    onCourseWiseSemestersChange(courseWiseSemesters.filter((s) => s.id !== semId));
  };

  const handleAddCourseToSemester = (semId) => {
    onCourseWiseSemestersChange(
      courseWiseSemesters.map((sem) => {
        if (sem.id !== semId) return sem;
        const newCourse = {
          id: `cw-c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: "",
          credits: 4,
          grade: "S",
        };
        return {
          ...sem,
          courses: [...(sem.courses || []), newCourse],
        };
      })
    );
  };

  const handleUpdateCourseInSemester = (semId, courseId, field, value) => {
    onCourseWiseSemestersChange(
      courseWiseSemesters.map((sem) => {
        if (sem.id !== semId) return sem;
        return {
          ...sem,
          courses: sem.courses.map((c) => {
            if (c.id !== courseId) return c;
            return {
              ...c,
              [field]: field === "credits" ? (value === "" ? "" : Number(value)) : value,
            };
          }),
        };
      })
    );
  };

  const handleRemoveCourseFromSemester = (semId, courseId) => {
    onCourseWiseSemestersChange(
      courseWiseSemesters.map((sem) => {
        if (sem.id !== semId) return sem;
        return {
          ...sem,
          courses: sem.courses.filter((c) => c.id !== courseId),
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="text-emerald-400" size={26} />
            CGPA Calculator
          </h3>
          <p className="text-sm text-white/60 mt-1">
            Calculate your cumulative GPA. Fully credit-weighted across all completed semesters or courses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => onModeChange("semester")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                mode === "semester"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Semester GPAs
            </button>
            <button
              type="button"
              onClick={() => onModeChange("courses")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                mode === "courses"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Course-by-Course
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Reset to default 8 semesters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Prominent Result Card */}
      <div className="bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-blue-900/40 border border-emerald-400/30 rounded-2xl p-6 sm:p-7 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Award size={16} className="text-emerald-300 shrink-0" />
              Cumulative Grade Point Average (CGPA)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                {activeResult.isValid ? activeResult.cgpaFormatted : "0.00"}
              </span>
              <span className="text-sm font-semibold text-white/50">/ 10.00</span>
            </div>
            <p className="text-xs text-white/60">
              {activeResult.isValid
                ? "Credit-weighted formula: Σ(Semester GPA × Semester Credits) ÷ Total Credits"
                : "Enter semester GPA and credits below to compute cumulative standing"}
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/10 rounded-xl px-5 py-2.5 text-center flex-1 sm:flex-initial">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Total Credits</p>
              <p className="text-xl font-bold text-white mt-0.5">{activeResult.totalCredits}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-5 py-2.5 text-center flex-1 sm:flex-initial">
              <p className="text-[11px] font-semibold text-white/60 uppercase">
                {mode === "courses" ? "Courses" : "Semesters"}
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {mode === "courses" ? activeResult.courseCount : activeResult.validSemestersCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODE 1: Standard Semester-Level CGPA */}
      {mode === "semester" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Semester Breakdown ({semesters.length} Semesters)
            </p>
            <button
              type="button"
              onClick={handleAddSemester}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
            >
              <Plus size={14} /> Add Semester
            </button>
          </div>

          {semesters.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/20 rounded-2xl bg-white/5 space-y-4">
              <p className="text-lg font-semibold text-white/70">No semesters added yet.</p>
              <button
                type="button"
                onClick={handleAddSemester}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <Plus size={16} /> Add Semester
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {semesters.map((sem, idx) => {
                const error = validateSemester(sem);
                const hasValue = sem.gpa !== "" && sem.credits !== "";
                return (
                  <div
                    key={sem.id}
                    className={`border rounded-xl p-4 transition-all duration-150 relative ${
                      hasValue && !error
                        ? "bg-white/[0.08] border-emerald-400/30 shadow-sm"
                        : "bg-white/5 hover:bg-white/[0.07] border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/10 text-xs font-bold flex items-center justify-center text-white/80">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={sem.name}
                          onChange={(e) => handleUpdateSemester(sem.id, "name", e.target.value)}
                          className="bg-transparent font-bold text-white text-sm focus:outline-none focus:border-b border-blue-400 max-w-[140px]"
                          aria-label={`Name for semester ${idx + 1}`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSemester(sem.id)}
                        className="p-1.5 text-white/40 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={`Remove ${sem.name}`}
                        aria-label={`Remove ${sem.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">
                          GPA (0 - 10)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          placeholder="e.g. 8.75"
                          value={sem.gpa}
                          onChange={(e) => handleUpdateSemester(sem.id, "gpa", e.target.value)}
                          className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                          aria-label={`GPA for ${sem.name}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">
                          Credits
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          max="40"
                          step="0.5"
                          placeholder="e.g. 24"
                          value={sem.credits}
                          onChange={(e) => handleUpdateSemester(sem.id, "credits", e.target.value)}
                          className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                          aria-label={`Credits for ${sem.name}`}
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-xs text-amber-300/90 mt-2">{error}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Course-by-Course Detailed CGPA */}
      {mode === "courses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Course-by-Course Semesters ({courseWiseSemesters.length})
            </p>
            <button
              type="button"
              onClick={handleAddCourseWiseSemester}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all"
            >
              <Plus size={14} /> Add Semester
            </button>
          </div>

          {courseWiseSemesters.map((sem, sIdx) => {
            const semCourses = sem.courses || [];
            const semGpaResult = calculateGPA(semCourses);
            return (
              <div
                key={sem.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-white">{sem.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Sem GPA: {semGpaResult.gpaFormatted} ({semGpaResult.totalCredits} cr)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddCourseToSemester(sem.id)}
                      className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10"
                    >
                      <Plus size={13} /> Add Course
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourseWiseSemester(sem.id)}
                      className="p-1.5 text-white/40 hover:text-red-300 rounded-lg"
                      title="Remove Semester"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {semCourses.map((c, cIdx) => (
                    <div
                      key={c.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white/5 p-2.5 rounded-lg border border-white/5"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) =>
                            handleUpdateCourseInSemester(sem.id, c.id, "name", e.target.value)
                          }
                          placeholder={`Course title ${cIdx + 1}`}
                          className="w-full bg-white/10 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={c.credits}
                          onChange={(e) =>
                            handleUpdateCourseInSemester(sem.id, c.id, "credits", e.target.value)
                          }
                          placeholder="Credits"
                          className="w-full bg-white/10 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <select
                          value={c.grade}
                          onChange={(e) =>
                            handleUpdateCourseInSemester(sem.id, c.id, "grade", e.target.value)
                          }
                          className="w-full bg-blue-900/80 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                        >
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g} className="bg-slate-900 text-white">
                              Grade {g}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveCourseFromSemester(sem.id, c.id)}
                          className="p-1 text-white/40 hover:text-red-300"
                          title="Remove course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helper Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-white/50 border-t border-white/5">
        <span>* CGPA formula: Σ(Semester GPA × Semester Credits) ÷ Σ(Semester Credits)</span>
        <button
          type="button"
          onClick={handleAddSemester}
          className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold"
        >
          <Plus size={14} /> Add another semester
        </button>
      </div>
    </div>
  );
}
