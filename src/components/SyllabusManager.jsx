import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
} from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  getSyllabusForSubject,
  addTopic,
  updateTopic,
  deleteTopic,
  getSubjectProgress,
  getOverallProgress,
} from "../utils/syllabusStorage";

const SyllabusManager = () => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [syllabus, setSyllabus] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDifficulty, setNewTopicDifficulty] = useState("medium");
  const [parentId, setParentId] = useState(null);
  const [subjectProgress, setSubjectProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState({});

  useEffect(() => {
    loadSyllabus();
    updateProgress();
  }, [selectedSubject]);

  const loadSyllabus = () => {
    const data = getSyllabusForSubject(selectedSubject, SUBJECTS);
    setSyllabus(data);
  };

  const updateProgress = () => {
    const subjProgress = getSubjectProgress(selectedSubject, SUBJECTS);
    setSubjectProgress(subjProgress);

    const overall = getOverallProgress(SUBJECTS);
    setOverallProgress(overall);
  };

  const toggleExpand = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;

    addTopic(
      selectedSubject,
      {
        name: newTopicName,
        difficulty: newTopicDifficulty,
      },
      parentId,
    );

    setNewTopicName("");
    setNewTopicDifficulty("medium");
    setParentId(null);
    setShowAddTopic(false);
    loadSyllabus();
    updateProgress();
  };

  const handleToggleCompleted = (topicId, currentState) => {
    updateTopic(selectedSubject, topicId, { completed: !currentState });
    loadSyllabus();
    updateProgress();
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Delete this topic?")) {
      deleteTopic(selectedSubject, topicId);
      loadSyllabus();
      updateProgress();
    }
  };

  const handleEditTopic = (topicId, name) => {
    setEditingId(topicId);
    setEditingName(name);
  };

  const handleSaveEdit = (topicId) => {
    if (editingName.trim()) {
      updateTopic(selectedSubject, topicId, { name: editingName });
      loadSyllabus();
      setEditingId(null);
      setEditingName("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Syllabus Manager
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Define and track your course syllabus topics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Overall Progress
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {overallProgress.percentage}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {overallProgress.completed}/{overallProgress.total} topics
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {selectedSubject}
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {subjectProgress.percentage}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {subjectProgress.completed}/{subjectProgress.total} topics
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${subjectProgress.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {selectedSubject} Progress
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 pb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Subject
          </label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject ?
                    "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => {
              setShowAddTopic(true);
              setParentId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Topic
          </button>
        </div>

        {showAddTopic && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 border-2 border-blue-300 dark:border-blue-600">
            <div className="space-y-3">
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Topic name..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <select
                value={newTopicDifficulty}
                onChange={(e) => setNewTopicDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTopic}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddTopic(false);
                    setNewTopicName("");
                    setParentId(null);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {syllabus.length === 0 ?
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No topics added yet. Start by adding a topic!
            </p>
          : <TopicTree
              topics={syllabus}
              subject={selectedSubject}
              expandedTopics={expandedTopics}
              onToggleExpand={toggleExpand}
              onToggleCompleted={handleToggleCompleted}
              onDelete={handleDeleteTopic}
              onEdit={handleEditTopic}
              onSaveEdit={handleSaveEdit}
              editingId={editingId}
              editingName={editingName}
              setEditingName={setEditingName}
              onAddSubtopic={(parentId) => {
                setParentId(parentId);
                setShowAddTopic(true);
              }}
            />
          }
        </div>
      </div>
    </div>
  );
};

const TopicTree = ({
  topics,
  subject,
  expandedTopics,
  onToggleExpand,
  onToggleCompleted,
  onDelete,
  onEdit,
  onSaveEdit,
  editingId,
  editingName,
  setEditingName,
  onAddSubtopic,
}) => {
  return (
    <>
      {topics.map((topic) => (
        <div key={topic.id}>
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group">
            {topic.children && topic.children.length > 0 && (
              <button
                onClick={() => onToggleExpand(topic.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {expandedTopics.has(topic.id) ?
                  <ChevronDown
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                : <ChevronRight
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                }
              </button>
            )}
            {!topic.children?.length && <div className="w-9"></div>}

            <input
              type="checkbox"
              checked={topic.completed}
              onChange={() => onToggleCompleted(topic.id, topic.completed)}
              className="w-5 h-5 rounded cursor-pointer accent-blue-500"
            />

            {editingId === topic.id ?
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={() => onSaveEdit(topic.id)}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                >
                  <Save
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </button>
                <button
                  onClick={() => setEditingName("")}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            : <div className="flex-1">
                <span
                  className={`${
                    topic.completed ?
                      "line-through text-gray-500 dark:text-gray-400"
                    : "text-gray-900 dark:text-white"
                  }`}
                >
                  {topic.name}
                </span>
                {topic.difficulty && (
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      topic.difficulty === "easy" ?
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : topic.difficulty === "medium" ?
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                )}
              </div>
            }

            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => onEdit(topic.id, topic.name)}
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
              >
                <Edit2 size={16} className="text-blue-600 dark:text-blue-400" />
              </button>
              {topic.children && (
                <button
                  onClick={() => onAddSubtopic(topic.id)}
                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                >
                  <Plus
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </button>
              )}
              <button
                onClick={() => onDelete(topic.id)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              >
                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>

          {expandedTopics.has(topic.id) &&
            topic.children &&
            topic.children.length > 0 && (
              <div className="ml-6 border-l border-gray-200 dark:border-gray-700">
                <TopicTree
                  topics={topic.children}
                  subject={subject}
                  expandedTopics={expandedTopics}
                  onToggleExpand={onToggleExpand}
                  onToggleCompleted={onToggleCompleted}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  editingId={editingId}
                  editingName={editingName}
                  setEditingName={setEditingName}
                  onAddSubtopic={onAddSubtopic}
                />
              </div>
            )}
        </div>
      ))}
    </>
  );
};

export default SyllabusManager;
