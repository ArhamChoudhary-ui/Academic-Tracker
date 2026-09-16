import React, { useMemo } from "react";
import { Target, Sparkles, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { calculateRequiredGPA } from "../../utils/academicCalculator";

export default function TargetGpaSection({
  state,
  onChange,
  onAutoFill,
  canAutoFill,
}) {
  const { currentCGPA, currentCredits, upcomingCredits, targetCGPA } = state;

  const result = useMemo(() => {
    return calculateRequiredGPA(currentCGPA, currentCredits, upcomingCredits, targetCGPA);
  }, [currentCGPA, currentCredits, upcomingCredits, targetCGPA]);

  const handleChange = (field, value) => {
    onChange({
      ...state,
      [field]: value,
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="text-amber-400" size={22} />
            Target GPA / "What-If" Planning
          </h3>
          <p className="text-xs text-white/60 mt-1">
            Determine the required GPA in your remaining semesters to reach your target graduation CGPA.
          </p>
        </div>

        {canAutoFill && (
          <button
            type="button"
            onClick={onAutoFill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 transition-all"
            title="Import current CGPA and credits from CGPA calculator above"
          >
            <Sparkles size={13} />
            Auto-fill from CGPA
          </button>
        )}
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Current CGPA
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            placeholder="e.g. 8.75"
            value={currentCGPA}
            onChange={(e) => handleChange("currentCGPA", e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-label="Current CGPA"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Completed Credits
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="e.g. 44"
            value={currentCredits}
            onChange={(e) => handleChange("currentCredits", e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-label="Completed Credits"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Upcoming Credits
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            placeholder="e.g. 20"
            value={upcomingCredits}
            onChange={(e) => handleChange("upcomingCredits", e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-label="Upcoming Credits"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1.5">
            Target CGPA
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            placeholder="e.g. 9.00"
            value={targetCGPA}
            onChange={(e) => handleChange("targetCGPA", e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-label="Target CGPA"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase text-white/50">Required Target GPA</p>
          <div className="flex items-baseline justify-center sm:justify-start gap-2">
            <span
              className={`text-4xl sm:text-5xl font-black ${
                !result.isValid
                  ? "text-white/40"
                  : result.isAchievable
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {result.isValid ? result.requiredGpaFormatted : "—"}
            </span>
            {result.isValid && <span className="text-xs text-white/40">/ 10.00</span>}
          </div>
          <p className="text-xs text-white/60">
            {result.message || result.error || "Fill all 4 fields above to calculate required GPA"}
          </p>
        </div>

        {result.isValid && (
          <div className="w-full sm:w-auto">
            {result.isAchievable ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle size={16} />
                <span>Mathematically Achievable</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold">
                <AlertCircle size={16} />
                <span>Requires &gt; 10.00 (Exceeds Maximum)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
