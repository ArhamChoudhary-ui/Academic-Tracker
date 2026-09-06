import React, { useState, useEffect, useRef } from "react";
import { Plus, X, BookOpen, CheckCircle2 } from "lucide-react";

const PRESET_WEIGHTAGES = [
  {
    id: "standard",
    label: "Theory + Lab (75 / 25)",
    description: "75% Theory (CATs, Quizzes, FAT) + 25% Lab",
    internal: 75,
    lab: 25,
  },
  {
    id: "theory_only",
    label: "Theory Only (100 / 0)",
    description: "100% Theory — No Lab component",
    internal: 100,
    lab: 0,
  },
  {
    id: "equal",
    label: "Equal Split (50 / 50)",
    description: "50% Theory + 50% Lab",
    internal: 50,
    lab: 50,
  },
  {
    id: "custom",
    label: "Custom Weightage",
    description: "Specify your own percentage ratio",
    internal: 75,
    lab: 25,
  },
];

export default function AddSubjectModal({ isOpen, onClose, onAdd, existingSubjects = [] }) {
  const [name, setName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("standard");
  const [customInternal, setCustomInternal] = useState(75);
  const [customLab, setCustomLab] = useState(25);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setSelectedPreset("standard");
      setCustomInternal(75);
      setCustomLab(25);
      setNotes("");
      setError("");
      setTimeout(() => { inputRef.current?.focus(); }, 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a subject name.");
      inputRef.current?.focus();
      return;
    }
    const isDuplicate = existingSubjects.some(
      (s) => s.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setError(`"${trimmedName}" already exists.`);
      inputRef.current?.focus();
      return;
    }
    let weightage;
    if (selectedPreset === "custom") {
      const internalVal = parseFloat(customInternal) || 0;
      const labVal = parseFloat(customLab) || 0;
      if (Math.round(internalVal + labVal) !== 100) {
        setError("Internal % and Lab % must add up to 100%.");
        return;
      }
      weightage = { internal: internalVal, lab: labVal };
    } else {
      const preset = PRESET_WEIGHTAGES.find((p) => p.id === selectedPreset);
      weightage = { internal: preset.internal, lab: preset.lab };
    }
    onAdd({ name: trimmedName, weightage, notes: notes.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-subject-title"
        className="bg-blue-800 border border-white/20 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/50 border border-white/20">
              <BookOpen size={22} className="text-blue-200" />
            </div>
            <div>
              <h2 id="add-subject-title" className="text-2xl font-bold">Add New Subject</h2>
              <p className="text-xs text-white/60">Enroll a subject on your dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <X size={22} />
          </button>
        </div>

        <div className="border-t border-white/15" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Subject Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
              placeholder="e.g. Artificial Intelligence, Physics, Data Structures..."
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/[0.15] border border-white/20 rounded-xl text-white placeholder:text-white/40 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:border-blue-400"
            />
            {error && (
              <p className="text-sm text-red-300 mt-2 font-medium">⚠️ {error}</p>
            )}
          </div>

          {/* Weightage */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">
              Assessment Weightage
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_WEIGHTAGES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => { setSelectedPreset(preset.id); if (error) setError(""); }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedPreset === preset.id
                      ? "bg-blue-600/60 border-blue-300 ring-2 ring-blue-400/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-sm text-white">{preset.label}</span>
                    {selectedPreset === preset.id && (
                      <CheckCircle2 size={16} className="text-blue-200 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-white/60">{preset.description}</span>
                </button>
              ))}
            </div>

            {selectedPreset === "custom" && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">Theory / Internal %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customInternal}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        setCustomInternal(v);
                        setCustomLab(Math.max(0, 100 - v));
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">Lab %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={customLab}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        setCustomLab(v);
                        setCustomInternal(Math.max(0, 100 - v));
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <p className="text-xs text-white/50 text-right">
                  Total: {(parseFloat(customInternal) || 0) + (parseFloat(customLab) || 0)}%
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Notes / Goals <span className="text-white/50">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Target grade: S, Important exam: Dec 15..."
              rows={2}
              className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/[0.15] border border-white/20 rounded-xl text-white placeholder:text-white/40 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="border-t border-white/15 pt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 active:translate-y-0"
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
