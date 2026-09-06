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
    if (focus >= 4) return "text-emerald-300";
    if (focus >= 3) return "text-blue-300";
    return "text-yellow-300";
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Study Sessions</h2>
          <p className="text-white/60">Track your study time and focus</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
        >
          <Plus size={20} />
          New Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Log Study Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
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
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
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
              <div className="text-center text-sm text-white/60 mt-2">
                Level:{" "}
                <span className="font-semibold text-white">
                  {formData.focus}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/70 mb-3">
                Note (optional)
              </label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="e.g., Covered arrays and sorting"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold placeholder:text-white/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddSession}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
            >
              Save Session
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] transition-all duration-200"
            >
              <h3 className="font-bold text-white mb-4 truncate text-lg">
                {subject}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">
                    <Clock size={16} className="inline mr-2" />
                    Total Time
                  </span>
                  <span className="font-semibold text-white">
                    {formatDuration(stats.totalMinutes)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60">Sessions</span>
                  <span className="font-semibold text-white">
                    {stats.sessionCount}
                  </span>
                </div>

                {stats.sessionCount > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Avg Duration</span>
                      <span className="font-semibold text-white">
                        {formatDuration(Math.round(stats.averageDuration))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/60">
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
          <h3 className="text-xl font-bold text-white mb-6">Recent Sessions</h3>
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
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/[0.08] transition-all duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        {session.subject}
                      </p>
                      <p className="text-sm text-white/60 mt-1">
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
                        <p className="text-xs text-white/50 mt-2">
                          {session.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="p-2 hover:bg-red-500/20 text-red-300 rounded-lg transition-colors"
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
        <div className="text-center py-16 text-white/50">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p>No study sessions logged yet. Start tracking your study time!</p>
        </div>
      )}
    </div>
  );
};

export default StudyTracker;
