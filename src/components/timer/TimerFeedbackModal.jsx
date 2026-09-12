import React from "react";

const FOCUS_LABELS = {
  1: "Very Distracted",
  2: "Mostly Distracted",
  3: "Neutral",
  4: "Quite Focused",
  5: "Fully Focused",
};

export default function TimerFeedbackModal({
  focusRating,
  onFocusRatingChange,
  notes,
  onNotesChange,
  onSave,
  onDiscard,
}) {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl shadow-lg p-8 border-2 border-purple-300 dark:border-purple-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Session Complete!
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Rate Your Focus (1-5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => onFocusRatingChange(rating)}
                className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                  focusRating === rating
                    ? "bg-blue-500 text-white scale-110"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {FOCUS_LABELS[focusRating]}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="What did you study? Any challenges or wins?"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all"
          >
            Save Session
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
