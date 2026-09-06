import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { loadTimerSessions } from "../utils/timerStorage";
import {
  groupSessionsByDate,
  getTotalStudyTimeForDate,
  getHeatmapColor,
  getMonthMatrix,
  getMonthName,
  formatDurationForDisplay,
  getStudyStatsForDate,
  isToday,
  isCurrentMonth,
  calculateMonthStats,
} from "../utils/studyCalendar";

const StudyCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [sessions, setSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthStats, setMonthStats] = useState(null);

  useEffect(() => {
    const loadedSessions = loadTimerSessions();
    setSessions(loadedSessions);
    const grouped = groupSessionsByDate(loadedSessions);
    setGroupedSessions(grouped);
  }, []);

  useEffect(() => {
    const stats = calculateMonthStats(groupedSessions, year, month);
    setMonthStats(stats);
  }, [groupedSessions, year, month]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const monthMatrix = getMonthMatrix(year, month);
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Study Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {getMonthName(month)} {year}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Previous month"
            >
              <ChevronLeft
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Next month"
            >
              <ChevronRight
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        {monthStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Total Minutes
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {monthStats.totalMinutes}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Active Days
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {monthStats.daysWithActivity}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Daily Avg
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {monthStats.avgMinutesPerActiveDay}m
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Best Day
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {monthStats.maxDayMinutes}m
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 min-w-max">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="w-20 h-10 flex items-center justify-center font-semibold text-sm text-gray-700 dark:text-gray-300"
              >
                {label}
              </div>
            ))}

            {monthMatrix.map((week, weekIdx) =>
              week.map((dayObj, dayIdx) => {
                if (!dayObj) {
                  return (
                    <div
                      key={`empty-${weekIdx}-${dayIdx}`}
                      className="w-20 h-20"
                    ></div>
                  );
                }

                const totalSeconds = getTotalStudyTimeForDate(
                  dayObj.dateKey,
                  groupedSessions,
                );
                const colors = getHeatmapColor(totalSeconds);
                const isCurrentDay = isToday(dayObj.dateKey);
                const isCurrent = isCurrentMonth(dayObj.date, month, year);

                return (
                  <button
                    key={dayObj.dateKey}
                    onClick={() => setSelectedDate(dayObj.dateKey)}
                    className={`
                      w-20 h-20 rounded-lg flex flex-col items-center justify-center
                      transition-all duration-200 cursor-pointer font-medium
                      ${colors.bg} ${colors.text} ${colors.hover}
                      ${isCurrentDay ? `ring-2 ${colors.ring}` : ""}
                      ${!isCurrent ? "opacity-50" : ""}
                    `}
                    title={`${dayObj.day} - ${formatDurationForDisplay(totalSeconds)}`}
                  >
                    <span className="text-sm">{dayObj.day}</span>
                    <span className="text-xs opacity-75 mt-1">
                      {formatDurationForDisplay(totalSeconds)}
                    </span>
                  </button>
                );
              }),
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Intensity Scale
          </h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                No study
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 dark:bg-green-900/40"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                &lt;30 min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-300 dark:bg-green-800/60"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                30–90 min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-600 dark:bg-green-700"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                90–180 min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-900 dark:bg-green-900/80"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                &gt;180 min
              </span>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <DayDetailModal
          dateKey={selectedDate}
          groupedSessions={groupedSessions}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

const DayDetailModal = ({ dateKey, groupedSessions, onClose }) => {
  const stats = getStudyStatsForDate(dateKey, groupedSessions);

  const dateObj = new Date(dateKey + "T00:00:00");
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateString = dateObj.toLocaleDateString("en-US", dateOptions);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {dateString}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats.sessionCount} session{stats.sessionCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {stats.sessionCount === 0 ?
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No study sessions logged for this day.
              </p>
            </div>
          : <>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Total Time
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {formatDurationForDisplay(stats.totalSeconds)}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Avg Focus
                  </p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                    {stats.avgFocus ? `${stats.avgFocus}/5` : "—"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Subjects
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {stats.subjects.length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Sessions ({stats.sessions.length})
                </h4>
                {stats.sessions.map((session, idx) => {
                  const sessionTime = new Date(session.startTime);
                  const timeString = sessionTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const duration = formatDurationForDisplay(
                    session.durationSeconds,
                  );

                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {session.subject}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {timeString}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {duration}
                          </p>
                          {session.focusRating && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Focus: {session.focusRating}/5
                            </p>
                          )}
                        </div>
                      </div>

                      {session.notes && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                          "{session.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default StudyCalendar;
