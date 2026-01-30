import React, { useState, useEffect } from "react";
import { Clock, Zap, Trash2, Plus } from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  saveStudySession,
  loadAllStudySessions,
  deleteStudySession,
  getAllSubjectStats,
} from "../utils/study";

const StudyTracker = () => {
  const [sessions, setSessions] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: SUBJECTS[0],
    duration: 30,
    focus: 3,
    note: "",
  });

  useEffect(() => {
    const loadedSessions = loadAllStudySessions();
    setSessions(loadedSessions);
    const stats = getAllSubjectStats(SUBJECTS);
    setSubjectStats(stats);
  }, []);

  const handleAddSession = () => {
    if (formData.duration > 0) {
      const newSession = saveStudySession({
        subject: formData.subject,
        duration: parseInt(formData.duration),
        focus: parseInt(formData.focus),
        note: formData.note,
      });

      if (newSession) {
        setSessions([...sessions, newSession]);
        const stats = getAllSubjectStats(SUBJECTS);
        setSubjectStats(stats);
        setFormData({
          subject: SUBJECTS[0],
          duration: 30,
          focus: 3,
          note: "",
        });
        setShowForm(false);
      }
    }
  };

  const handleDeleteSession = (sessionId) => {
    if (deleteStudySession(sessionId)) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
      const stats = getAllSubjectStats(SUBJECTS);
      setSubjectStats(stats);
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getFocusColor = (focus) => {
    if (focus >= 4) return "text-green-600 dark:text-green-400";
    if (focus >= 3) return "text-blue-600 dark:text-blue-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Study Sessions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          New Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-500 dark:border-blue-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Log Study Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="480"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Focus Level (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.focus}
                onChange={(e) =>
                  setFormData({ ...formData, focus: e.target.value })
                }
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                Level: <span className="font-semibold">{formData.focus}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note (optional)
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="e.g., Covered arrays and sorting"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddSession}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Save Session
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((subject) => {
          const stats = subjectStats[subject] || {
            totalMinutes: 0,
            sessionCount: 0,
            averageFocus: 0,
            averageDuration: 0,
          };

          return (
            <div
              key={subject}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 truncate">
                {subject}
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    <Clock size={16} className="inline mr-2" />
                    Total Time
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDuration(stats.totalMinutes)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Sessions
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stats.sessionCount}
                  </span>
                </div>

                {stats.sessionCount > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg Duration
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatDuration(Math.round(stats.averageDuration))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        <Zap size={16} className="inline mr-2" />
                        Avg Focus
                      </span>
                      <span
                        className={`font-semibold ${getFocusColor(
                          stats.averageFocus,
                        )}`}
                      >
                        {stats.averageFocus}/5
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Sessions
          </h3>
          <div className="space-y-3">
            {[...sessions]
              .reverse()
              .slice(0, 10)
              .map((session) => {
                const sessionDate = new Date(session.date);
                const timeStr = sessionDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dateStr = sessionDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={session.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {session.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {timeStr} on {dateStr} •{" "}
                        {formatDuration(session.duration)}
                        {" • "}
                        <span
                          className={`font-semibold ${getFocusColor(
                            session.focus,
                          )}`}
                        >
                          Focus {session.focus}/5
                        </span>
                      </p>
                      {session.note && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {session.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No study sessions logged yet. Start tracking your study time!</p>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;
