import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Check } from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  getPlannerTasksForDate,
  addPlannerTask,
  updatePlannerTask,
  deletePlannerTask,
} from "../utils/plannerStorage";
import {
  getSyllabusForSubject,
  markTopicCompleted,
  getAllTopicsFlattened,
} from "../utils/syllabusStorage";

const PlannerDayModal = ({ dateKey, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [priority, setPriority] = useState("medium");
  const [availableTopics, setAvailableTopics] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadTasks();
    updateAvailableTopics();
  }, [dateKey]);

  useEffect(() => {
    updateAvailableTopics();
    setSelectedTopic("");
  }, [selectedSubject]);

  const loadTasks = () => {
    const tasksForDate = getPlannerTasksForDate(dateKey);
    setTasks(tasksForDate);
  };

  const updateAvailableTopics = () => {
    const syllabus = getSyllabusForSubject(selectedSubject, SUBJECTS);
    const allTopics = getAllTopicsFlattened(selectedSubject, SUBJECTS);
    setAvailableTopics(allTopics);
  };

  const handleAddTask = () => {
    if (!selectedTopic) return;

    const topic = availableTopics.find((t) => t.id === selectedTopic);
    if (!topic) return;

    const newTask = addPlannerTask(dateKey, {
      subject: selectedSubject,
      topicId: selectedTopic,
      topicName: topic.name,
      estimatedMinutes,
      priority,
      completed: false,
    });

    if (newTask) {
      setTasks([...tasks, newTask]);
      setSelectedTopic("");
      setEstimatedMinutes(60);
      setPriority("medium");
      setShowAddForm(false);
    }
  };

  const handleToggleCompleted = (taskId, currentState) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updatePlannerTask(dateKey, taskId, { completed: !currentState });

    if (!currentState) {
      markTopicCompleted(task.subject, task.topicId, true);
    }

    loadTasks();
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Delete this task?")) {
      deletePlannerTask(dateKey, taskId);
      loadTasks();
    }
  };

  const formatDate = () => {
    const date = new Date(dateKey);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalEstimatedTime = tasks.reduce(
    (sum, task) => sum + task.estimatedMinutes,
    0,
  );
  const completedCount = tasks.filter((t) => t.completed).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const uniqueSubjectsInTasks = [...new Set(tasks.map((t) => t.subject))];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDate()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {completedCount}/{tasks.length} tasks completed •{" "}
              {totalEstimatedTime} min
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
          {tasks.length === 0 ?
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No tasks planned for this day yet.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add First Task
              </button>
            </div>
          : <>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border-l-4 transition-all ${
                    task.completed ?
                      "bg-gray-50 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                  }`}
                >
                  <button
                    onClick={() =>
                      handleToggleCompleted(task.id, task.completed)
                    }
                    className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed ?
                        "bg-green-500 border-green-500"
                      : "border-gray-400 dark:border-gray-500 hover:border-green-500 dark:hover:border-green-400"
                    }`}
                  >
                    {task.completed && (
                      <Check size={16} className="text-white" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {task.subject}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p
                      className={`text-sm ${
                        task.completed ?
                          "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {task.topicName}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {task.estimatedMinutes} minutes
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-shrink-0 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2
                      size={18}
                      className="text-red-600 dark:text-red-400"
                    />
                  </button>
                </div>
              ))}
            </>
          }

          {showAddForm || tasks.length === 0 ?
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-600 mt-6 space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Add New Task
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic...</option>
                  {availableTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
                {availableTopics.length === 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    No topics available. Add topics in the Syllabus Manager
                    first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Time (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={estimatedMinutes}
                    onChange={(e) =>
                      setEstimatedMinutes(
                        Math.max(1, parseInt(e.target.value) || 1),
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!selectedTopic}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Task
                </button>
                {tasks.length > 0 && (
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          : <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add Another Task
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default PlannerDayModal;
