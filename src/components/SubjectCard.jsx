import React, { useState } from "react";
import { ASSESSMENT_COMPONENTS } from "../utils/data";
import { getScaledMarks, predictFAT, getGrade } from "../utils/calculations";
import { ChevronDown, ChevronUp, Save } from "lucide-react";
const SubjectCard = ({ subject, subjectData, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [marks, setMarks] = useState(subjectData.marks);
  const [classAverage, setClassAverage] = useState(
    subjectData.classAverage || {},
  );
  const [notes, setNotes] = useState(subjectData.notes || "");
  const [showPrediction, setShowPrediction] = useState(false);
  const [showClassAverage, setShowClassAverage] = useState(false);
  const handleMarkChange = (component, value) => {
    const numValue = value === "" ? null : parseFloat(value);
    const updatedMarks = { ...marks, [component]: numValue };
    setMarks(updatedMarks);
  };
  const handleClassAverageChange = (component, value) => {
    const numValue = value === "" ? null : parseFloat(value);
    setClassAverage({ ...classAverage, [component]: numValue });
  };
  const handleSave = () => {
    onUpdate(subject, { marks, classAverage, notes });
  };
  const scaledMarks = getScaledMarks(marks);
  const classScaledMarks = getScaledMarks(classAverage);
  const prediction = predictFAT(marks);
  const finalTotal = scaledMarks.finalTotal;
  const percentage = finalTotal; // Already out of 100
  const grade = getGrade(percentage);
  const hasClassAvg = Object.values(classAverage || {}).some(
    (value) => value !== null && value !== undefined && value !== "",
  );
  const deltaVsClass =
    hasClassAvg ? finalTotal - classScaledMarks.finalTotal : null;

  return (
    <div
      className={`border-t border-white/10 transition-all duration-300 ${
        isExpanded ?
          "bg-black/15 backdrop-blur-sm -mx-6 px-6 py-2 rounded-xl border-white/15"
        : ""
      }`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        className={`cursor-pointer py-6 px-0 flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent transition-all duration-300 ${
          isExpanded ? "pb-4" : ""
        }`}
      >
        <div className="flex-1">
          <h3
            className={`text-2xl font-bold mb-1 transition-all duration-300 ${
              isExpanded ? "text-blue-100" : "text-white"
            }`}
          >
            {subject}
          </h3>
          <div className="flex items-center gap-6">
            <div
              className={`text-sm transition-colors duration-300 ${
                isExpanded ? "text-white/70" : "text-white/60"
              }`}
            >
              Grade: <span className="font-semibold text-white">{grade}</span>
            </div>
            {deltaVsClass !== null && (
              <div
                className={`text-sm ${
                  deltaVsClass >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {deltaVsClass >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(deltaVsClass).toFixed(1)} vs class
              </div>
            )}
          </div>
        </div>

        <div className="text-right flex items-center gap-4">
          <div
            className={`transition-transform duration-300 ${
              isExpanded ? "scale-105" : "scale-100"
            }`}
          >
            <div className="text-4xl font-bold text-blue-300">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xs text-white/50 mt-1">
              {percentage >= 80 ?
                "Excellent"
              : percentage >= 60 ?
                "Good"
              : percentage >= 40 ?
                "Fair"
              : "Needs Work"}
            </div>
          </div>
          <div
            className={`transition-all duration-300 ${
              isExpanded ? "text-blue-300" : (
                "text-white/40 group-hover:text-white/60"
              )
            }`}
          >
            {isExpanded ?
              <ChevronUp size={24} />
            : <ChevronDown size={24} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="py-8 px-0 border-t border-white/15 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Original Marks */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              Assessment Marks
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ASSESSMENT_COMPONENTS.map(({ key, label, max }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-white/70 mb-3">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={max}
                    step="0.5"
                    value={marks[key] === null ? "" : marks[key]}
                    onChange={(e) => handleMarkChange(key, e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/[0.15] border border-white/10 hover:border-white/20 rounded-lg text-white font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:border-blue-400/50 focus-visible:bg-white/[0.15]"
                    placeholder={`Out of ${max}`}
                  />
                  <p className="text-xs text-white/40 mt-2">Max: {max}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Class Average Toggle */}
          <div className="border-t border-white/10 pt-8">
            <button
              onClick={() => setShowClassAverage(!showClassAverage)}
              className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-all duration-200 hover:translate-x-0.5"
            >
              {showClassAverage ? "Hide" : "Show"} Class Average Marks
            </button>

            {showClassAverage && (
              <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ASSESSMENT_COMPONENTS.map(({ key, label, max }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-white/70 mb-3">
                        {label} (Class Avg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={max}
                        step="0.5"
                        value={
                          classAverage[key] === null ? "" : classAverage[key]
                        }
                        onChange={(e) =>
                          handleClassAverageChange(key, e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 hover:bg-white/[0.15] border border-white/10 hover:border-white/20 rounded-lg text-white font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:border-blue-400/50 focus-visible:bg-white/[0.15]"
                        placeholder={`Class average`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Scaled Marks */}
          <div className="border-t border-white/10 pt-8">
            <h4 className="text-lg font-bold text-white mb-6">
              University Scaling
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">CAT-1 Scaled</span>
                <span className="text-lg font-semibold text-white">
                  {scaledMarks.cat1.toFixed(2)} / 15
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">CAT-2 Scaled</span>
                <span className="text-lg font-semibold text-white">
                  {scaledMarks.cat2.toFixed(2)} / 15
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">FAT Scaled</span>
                <span className="text-lg font-semibold text-white">
                  {scaledMarks.fat.toFixed(2)} / 40
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">LAB Scaled</span>
                <span className="text-lg font-semibold text-white">
                  {scaledMarks.lab.toFixed(2)} / 25
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-white/10">
                <span className="font-semibold text-white">Internal Total</span>
                <span className="text-xl font-bold text-blue-300">
                  {scaledMarks.scaledInternal.toFixed(2)} / 75
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="font-bold text-lg text-white">
                  Final Total
                </span>
                <span className="text-2xl font-bold text-blue-300">
                  {finalTotal.toFixed(2)} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border-t border-white/10 pt-8">
            <h4 className="text-lg font-bold text-white mb-4">Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/[0.15] border border-white/10 hover:border-white/20 rounded-lg text-white placeholder:text-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:border-blue-400/50 focus-visible:bg-white/[0.15] resize-none"
              placeholder="Add notes, goals, or reminders for this subject..."
            />
          </div>

          {/* Prediction Toggle */}
          <div className="border-t border-white/10 pt-8">
            <button
              onClick={() => setShowPrediction(!showPrediction)}
              className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-all duration-200 hover:translate-x-0.5"
            >
              {showPrediction ? "Hide" : "Show"} FAT Prediction
            </button>

            {showPrediction && (
              <div className="mt-6">
                <div className="text-sm text-white/60 mb-3">
                  Based on CAT and Quiz performance
                </div>
                <div className="text-3xl font-bold text-blue-300">
                  {prediction.toFixed(1)} / 100
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="border-t border-white/10 pt-8">
            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-y-0"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
