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
      return {
        subject:
          subject.length > 12 ? subject.substring(0, 12) + "..." : subject,
        fullSubject: subject,
        "Final Total": scaledMarks.finalTotal,
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0]?.payload?.fullSubject || label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="space-y-8">
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Final Totals (Out of 100)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="subject"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Final Total" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Internal (75) vs Lab (25) Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="subject"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Internal" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Lab" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Component-wise Performance (Percentage)
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={radarData[0] ? [radarData[0]] : []}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#9CA3AF"
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
      {}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Performance Comparison Across Subjects
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={finalTotalsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="subject"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Final Total"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: "#8B5CF6", r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Charts;
