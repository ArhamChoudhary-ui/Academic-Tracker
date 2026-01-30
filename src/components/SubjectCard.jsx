import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calculator,
  Save,
  TrendingUp,
} from "lucide-react";
import { ASSESSMENT_COMPONENTS } from "../utils/data";
import { getScaledMarks, predictFAT } from "../utils/calculations";
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
  const getPercentageColor = (pct) => {
    if (pct >= 80) return "text-green-600 dark:text-green-400";
    if (pct >= 60) return "text-blue-600 dark:text-blue-400";
    if (pct >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      {}
      <div
        className="p-6 cursor-pointer flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="text-xl font-bold">{subject}</h3>
          <div className="flex gap-4 mt-2 text-sm">
            <span>Final: {finalTotal.toFixed(2)}/100</span>
            <span className="font-semibold">{percentage.toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Save changes"
          >
            <Save size={20} />
          </button>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>
      {}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Original Marks
              </h4>
              <button
                onClick={() => setShowClassAverage(!showClassAverage)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showClassAverage ? "Hide" : "Show"} Class Average
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ASSESSMENT_COMPONENTS.map(({ key, label, max }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    <span className="text-xs text-gray-500 ml-1">(/{max})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={max}
                    step="0.5"
                    value={marks[key] === null ? "" : marks[key]}
                    onChange={(e) => handleMarkChange(key, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={`Out of ${max}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {}
          {showClassAverage && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Class Average Marks
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ASSESSMENT_COMPONENTS.map(({ key, label, max }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {label}
                      <span className="text-xs text-gray-500 ml-1">
                        (/{max})
                      </span>
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder={`Class avg`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Scaled Marks (University System)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  CAT-1 Scaled
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {scaledMarks.cat1.toFixed(2)}/15
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  CAT-2 Scaled
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {scaledMarks.cat2.toFixed(2)}/15
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  FAT Scaled
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {scaledMarks.fat.toFixed(2)}/40
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  LAB Scaled
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {scaledMarks.lab.toFixed(2)}/25
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Internal Total (Scaled)
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {scaledMarks.scaledInternal.toFixed(2)}/75
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Final Total
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {finalTotal.toFixed(2)}/100
                </p>
              </div>
            </div>
          </div>
          {}
          {showClassAverage && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                My Performance vs Class Average
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Internal (Scaled)
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {scaledMarks.scaledInternal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {classScaledMarks.scaledInternal.toFixed(2)}
                    </p>
                  </div>
                  <p
                    className={`text-sm mt-2 font-semibold ${scaledMarks.scaledInternal - classScaledMarks.scaledInternal >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {scaledMarks.scaledInternal -
                      classScaledMarks.scaledInternal >=
                    0
                      ? "+"
                      : ""}
                    {(
                      scaledMarks.scaledInternal -
                      classScaledMarks.scaledInternal
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    LAB (Scaled)
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {scaledMarks.lab.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {classScaledMarks.lab.toFixed(2)}
                    </p>
                  </div>
                  <p
                    className={`text-sm mt-2 font-semibold ${scaledMarks.lab - classScaledMarks.lab >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {scaledMarks.lab - classScaledMarks.lab >= 0 ? "+" : ""}
                    {(scaledMarks.lab - classScaledMarks.lab).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-300 dark:border-green-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Final Total
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {finalTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {classScaledMarks.finalTotal.toFixed(2)}
                    </p>
                  </div>
                  <p
                    className={`text-sm mt-2 font-semibold ${finalTotal - classScaledMarks.finalTotal >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {finalTotal - classScaledMarks.finalTotal >= 0 ? "+" : ""}
                    {(finalTotal - classScaledMarks.finalTotal).toFixed(2)}{" "}
                    points
                  </p>
                </div>
              </div>
            </div>
          )}
          {}
          {showPrediction && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Calculator size={18} />
                    Predicted FAT Score
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Based on CAT and Quiz performance trends
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {prediction.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    out of 100
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPrediction(!showPrediction)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Calculator size={18} />
              {showPrediction ? "Hide" : "Show"} Prediction
            </button>
          </div>
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Add notes, goals, or reminders for this subject..."
            />
          </div>
          {}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};
export default SubjectCard;
