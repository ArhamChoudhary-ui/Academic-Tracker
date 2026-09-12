import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GraduationCap, Plus, RotateCcw } from "lucide-react";
import {
  calculateOverall,
  createEmptySubject,
} from "../utils/creditCalculator";
import CreditSummaryStats from "./credit/CreditSummaryStats";
import CreditSubjectCard from "./credit/CreditSubjectCard";

const STORAGE_KEY = "academic_tracker_credit_calculator";

// TODO: Add support for exporting credit GPA forecast to PDF report
// FIXME: Ensure localStorage quotas don't silently fail on Safari private mode

const sampleSubjects = () => [
  createEmptySubject({ name: "Mathematics", theoryCredits: 4, labCredits: 0 }),
  createEmptySubject({
    name: "Programming with Lab",
    theoryCredits: 3,
    labCredits: 1,
  }),
  createEmptySubject({ name: "Physics Lab", theoryCredits: 0, labCredits: 1 }),
];

const loadSubjects = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleSubjects();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return sampleSubjects();
    return parsed.map((subject) => ({
      ...createEmptySubject(),
      ...subject,
      marks: {
        ...createEmptySubject().marks,
        ...(subject.marks || {}),
      },
    }));
  } catch {
    return sampleSubjects();
  }
};

export default function CreditCalculator() {
  const [subjects, setSubjects] = useState(loadSubjects);
  const [expandedId, setExpandedId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const nameRefs = useRef({});

  const overall = useMemo(() => calculateOverall(subjects), [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch {
      // Storage unavailable or disabled
    }
  }, [subjects]);

  useEffect(() => {
    if (focusId) {
      nameRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, subjects]);

  const addSubject = () => {
    const newSubject = createEmptySubject();
    setSubjects((prev) => [...prev, newSubject]);
    setExpandedId(newSubject.id);
    setFocusId(newSubject.id);
  };

  const updateSubject = (id, patch) =>
    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === id ? { ...subject, ...patch } : subject,
      ),
    );

  const removeSubject = (id) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  const clearAll = () => {
    if (
      window.confirm(
        "Remove all subjects from the credit calculator? This cannot be undone.",
      )
    ) {
      setSubjects([]);
      setExpandedId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formula banner */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/60">
        <span className="font-semibold text-white/80">Final Grade</span> =
        Theory Score % × (Theory Credits ÷ Total Credits) + Lab Score % × (Lab
        Credits ÷ Total Credits)
      </div>

      {/* Overall stats */}
      <CreditSummaryStats overall={overall} subjectCount={subjects.length} />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-white tracking-tight">
          Subjects
        </h3>
        <div className="flex items-center gap-2">
          {subjects.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
            >
              <RotateCcw size={14} />
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={addSubject}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            <Plus size={16} />
            Add Subject
          </button>
        </div>
      </div>

      {/* Subject list */}
      {subjects.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {subjects.map((subject) => (
              <CreditSubjectCard
                key={subject.id}
                subject={subject}
                expanded={expandedId === subject.id}
                onToggle={() =>
                  setExpandedId((prev) =>
                    prev === subject.id ? null : subject.id,
                  )
                }
                onChange={updateSubject}
                onRemove={removeSubject}
                nameRef={(el) => {
                  nameRefs.current[subject.id] = el;
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-2xl">
          <GraduationCap size={40} className="mx-auto text-white/30 mb-4" />
          <p className="text-lg font-semibold text-white/80 mb-1">
            No subjects yet
          </p>
          <p className="text-sm text-white/50 mb-6">
            Add a subject to start calculating credit-weighted grades.
          </p>
          <button
            type="button"
            onClick={addSubject}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            <Plus size={16} />
            Add your first subject
          </button>
        </div>
      )}

      {/* Add subject at bottom */}
      {subjects.length > 0 && (
        <button
          type="button"
          onClick={addSubject}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-400/50 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          <Plus size={18} />
          Add Subject
        </button>
      )}
    </div>
  );
}
