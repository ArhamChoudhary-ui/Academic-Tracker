import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Calculator, X } from "lucide-react";
import { getScaledMarks } from "../utils/calculations";
import { SUBJECTS, getSubjectWeightage } from "../utils/data";

export default function GoalCalculator({ subjectsData, onClose }) {
  const [targetPercentage, setTargetPercentage] = useState(94);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateRequiredMarks();
  }, [targetPercentage, selectedSubject]);

  const calculateRequiredMarks = () => {
    const subjectData = subjectsData[selectedSubject];
    const marks = subjectData?.marks || {};
    const scaled = getScaledMarks(marks, selectedSubject);
    const weightage = getSubjectWeightage(selectedSubject);

    // Current progress
    const currentTotal = scaled.finalTotal;
    const targetTotal = targetPercentage;
    const remaining = targetTotal - currentTotal;

    // Check what's already completed
    const hasCAT1 = marks.cat1 !== null && marks.cat1 !== undefined;
    const hasCAT2 = marks.cat2 !== null && marks.cat2 !== undefined;
    const hasQuiz1 = marks.quiz1 !== null && marks.quiz1 !== undefined;
    const hasQuiz2 = marks.quiz2 !== null && marks.quiz2 !== undefined;
    const hasQuiz3 = marks.quiz3 !== null && marks.quiz3 !== undefined;
    const hasFAT = marks.fat !== null && marks.fat !== undefined;
    const hasLAB = marks.lab !== null && marks.lab !== undefined;

    // Calculate remaining components and their max contribution
    let remainingComponents = [];

    if (!hasCAT1)
      remainingComponents.push({ name: "CAT-1", max: 50, scaledMax: 15 });
    if (!hasCAT2)
      remainingComponents.push({ name: "CAT-2", max: 50, scaledMax: 15 });
    if (!hasQuiz1)
      remainingComponents.push({ name: "QUIZ-1", max: 10, scaledMax: 10 });
    if (!hasQuiz2)
      remainingComponents.push({ name: "QUIZ-2", max: 10, scaledMax: 10 });
    if (!hasQuiz3)
      remainingComponents.push({ name: "QUIZ-3", max: 10, scaledMax: 10 });
    if (!hasFAT)
      remainingComponents.push({ name: "FAT", max: 100, scaledMax: 40 });
    if (!hasLAB)
      remainingComponents.push({
        name: "LAB",
        max: 100,
        scaledMax: weightage.lab,
      });

    // Calculate total possible from remaining
    const totalPossibleFromRemaining = remainingComponents.reduce(
      (sum, comp) => sum + comp.scaledMax,
      0,
    );

    // Check if target is achievable
    const isAchievable = remaining <= totalPossibleFromRemaining;

    // Calculate required marks for each remaining component
    let recommendations = [];

    if (remainingComponents.length === 0) {
      setResults({
        currentTotal,
        targetTotal,
        remaining,
        isAchievable: false,
        message: "All assessments completed!",
        recommendations: [],
      });
      return;
    }

    if (isAchievable) {
      // Strategy: Distribute required marks proportionally
      const distribution = remaining / totalPossibleFromRemaining;

      remainingComponents.forEach((comp) => {
        const requiredScaled = comp.scaledMax * distribution;
        let requiredRaw;

        if (comp.name.startsWith("CAT")) {
          requiredRaw = (requiredScaled / 15) * 50;
        } else if (comp.name === "FAT") {
          requiredRaw = (requiredScaled / 40) * 100;
        } else if (comp.name === "LAB") {
          requiredRaw =
            weightage.lab > 0 ? (requiredScaled / weightage.lab) * 100 : 0;
        } else {
          // Quiz
          requiredRaw = requiredScaled;
        }

        recommendations.push({
          component: comp.name,
          requiredRaw: Math.min(requiredRaw, comp.max),
          maxRaw: comp.max,
          percentage: (requiredRaw / comp.max) * 100,
        });
      });
    } else {
      // Calculate maximum achievable
      const maxAchievable = currentTotal + totalPossibleFromRemaining;
      setResults({
        currentTotal,
        targetTotal,
        remaining,
        isAchievable: false,
        maxAchievable,
        message: `Target not achievable. Maximum possible: ${maxAchievable.toFixed(1)}%`,
        recommendations: [],
      });
      return;
    }

    setResults({
      currentTotal,
      targetTotal,
      remaining,
      isAchievable,
      recommendations,
      message: `You need ${remaining.toFixed(1)} more marks to reach your goal!`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gradient-to-br from-blue-700 to-blue-800 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-br from-blue-700 to-blue-800 border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Target size={24} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Goal Calculator</h2>
              <p className="text-sm text-white/60">
                Calculate required marks to achieve your target
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Target Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={targetPercentage}
                  onChange={(e) =>
                    setTargetPercentage(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                  %
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject} className="bg-blue-900">
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-4">
              {/* Current Status */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-xs text-white/60 mb-1">Current</p>
                  <p className="text-2xl font-bold text-white">
                    {results.currentTotal.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-xs text-white/60 mb-1">Target</p>
                  <p className="text-2xl font-bold text-blue-300">
                    {results.targetTotal.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                  <p className="text-xs text-white/60 mb-1">Gap</p>
                  <p
                    className={`text-2xl font-bold ${results.remaining > 0 ? "text-yellow-300" : "text-emerald-300"}`}
                  >
                    {results.remaining > 0 ? "+" : ""}
                    {results.remaining.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div
                className={`border rounded-lg p-4 ${
                  results.isAchievable ?
                    "bg-emerald-500/20 border-emerald-500/50"
                  : "bg-red-500/20 border-red-500/50"
                }`}
              >
                <p
                  className={`text-sm font-medium ${results.isAchievable ? "text-emerald-200" : "text-red-200"}`}
                >
                  {results.message}
                </p>
                {!results.isAchievable && results.maxAchievable && (
                  <p className="text-xs text-white/60 mt-1">
                    With perfect scores, you can reach{" "}
                    {results.maxAchievable.toFixed(1)}%
                  </p>
                )}
              </div>

              {/* Recommendations */}
              {results.isAchievable && results.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Calculator size={20} />
                    Required Marks
                  </h3>
                  <div className="space-y-3">
                    {results.recommendations.map((rec, index) => {
                      // Calculate scaled contribution
                      let scaledContribution;
                      let scalingInfo;

                      if (rec.component.startsWith("CAT")) {
                        scaledContribution = (rec.requiredRaw / 50) * 15;
                        scalingInfo = "Scaled to 15% (out of 50)";
                      } else if (rec.component === "FAT") {
                        scaledContribution = (rec.requiredRaw / 100) * 40;
                        scalingInfo = "Scaled to 40% (out of 100)";
                      } else if (rec.component === "LAB") {
                        scaledContribution =
                          (rec.requiredRaw / 100) * weightage.lab;
                        scalingInfo = `Scaled to ${weightage.lab}% (out of 100)`;
                      } else {
                        // Quiz
                        scaledContribution = rec.requiredRaw;
                        scalingInfo = "Direct contribution (out of 10)";
                      }

                      return (
                        <div
                          key={index}
                          className="bg-white/10 border border-white/20 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-white">
                              {rec.component}
                            </span>
                            <span className="text-sm text-white/60">
                              out of {rec.maxRaw}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(rec.percentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-lg font-bold text-blue-300 min-w-[80px] text-right">
                              {rec.requiredRaw.toFixed(1)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-white/50">
                              {rec.percentage.toFixed(0)}% of maximum
                            </p>
                            <p className="text-xs text-emerald-300">
                              ✓ {scalingInfo}
                            </p>
                            <p className="text-xs text-blue-300 font-semibold">
                              Contributes {scaledContribution.toFixed(1)} marks
                              to final total
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="text-blue-300 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Pro Tip</h4>
                <p className="text-sm text-white/70">
                  Focus on high-weightage assessments like FAT (40 marks) and
                  LAB ({weightage.lab} marks) to maximize your score
                  efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
