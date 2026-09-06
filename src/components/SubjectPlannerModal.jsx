import React, { useState, useEffect, useCallback, memo } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import {
  getPlansForDate,
  addPlanToDate,
  removePlanFromDate,
} from "../utils/subjectPlannerStorage";
import { SUBJECTS } from "../utils/data";

const COLORS = [
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Purple", value: "purple" },
  { name: "Red", value: "red" },
  { name: "Yellow", value: "yellow" },
  { name: "Orange", value: "orange" },
];

const SubjectPlannerModal = ({ dateKey, onClose }) => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    subject: SUBJECTS[0],
    note: "",
    color: "blue",
  });

  const loadPlans = useCallback(() => {
    const existingPlans = getPlansForDate(dateKey);
    setPlans(existingPlans);
  }, [dateKey]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleAddPlan = useCallback(() => {
    if (!newPlan.subject.trim()) {
      alert("Please select a subject");
      return;
    }

    const success = addPlanToDate(dateKey, {
      subject: newPlan.subject,
      note: newPlan.note,
      color: newPlan.color,
    });

    if (success) {
      loadPlans();
      setNewPlan({
        subject: SUBJECTS[0],
        note: "",
        color: "blue",
      });
    } else {
      alert("Failed to add plan");
    }
  }, [dateKey, newPlan, loadPlans]);

  const handleDeletePlan = useCallback(
    (planId) => {
      const success = removePlanFromDate(dateKey, planId);
      if (success) {
        loadPlans();
      } else {
        alert("Failed to delete plan");
      }
    },
    [dateKey, loadPlans],
  );

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-600",
    green:
      "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-300 dark:border-green-600",
    purple:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-600",
    red: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-600",
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600",
    orange:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-600",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Study Plans
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(dateKey)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Add New Plan
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={newPlan.subject}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, subject: e.target.value })
                }
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
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
                Note / Topic (Optional)
              </label>
              <textarea
                value={newPlan.note}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, note: e.target.value })
                }
                placeholder="e.g., Binary Trees, SQL Queries, etc."
                rows={2}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setNewPlan({ ...newPlan, color: color.value })
                    }
                    className={`
                      px-3 py-2 rounded-lg border-2 transition-all
                      ${colorClasses[color.value]}
                      ${newPlan.color === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""}
                    `}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddPlan}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Plan
            </button>
          </div>

          {plans.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Current Plans ({plans.length})
              </h3>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`
                      p-4 rounded-lg border-2 flex justify-between items-start
                      ${colorClasses[plan.color]}
                    `}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {plan.subject}
                      </div>
                      {plan.note && (
                        <div className="text-sm opacity-80 mt-1">
                          {plan.note}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="ml-4 p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                      <Trash2
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {plans.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No plans for this date yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SubjectPlannerModal);
