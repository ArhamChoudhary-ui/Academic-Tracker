import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
} from "lucide-react";
import {
  DEFAULT_INTERNAL_STRUCTURE,
  INTERNAL_PRESETS,
  getSubjectInternals,
  saveSubjectInternals,
  applyInternalsToAllSubjects,
  resetSubjectInternals,
  getTotalInternalMax,
} from "../utils/internalsManager";

export default function InternalsManager({
  subjectsData = {},
  onOpenAddSubject,
  onStructureUpdated,
}) {
  const subjectsList = Object.keys(subjectsData || {});
  const [activeSubject, setActiveSubject] = useState(subjectsList[0] || "");
  const [currentTasks, setCurrentTasks] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    if (!activeSubject && subjectsList.length > 0) {
      setActiveSubject(subjectsList[0]);
    } else if (activeSubject && !subjectsList.includes(activeSubject)) {
      setActiveSubject(subjectsList[0] || "");
    }
  }, [subjectsList, activeSubject]);

  useEffect(() => {
    if (activeSubject) {
      setCurrentTasks(getSubjectInternals(activeSubject));
    }
  }, [activeSubject]);

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleTaskChange = (index, field, value) => {
    setCurrentTasks((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "max" ? Math.max(1, Number(value) || 0) : value,
      };
      return updated;
    });
  };

  const handleAddTask = () => {
    const nextNumber = currentTasks.length + 1;
    const newTask = {
      id: `task_${Date.now().toString(36)}`,
      label: `Task ${nextNumber}`,
      max: 10,
    };
    setCurrentTasks((prev) => [...prev, newTask]);
  };

  const handleRemoveTask = (index) => {
    if (currentTasks.length <= 1) {
      alert("Each subject must have at least one internal assessment task.");
      return;
    }
    setCurrentTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyPreset = (preset) => {
    const cloned = preset.tasks.map((t) => ({ ...t }));
    setCurrentTasks(cloned);
    saveSubjectInternals(activeSubject, cloned);
    onStructureUpdated?.();
    showFeedback(`Applied "${preset.name}" preset!`);
  };

  const handleSaveCurrent = () => {
    if (currentTasks.length === 0) {
      alert("Please add at least one internal task.");
      return;
    }
    saveSubjectInternals(activeSubject, currentTasks);
    onStructureUpdated?.();
    showFeedback(`Saved internal assessment structure for ${activeSubject}!`);
  };

  const handleApplyToAll = () => {
    if (subjectsList.length <= 1) {
      handleSaveCurrent();
      return;
    }
    if (
      window.confirm(
        `Apply this internal structure (${currentTasks.map((t) => `${t.label} [${t.max}]`).join(", ")}) to all ${subjectsList.length} subjects?`,
      )
    ) {
      applyInternalsToAllSubjects(currentTasks, subjectsList);
      onStructureUpdated?.();
      showFeedback(`Applied structure to all ${subjectsList.length} subjects!`);
    }
  };

  const handleResetToDefault = () => {
    resetSubjectInternals(activeSubject);
    setCurrentTasks([...DEFAULT_INTERNAL_STRUCTURE]);
    onStructureUpdated?.();
    showFeedback(`Reset ${activeSubject} to default three 10-mark quizzes.`);
  };

  if (subjectsList.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white mb-2">
            Internal Assessments
          </h2>
          <p className="text-white/60">
            Dynamically customise quizzes, assignments, case studies, and projects per subject.
          </p>
        </div>
        <div className="text-center py-20 border border-dashed border-white/20 rounded-2xl space-y-5 bg-white/5 backdrop-blur-sm">
          <BookOpen size={48} className="mx-auto text-white/25" />
          <div>
            <p className="text-2xl font-bold text-white/80">No subjects enrolled</p>
            <p className="text-sm text-white/50 mt-2">
              Add subjects to your dashboard first to customise internal assessment formats.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAddSubject}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200"
          >
            <Plus size={18} />
            Add Subject
          </button>
        </div>
      </div>
    );
  }

  const totalMarks = getTotalInternalMax(currentTasks);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Layers className="text-blue-400" size={32} />
            Internal Assessments
          </h2>
          <p className="text-white/60 text-sm">
            Default internal structure is three 10-mark quizzes (10-10-10 = 30 marks). Tailor each subject to case studies, term projects, or custom assignments below.
          </p>
        </div>

        {feedbackMessage && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold animate-fade-in">
            <Check size={16} />
            {feedbackMessage}
          </div>
        )}
      </div>

      {/* Subject Pill Selector */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-3">
          Select Subject to Configure
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {subjectsList.map((subject) => {
            const isSelected = subject === activeSubject;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Configuration Card for Active Subject */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {activeSubject}
            </h3>
            <p className="text-xs text-white/50 mt-1">
              {currentTasks.length} internal assessment component{currentTasks.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                totalMarks === 30
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                  : "bg-blue-500/20 text-blue-200 border-blue-400/30"
              }`}
            >
              Total: {totalMarks} Marks
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            Quick Assessment Presets
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INTERNAL_PRESETS.map((preset) => {
              const isMatch =
                currentTasks.length === preset.tasks.length &&
                currentTasks.every(
                  (t, i) =>
                    t.max === preset.tasks[i]?.max &&
                    t.label.toLowerCase() === preset.tasks[i]?.label.toLowerCase(),
                );

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isMatch
                      ? "bg-blue-500/20 border-blue-400/50 shadow-sm"
                      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <p className="text-sm font-bold text-white mb-1">
                    {preset.name}
                  </p>
                  <p className="text-xs text-white/50">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editable Task Rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
              Assessment Tasks Breakdown
            </h4>
            <button
              type="button"
              onClick={handleAddTask}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>

          <div className="space-y-3">
            {currentTasks.map((task, idx) => (
              <div
                key={task.id || idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/70 text-xs font-bold shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-[150px]">
                  <input
                    type="text"
                    value={task.label}
                    onChange={(e) => handleTaskChange(idx, "label", e.target.value)}
                    placeholder="e.g. Case Study, Quiz, Mini Project"
                    className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="w-32 shrink-0">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={task.max}
                      onChange={(e) => handleTaskChange(idx, "max", e.target.value)}
                      className="w-full px-3 py-2 pr-12 bg-white/10 border border-white/10 rounded-lg text-white font-semibold text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-white/40 pointer-events-none font-medium">
                      pts
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveTask(idx)}
                  className="p-2 text-white/40 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                  title="Remove task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSaveCurrent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all duration-200"
            >
              <Check size={16} />
              Save Structure
            </button>

            <button
              type="button"
              onClick={handleApplyToAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-sm font-semibold transition-colors"
              title="Apply this exact assessment structure to all enrolled subjects"
            >
              <Copy size={16} />
              Apply to All Subjects
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/50 hover:text-amber-300 transition-colors"
            title="Reset to three 10-mark quizzes (10-10-10)"
          >
            <RotateCcw size={14} />
            Reset to 10-10-10 Default
          </button>
        </div>
      </div>
    </div>
  );
}
