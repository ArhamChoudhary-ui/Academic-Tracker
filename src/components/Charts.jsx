import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { getScaledMarks } from "../utils/calculations";

const Charts = ({ subjectsData, reportMode = false }) => {
  const finalTotalsData = Object.entries(subjectsData).map(
    ([subject, data]) => {
      const scaledMarks = getScaledMarks(data.marks);
      const hasClassAvg = Object.values(data.classAverage || {}).some(
        (value) => value !== null && value !== undefined && value !== "",
      );
      const classScaledMarks =
        hasClassAvg ? getScaledMarks(data.classAverage) : null;
      return {
        subject:
          subject.length > 12 ? subject.substring(0, 12) + "..." : subject,
        fullSubject: subject,
        "Final Total": scaledMarks.finalTotal,
        "Class Avg": classScaledMarks?.finalTotal ?? null,
        Internal: scaledMarks.scaledInternal,
        Lab: scaledMarks.lab,
      };
    },
  );
  const radarData = Object.entries(subjectsData).map(([subject, data]) => {
    const scaledMarks = getScaledMarks(data.marks);
    return {
      subject: subject.length > 10 ? subject.substring(0, 10) + "..." : subject,
      fullSubject: subject,
      "CAT-1": (scaledMarks.cat1 / 15) * 100,
      "CAT-2": (scaledMarks.cat2 / 15) * 100,
      "Quiz Avg":
        ((scaledMarks.quiz1 + scaledMarks.quiz2 + scaledMarks.quiz3) / 30) *
        100,
      FAT: (scaledMarks.fat / 40) * 100,
      LAB: (scaledMarks.lab / 25) * 100,
    };
  });
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-white/10 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-white text-sm mb-2">
            {payload[0]?.payload?.fullSubject || label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}:{" "}
              {Number.isFinite(Number(entry.value)) ?
                Number(entry.value).toFixed(2)
              : "N/A"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="space-y-8">
      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-blue-500/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Final Totals (Out of 100)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              opacity={0.2}
            />
            <XAxis
              dataKey="subject"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
            <Bar dataKey="Final Total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Class Avg" fill="#F59E0B" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-blue-500/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Internal (75) vs Lab (25) Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              opacity={0.2}
            />
            <XAxis
              dataKey="subject"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
            <Bar dataKey="Internal" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Lab" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-blue-500/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Component-wise Performance (Percentage)
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={radarData[0] ? [radarData[0]] : []}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "10px" }}
            />
            <Radar
              name="CAT-1"
              dataKey="CAT-1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
            />
            <Radar
              name="CAT-2"
              dataKey="CAT-2"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.6}
            />
            <Radar
              name="Quiz Avg"
              dataKey="Quiz Avg"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
            <Radar
              name="FAT"
              dataKey="FAT"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
            />
            <Radar
              name="LAB"
              dataKey="LAB"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
            />
            <Legend />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
          {radarData.slice(1).map((subject, index) => (
            <button
              key={index}
              className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={() => {}}
            >
              {subject.subject}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-blue-500/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Performance Comparison Across Subjects
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              opacity={0.2}
            />
            <XAxis
              dataKey="subject"
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
            <Line
              type="monotone"
              dataKey="Final Total"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 6 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Class Avg"
              stroke="#F59E0B"
              strokeWidth={3}
              strokeDasharray="6 6"
              dot={{ fill: "#F59E0B", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Charts;
