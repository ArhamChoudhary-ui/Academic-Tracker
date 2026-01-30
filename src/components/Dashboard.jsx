import React from "react";
import { TrendingUp, Award, BookOpen, Zap } from "lucide-react";
import {
  getScaledMarks,
  getGrade,
  calculateGPA,
  calculateConsistencyScore,
  getConsistencyLabel,
  getConsistencyColor,
} from "../utils/calculations";
import { SUBJECTS } from "../utils/data";

const Dashboard = ({ subjectsData }) => {
  const subjectStats = SUBJECTS.map((subject) => {
    const data = subjectsData[subject];
    const scaledMarks = getScaledMarks(data.marks);
    const finalTotal = scaledMarks.finalTotal;
    const percentage = finalTotal;

    const allMarks = Object.values(data.marks || {}).filter((m) => m !== null);
    const consistency =
      allMarks.length > 0 ? calculateConsistencyScore(allMarks) : 0;

    return {
      name: subject,
      finalTotal,
      percentage,
      grade: getGrade(percentage),
      gpa: calculateGPA(percentage),
      scaledInternal: scaledMarks.scaledInternal,
      lab: scaledMarks.lab,
      consistency,
    };
  });

  const validPercentages = subjectStats
    .filter((s) => s.percentage > 0)
    .map((s) => s.percentage);
  const overallPercentage =
    validPercentages.length > 0 ?
      validPercentages.reduce((sum, p) => sum + p, 0) / validPercentages.length
    : 0;
  const overallGPA =
    validPercentages.length > 0 ?
      subjectStats
        .filter((s) => s.percentage > 0)
        .reduce((sum, s) => sum + s.gpa, 0) / validPercentages.length
    : 0;

  const completedSubjects = subjectStats.filter((s) => s.percentage > 0);
  const bestSubject =
    completedSubjects.length > 0 ?
      completedSubjects.reduce((best, current) =>
        current.percentage > best.percentage ? current : best,
      )
    : null;
  const worstSubject =
    completedSubjects.length > 0 ?
      completedSubjects.reduce((worst, current) =>
        current.percentage < worst.percentage ? current : worst,
      )
    : null;

  const averageConsistency =
    completedSubjects.length > 0 ?
      completedSubjects.reduce((sum, s) => sum + s.consistency, 0) /
      completedSubjects.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall Percentage
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {overallPercentage.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <TrendingUp
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall GPA
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {overallGPA.toFixed(2)}/10
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Award
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subjects Completed
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {completedSubjects.length}/{SUBJECTS.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <BookOpen
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consistency Score
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${getConsistencyColor(averageConsistency)}`}
              >
                {averageConsistency.toFixed(0)}/100
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {getConsistencyLabel(averageConsistency)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Zap className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {bestSubject && worstSubject && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border-2 border-green-200 dark:border-green-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Best Performance 🏆
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {bestSubject.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {bestSubject.percentage.toFixed(2)}% • Grade: {bestSubject.grade}
            </p>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border-2 border-yellow-200 dark:border-yellow-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Needs Improvement 📚
            </h3>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {worstSubject.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {worstSubject.percentage.toFixed(2)}% • Grade:{" "}
              {worstSubject.grade}
            </p>
          </div>
        </div>
      )}
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Subject-wise Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Internal (/75)
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Lab (/25)
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Final (/100)
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Grade
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  GPA
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Consistency
                </th>
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((subject) => (
                <tr
                  key={subject.name}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                    {subject.name}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {subject.scaledInternal.toFixed(2)}
                  </td>
                  <td className="text-center py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                    {subject.lab.toFixed(2)}
                  </td>
                  <td className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {subject.finalTotal.toFixed(2)}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        subject.grade === "S" || subject.grade === "A" ?
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : subject.grade === "B" || subject.grade === "C" ?
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : subject.grade === "D" || subject.grade === "E" ?
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {subject.grade || "N/A"}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {subject.gpa.toFixed(1)}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`text-xs font-bold ${getConsistencyColor(subject.consistency)}`}
                    >
                      {subject.consistency.toFixed(0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
