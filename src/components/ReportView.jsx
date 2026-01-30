import React from "react";
import { Download, X } from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  getScaledMarks,
  getGrade,
  calculateGPA,
  calculateConsistencyScore,
  getConsistencyLabel,
} from "../utils/calculations";
import Charts from "./Charts";

const ReportView = ({ subjectsData, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const calculateReportStats = () => {
    let totalFinal = 0;
    let subjectCount = 0;
    let allConsistencyScores = [];

    SUBJECTS.forEach((subject) => {
      const marks = subjectsData[subject]?.marks;
      if (marks) {
        const scaled = getScaledMarks(marks);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between print:border-0">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Academic Report
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="hidden print:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Print / Save
            </button>
            <button
              onClick={onClose}
              className="hidden print:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-8 print:p-4 space-y-8 print:space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-3">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              Overall Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Avg Percentage
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {stats.overallPercentage.toFixed(1)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">GPA</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {stats.overallGPA.toFixed(2)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Subjects
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {stats.subjectCount}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-4">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Consistency
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {stats.averageConsistency.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-3">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              Subject-Wise Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      Subject
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      Final
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      %
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      Grade
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      GPA
                    </th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                      Consistency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((subject) => {
                    const marks = subjectsData[subject]?.marks;
                    const scaled = getScaledMarks(marks);
                    const percentage = scaled.finalTotal;
                    const grade = getGrade(percentage);
                    const gpa = calculateGPA(percentage);

                    const allMarks = Object.values(marks || {}).filter(
                      (m) => m !== null,
                    );
                    const consistency =
                      allMarks.length > 0 ?
                        calculateConsistencyScore(allMarks)
                      : 0;

                    return (
                      <tr
                        key={subject}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-3 text-gray-900 dark:text-white font-medium">
                          {subject}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">
                          {scaled.finalTotal.toFixed(2)}/100
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300 font-semibold">
                          {percentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300 font-bold">
                          {grade}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">
                          {gpa.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`font-semibold ${
                              consistency >= 80 ?
                                "text-green-600 dark:text-green-400"
                              : consistency >= 60 ?
                                "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {consistency.toFixed(0)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-3 print:break-inside-avoid">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              Performance Charts
            </h3>
            <div className="print:page-break-inside-avoid">
              <Charts subjectsData={subjectsData} reportMode={true} />
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 print:pb-3">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              Key Insights
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>
                • Overall academic performance stands at{" "}
                <span className="font-semibold">
                  {stats.overallPercentage.toFixed(1)}%
                </span>{" "}
                with a GPA of{" "}
                <span className="font-semibold">
                  {stats.overallGPA.toFixed(2)}
                </span>
                .
              </p>
              <p>
                • Consistency across assessments is rated at{" "}
                <span className="font-semibold">
                  {stats.averageConsistency.toFixed(0)}
                </span>
                , indicating{" "}
                {stats.averageConsistency >= 80 ?
                  "strong and stable performance"
                : stats.averageConsistency >= 60 ?
                  "moderate performance variations"
                : "significant performance variations"}{" "}
                across different subjects and assessment types.
              </p>
              <p>
                • This report was generated on{" "}
                <span className="font-semibold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 print:pt-2 border-t border-gray-200 dark:border-gray-700">
            <p>Academic Tracker • Personal Mark Management System</p>
            <p className="mt-1">Generated automatically from subject data</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
          }
          .fixed {
            position: static;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportView;
