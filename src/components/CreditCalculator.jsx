import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  GraduationCap,
  Minus,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  CREDIT_PRESETS,
  LAB_COMPONENTS,
  THEORY_COMPONENTS,
  calculateOverall,
  calculateSubject,
  createEmptySubject,
} from "../utils/creditCalculator";
import { getGrade } from "../utils/calculations";

const STORAGE_KEY = "academic_tracker_credit_calculator";

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

const gradeStyles = (grade) => {
  if (grade === "S" || grade === "A")
    return "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";
  if (grade === "B" || grade === "C")
    return "bg-blue-500/20 text-blue-200 border-blue-400/30";
  if (grade === "D" || grade === "E")
    return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  return "bg-red-500/20 text-red-200 border-red-400/30";
};

const StatCard = ({ label, value, sub, accent = "text-white" }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
    <p className={`text-3xl font-bold mt-1 tabular-nums ${accent}`}>{value}</p>
    <p className="text-xs text-white/40 mt-1">{sub}</p>
  </div>
);

const CreditStepper = ({ label, value, onStep }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-white/70 w-16">{label}</span>
    <button
      type="button"
      onClick={() => onStep(-1)}
      disabled={value <= 0}
      aria-label={`Decrease ${label} credits`}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
    >
      <Minus size={14} />
    </button>
    <span className="w-8 text-center font-bold text-lg tabular-nums">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onStep(1)}
      disabled={value >= 8}
      aria-label={`Increase ${label} credits`}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
    >
      <Plus size={14} />
    </button>
  </div>
);

const MarkField = ({ component, value, onChange }) => {
  const pct =
    value === "" || value === null || value === undefined
      ? null
      : (() => {
          const num = parseFloat(value);
          return Number.isNaN(num)
            ? null
            : Math.max(0, Math.min(100, (num / component.max) * 100)).toFixed(
                0,
              );
        })();

  return (
    <div>
      <label className="block text-sm font-semibold text-white/70 mb-2">
        {component.label}
      </label>
      <input
        type="number"
        min="0"
        max={component.max}
        step="any"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        placeholder={`Out of ${component.max}`}
        className="w-full px-3 py-2.5 bg-white/10 border border-white/10 rounded-lg text-white font-semibold placeholder:text-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:border-blue-400/50"
      />
      <p className="text-xs mt-1.5 text-white/40">
        {pct !== null ? `${pct}% of ${component.max}` : `Out of ${component.max}`}
      </p>
    </div>
  );
};

const SubjectRow = ({
  subject,
  expanded,
  onToggle,
  onChange,
  onRemove,
  nameRef,
}) => {
  const result = useMemo(() => calculateSubject(subject), [subject]);
  const showTheory = result.theoryCredits > 0;
  const showLab = result.labCredits > 0;
  const noCredits = result.totalCredits === 0;
  const hasData = result.entered > 0;

  const update = (patch) => onChange(subject.id, patch);
  const updateMarks = (key, value) =>
    update({ marks: { ...subject.marks, [key]: value } });
  const stepCredits = (field, delta) =>
    update({
      [field]: Math.max(
        0,
        Math.min(8, (Number(subject[field]) || 0) + delta),
      ),
    });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -8 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 sm:p-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex-1 min-w-[200px]">
          <input
            ref={nameRef}
            value={subject.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Subject name"
            className="w-full bg-transparent text-xl sm:text-2xl font-bold text-white placeholder:text-white/30 border-b-2 border-transparent focus:border-blue-400/60 focus-visible:outline-none transition-colors"
          />
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
            {showTheory && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/20 font-medium">
                Theory {(result.theoryWeight * 100).toFixed(0)}%
              </span>
            )}
            {showLab && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/20 font-medium">
                Lab {(result.labWeight * 100).toFixed(0)}%
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">
              {result.totalCredits} credit
              {result.totalCredits === 1 ? "" : "s"}
            </span>
            {noCredits && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/20 font-medium">
                Set credits
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-blue-200 tabular-nums">
            {hasData ? `${result.finalPct.toFixed(1)}%` : "—"}
          </div>
          {hasData && (
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-bold border ${gradeStyles(result.grade)}`}
            >
              {result.grade}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(subject.id)}
          aria-label={`Remove ${subject.name || "subject"}`}
          title="Remove subject"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
        >
          <Trash2 size={17} />
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse subject" : "Expand subject"}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/10 px-5 sm:px-6 py-6 space-y-8">
          {/* Credit split */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-white/60" />
              <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                Credit Split
              </h4>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <CreditStepper
                label="Theory"
                value={result.theoryCredits}
                onStep={(delta) => stepCredits("theoryCredits", delta)}
              />
              <CreditStepper
                label="Lab"
                value={result.labCredits}
                onStep={(delta) => stepCredits("labCredits", delta)}
              />
              <span className="text-sm text-white/60">
                Total: <b className="text-white tabular-nums">{result.totalCredits}</b>{" "}
                credits
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/50 mr-1">Quick presets:</span>
              {CREDIT_PRESETS.map((preset) => {
                const active =
                  result.theoryCredits === preset.theory &&
                  result.labCredits === preset.lab;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      update({
                        theoryCredits: preset.theory,
                        labCredits: preset.lab,
                      })
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                      active
                        ? "bg-blue-500/30 border-blue-400/50 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            {noCredits && (
              <p className="text-xs text-amber-300">
                Add at least one credit to compute a grade.
              </p>
            )}
          </div>

          {/* Theory assessments */}
          {showTheory && (
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <BookOpen size={16} className="text-blue-300" />
                <h4 className="text-lg font-semibold text-white">
                  Theory Assessments
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
                  {(result.theoryWeight * 100).toFixed(1)}% of grade
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {THEORY_COMPONENTS.map((component) => (
                  <MarkField
                    key={component.key}
                    component={component}
                    value={subject.marks?.[component.key] ?? ""}
                    onChange={(value) => updateMarks(component.key, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lab assessments */}
          {showLab && (
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <FlaskConical size={16} className="text-purple-300" />
                <h4 className="text-lg font-semibold text-white">
                  Lab Assessments
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-xs font-medium">
                  {(result.labWeight * 100).toFixed(1)}% of grade
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {LAB_COMPONENTS.map((component) => (
                  <MarkField
                    key={component.key}
                    component={component}
                    value={subject.marks?.[component.key] ?? ""}
                    onChange={(value) => updateMarks(component.key, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Live result */}
          <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {showTheory ? (
              <span className="text-white/80">
                Theory{" "}
                <b className="text-white tabular-nums">
                  {result.theoryScore.toFixed(1)}%
                </b>{" "}
                <span className="text-white/50">
                  × {(result.theoryWeight * 100).toFixed(0)}%
                </span>
              </span>
            ) : (
              <span className="text-white/40">Theory not applicable</span>
            )}
            {showTheory && showLab && (
              <span className="text-white/40 font-semibold">+</span>
            )}
            {showLab ? (
              <span className="text-white/80">
                Lab{" "}
                <b className="text-white tabular-nums">
                  {result.labScore.toFixed(1)}%
                </b>{" "}
                <span className="text-white/50">
                  × {(result.labWeight * 100).toFixed(0)}%
                </span>
              </span>
            ) : (
              showTheory && <span className="text-white/40">Lab not applicable</span>
            )}
            <span className="text-white/40 font-semibold">=</span>
            <span className="text-xl font-bold text-blue-200 tabular-nums">
              {hasData ? `${result.finalPct.toFixed(1)}%` : "—"}
            </span>
            {hasData && (
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-bold border ${gradeStyles(result.grade)}`}
              >
                {result.grade}
              </span>
            )}
            {!hasData && (
              <span className="text-xs text-white/40">
                Enter marks above to calculate
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function CreditCalculator() {
  const [subjects, setSubjects] = useState(loadSubjects);
  const [expandedId, setExpandedId] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const nameRefs = useRef({});

  const overall = useMemo(() => calculateOverall(subjects), [subjects]);
  const hasAnyScores = overall.entered > 0;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [subjects]);

  useEffect(() => {
    if (focusId) {
      nameRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, subjects]);

  const addSubject = () => {
    const subject = createEmptySubject();
    setSubjects((prev) => [...prev, subject]);
    setExpandedId(subject.id);
    setFocusId(subject.id);
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
      clearSubjects();
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Weighted"
          value={hasAnyScores ? `${overall.overallPct.toFixed(1)}%` : "—"}
          accent="text-blue-200"
          sub={
            hasAnyScores
              ? `Grade ${getGrade(overall.overallPct)}`
              : "Enter marks to calculate"
          }
        />
        <StatCard
          label="Cumulative GPA"
          value={hasAnyScores ? overall.cgpa.toFixed(2) : "—"}
          accent="text-emerald-200"
          sub="10.0 scale"
        />
        <StatCard
          label="Total Credits"
          value={overall.totalCredits}
          sub={`across ${subjects.length} subject${subjects.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Subjects"
          value={subjects.length}
          accent="text-purple-200"
          sub="dynamically managed"
        />
      </div>

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
              <SubjectRow
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
          <GraduationCap
            size={40}
            className="mx-auto text-white/30 mb-4"
          />
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