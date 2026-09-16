import React from "react";
import { BookOpen, Info, Check, AlertTriangle } from "lucide-react";
import { GRADE_POINTS } from "../../utils/academicCalculator";

const GRADE_TABLE = [
  { grade: "S", point: 10, performance: "Outstanding" },
  { grade: "A", point: 9, performance: "Excellent" },
  { grade: "B", point: 8, performance: "Very Good" },
  { grade: "C", point: 7, performance: "Good" },
  { grade: "D", point: 6, performance: "Fair" },
  { grade: "E", point: 5, performance: "Pass" },
  { grade: "F", point: 0, performance: "Fail" },
];

export default function VitGradingInfoSection() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-8">
      {/* Title */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="text-blue-400" size={22} />
          How VIT GPA / CGPA Works
        </h3>
        <p className="text-xs text-white/60 mt-1">
          Understanding the credit-weighted grading methodology and grade-point scale.
        </p>
      </div>

      {/* Formulas & Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* GPA Formula Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Semester GPA Formula
            </span>
            <span className="text-[11px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded">
              Course Level
            </span>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-lg p-4 font-mono text-center text-sm text-blue-200">
            GPA = Σ(Credit × Grade Point) / Σ(Credits)
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Each course credit is multiplied by the numerical grade point earned. The sum of all grade points is then divided by the total registered credits for that semester.
          </p>
        </div>

        {/* CGPA Formula Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Cumulative CGPA Formula
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded">
              Program Level
            </span>
          </div>
          <div className="bg-slate-900/60 border border-white/10 rounded-lg p-4 font-mono text-center text-sm text-emerald-200">
            CGPA = Σ(Semester GPA × Semester Credits) / Σ(Semester Credits)
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            <strong>Credit-weighted:</strong> Semesters with higher credit loads contribute proportionally more to your final CGPA. A simple average of semester GPAs is mathematically incorrect unless credit totals are identical.
          </p>
        </div>
      </div>

      {/* Grade Scale Table & Non-Performance Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scale Table */}
        <div className="lg:col-span-8 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 uppercase">
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Grade Points</th>
                <th className="py-2.5 px-3">Academic Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {GRADE_TABLE.map((row) => (
                <tr key={row.grade} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-300">{row.point}</td>
                  <td className="py-2.5 px-3 text-white/70">{row.performance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Information Callout */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-xs text-white/70">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Info size={16} />
            <span>Non-Point Grades</span>
          </div>
          <p className="leading-relaxed">
            Grades such as <strong>W</strong> (Withdrawal), <strong>U</strong> (Audit), <strong>P</strong> (Pass without grade), and <strong>Y</strong> (Incomplete) do not carry grade points and do not affect GPA/CGPA calculations.
          </p>
          <div className="border-t border-white/10 pt-2 text-[11px] text-white/50">
            * Official transcript policies (re-registration, grade improvement, or course substitution) depend on university academic regulations.
          </div>
        </div>
      </div>
    </div>
  );
}
