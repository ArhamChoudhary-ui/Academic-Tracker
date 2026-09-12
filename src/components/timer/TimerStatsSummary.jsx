import React from "react";
import { Clock, Target } from "lucide-react";

export default function TimerStatsSummary({ timerStats = {}, dailyStreak = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
            <p className="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
              {timerStats.totalMinutes || 0}
            </p>
          </div>
          <Clock className="text-blue-500" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
            <p className="text-3xl font-bold mt-2 text-purple-600 dark:text-purple-400">
              {timerStats.sessionCount || 0}
            </p>
          </div>
          <Target className="text-purple-500" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
            <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
              {timerStats.averageDuration || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">minutes</p>
          </div>
          <Clock className="text-green-500" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Daily Streak</p>
            <p className="text-3xl font-bold mt-2 text-orange-600 dark:text-orange-400">
              {dailyStreak}
            </p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
          <div className="text-orange-500 text-3xl">🔥</div>
        </div>
      </div>
    </div>
  );
}
