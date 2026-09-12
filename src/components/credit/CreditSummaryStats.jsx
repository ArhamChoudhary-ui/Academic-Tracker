import React from "react";
import { getGrade } from "../../utils/calculations";

export const StatCard = ({ label, value, sub, accent = "text-white" }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
    <p className={`text-3xl font-bold mt-1 tabular-nums ${accent}`}>{value}</p>
    <p className="text-xs text-white/40 mt-1">{sub}</p>
  </div>
);

export default function CreditSummaryStats({ overall, subjectCount }) {
  const hasScores = overall.entered > 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Overall Weighted"
        value={hasScores ? `${overall.overallPct.toFixed(1)}%` : "—"}
        accent="text-blue-200"
        sub={
          hasScores
            ? `Grade ${getGrade(overall.overallPct)}`
            : "Enter marks to calculate"
        }
      />
      <StatCard
        label="Cumulative GPA"
        value={hasScores ? overall.cgpa.toFixed(2) : "—"}
        accent="text-emerald-200"
        sub="10.0 scale"
      />
      <StatCard
        label="Total Credits"
        value={overall.totalCredits}
        sub={`across ${subjectCount} subject${subjectCount === 1 ? "" : "s"}`}
      />
      <StatCard
        label="Subjects"
        value={subjectCount}
        accent="text-purple-200"
        sub="dynamically managed"
      />
    </div>
  );
}
