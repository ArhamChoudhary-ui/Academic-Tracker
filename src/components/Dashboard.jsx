import React from "react";
import {
  getScaledMarks,
  getGrade,
  calculateGPA,
  calculateConsistencyScore,
} from "../utils/calculations";
import { SUBJECTS } from "../utils/data";

const Dashboard = ({ subjectsData }) => {
  const subjectStats = SUBJECTS.map((subject) => {
    const data = subjectsData[subject];
    const scaledMarks = getScaledMarks(data.marks, subject);
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
      internalMax: scaledMarks.internalMax,
      labMax: scaledMarks.labMax,
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
    <div className="space-y-12">
      {/* Key Metrics */}
      <div>
        <h3 className="text-xl font-bold text-white mb-8">
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="border-b border-white/10 pb-4">
            <div className="text-sm text-white/60 mb-3">Overall Percentage</div>
            <div className="text-4xl font-bold text-blue-300">
              {overallPercentage.toFixed(1)}%
            </div>
          </div>
          <div className="border-b border-white/10 pb-4">
            <div className="text-sm text-white/60 mb-3">Overall GPA</div>
            <div className="text-4xl font-bold text-blue-300">
              {overallGPA.toFixed(2)}/10
            </div>
          </div>
          <div className="border-b border-white/10 pb-4">
            <div className="text-sm text-white/60 mb-3">Subjects Done</div>
            <div className="text-4xl font-bold text-blue-300">
              {completedSubjects.length}/{SUBJECTS.length}
            </div>
          </div>
          <div className="border-b border-white/10 pb-4">
            <div className="text-sm text-white/60 mb-3">Consistency</div>
            <div className="text-4xl font-bold text-blue-300">
              {Math.round(averageConsistency)}%
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      {bestSubject && worstSubject && (
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold text-white mb-8">Insights</h3>
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="text-sm text-white/60 mb-2">
                  Strongest Subject
                </div>
                <div className="text-lg font-bold text-white">
                  {bestSubject.name}
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-300">
                {bestSubject.percentage.toFixed(1)}%
              </div>
            </div>
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="text-sm text-white/60 mb-2">
                  Needs Attention
                </div>
                <div className="text-lg font-bold text-white">
                  {worstSubject.name}
                </div>
              </div>
              <div className="text-3xl font-bold text-red-300">
                {worstSubject.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Breakdown Table */}
      <div className="border-t border-white/10 pt-8">
        <h3 className="text-xl font-bold text-white mb-8">Subject Breakdown</h3>
        <div className="space-y-4">
          {subjectStats.map((stat) => (
            <div
              key={stat.name}
              className="border-b border-white/10 pb-4 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white text-lg">{stat.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-white/60">
                      Grade: {stat.grade}
                    </span>
                    <span className="text-sm text-white/60">
                      GPA: {stat.gpa.toFixed(2)}/10
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-300 mb-1">
                    {stat.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-white/50">
                    {stat.finalTotal.toFixed(0)}/100
                  </div>
                </div>
              </div>
              <div className="flex gap-6 text-xs text-white/60">
                <div>
                  Internal: {stat.scaledInternal.toFixed(1)}/{stat.internalMax}
                </div>
                <div>
                  Lab: {stat.lab.toFixed(1)}/{stat.labMax}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
