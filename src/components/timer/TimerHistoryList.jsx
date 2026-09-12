import React from "react";
import { formatTime } from "../../utils/timerStorage";

export default function TimerHistoryList({
  sessions = [],
  selectedSubject,
  onDeleteSession,
}) {
  if (sessions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Recent Sessions — {selectedSubject}
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions
          .slice()
          .reverse()
          .map((session, idx) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    #{sessions.length - idx}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(session.durationSeconds)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.completedTarget ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ Target Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        Target: {formatTime(session.targetSeconds)}
                      </span>
                    )}
                  </span>
                  {session.focusRating && (
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Focus: {session.focusRating}/5
                    </span>
                  )}
                </div>
                {session.notes && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {session.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(session.createdAt).toLocaleDateString()} at{" "}
                  {new Date(session.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteSession(session.id)}
                className="ml-4 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
