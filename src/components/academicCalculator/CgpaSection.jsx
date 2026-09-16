import React, { useMemo } from "react";
import { Plus, Trash2, RotateCcw, GraduationCap, Award } from "lucide-react";
import {
  calculateCGPA,
  validateSemester,
} from "../../utils/academicCalculator";

export default function CgpaSection({
  semesters,
  onSemestersChange,
  onReset,
}) {
  // Live credit-weighted calculation
  const result = useMemo(() => calculateCGPA(semesters), [semesters]);

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
            Calculate your cumulative GPA. Fully credit-weighted across all completed semesters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Reset to default 8 semesters"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddSemester}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Plus size={15} />
            Add Semester
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
                {result.isValid ? result.cgpaFormatted : "0.00"}
              </span>
              <span className="text-sm font-semibold text-white/50">/ 10.00</span>
            </div>
            <p className="text-xs text-white/60">
              {result.isValid
                ? "Credit-weighted formula: Σ(Semester GPA × Semester Credits) ÷ Total Credits"
                : "Enter semester GPA and credits below to compute cumulative standing"}
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/10 rounded-xl px-5 py-2.5 text-center flex-1 sm:flex-initial">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Total Credits</p>
              <p className="text-xl font-bold text-white mt-0.5">{result.totalCredits}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-xl px-5 py-2.5 text-center flex-1 sm:flex-initial">
              <p className="text-[11px] font-semibold text-white/60 uppercase">Semesters</p>
              <p className="text-xl font-bold text-white mt-0.5">{result.validSemestersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Breakdown */}
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
