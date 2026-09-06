import React, { useEffect } from "react";
import { Download, X } from "lucide-react";
import {
  getScaledMarks,
  getGrade,
  calculateGPA,
  calculateConsistencyScore,
} from "../utils/calculations";
import Charts from "./Charts";

const ReportView = ({ subjectsData, onClose }) => {
  const subjects = Object.keys(subjectsData || {});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const calculateReportStats = () => {
    let totalFinal = 0;
    let subjectCount = 0;
    let allConsistencyScores = [];

    subjects.forEach((subject) => {
      const marks = subjectsData[subject]?.marks;
      if (marks) {
        const scaled = getScaledMarks(marks, subject);
        totalFinal += scaled.finalTotal || 0;
        subjectCount += 1;

        const allMarks = Object.values(marks).filter((m) => m !== null);
        if (allMarks.length > 0) {
          const consistency = calculateConsistencyScore(allMarks);
          allConsistencyScores.push(consistency);
        }
      }
    });

    const overallPercentage = subjectCount > 0 ? totalFinal / subjectCount : 0;
    const overallGPA = calculateGPA(overallPercentage);
    const averageConsistency =
      allConsistencyScores.length > 0 ?
        allConsistencyScores.reduce((a, b) => a + b, 0) /
        allConsistencyScores.length
      : 0;

    return {
      overallPercentage,
      overallGPA,
      subjectCount,
      averageConsistency,
    };
  };

  const stats = calculateReportStats();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        className="bg-blue-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-blue-700 border-b border-white/20 p-8 flex items-center justify-between print:border-0 print:bg-white print:text-black">
          <h2 id="report-title" className="text-3xl font-bold text-white">
            Academic Report
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="hidden print:hidden flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Download size={18} />
              Print / Save
            </button>
            <button
              onClick={onClose}
              aria-label="Close report"
              title="Press Escape to close"
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 print:p-4 space-y-12 print:space-y-6">
          {/* Overall Stats */}
          <div className="border-b border-white/20 pb-8">
            <h3 className="text-xl font-bold text-white mb-8">
              Overall Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="border-b border-white/20 pb-4">
                <p className="text-sm text-white/60 mb-3">Avg Percentage</p>
                <p className="text-4xl font-bold text-blue-200">
                  {stats.overallPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="border-b border-white/20 pb-4">
                <p className="text-sm text-white/60 mb-3">GPA</p>
                <p className="text-4xl font-bold text-blue-200">
                  {stats.overallGPA.toFixed(2)}
                </p>
              </div>
              <div className="border-b border-white/20 pb-4">
                <p className="text-sm text-white/60 mb-3">Subjects</p>
                <p className="text-4xl font-bold text-blue-200">
                  {stats.subjectCount}
                </p>
              </div>
              <div className="border-b border-white/20 pb-4">
                <p className="text-sm text-white/60 mb-3">Consistency</p>
                <p className="text-4xl font-bold text-blue-200">
                  {stats.averageConsistency.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Subject Table */}
          <div className="border-b border-white/20 pb-8">
            <h3 className="text-xl font-bold text-white mb-8">
              Subject-Wise Performance
            </h3>
            <div className="space-y-3">
              {subjects.map((subject) => {
                const marks = subjectsData[subject]?.marks;
                const scaled = getScaledMarks(marks, subject);
                const percentage = scaled.finalTotal;
                const grade = getGrade(percentage);
                const gpa = calculateGPA(percentage);

                const allMarks = Object.values(marks || {}).filter(
                  (m) => m !== null,
                );
                const consistency =
                  allMarks.length > 0 ? calculateConsistencyScore(allMarks) : 0;

                return (
                  <div
                    key={subject}
                    className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0"
                  >
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {subject}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                        <span>Grade: {grade}</span>
                        <span>GPA: {gpa.toFixed(2)}/10</span>
                        <span>Consistency: {consistency.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-200">
                        {percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        {scaled.finalTotal.toFixed(0)}/100
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Charts */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8">
              Performance Charts
            </h3>
            <Charts subjectsData={subjectsData} reportMode={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
