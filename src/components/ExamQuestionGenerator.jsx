import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Loader,
  Upload,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { loadSyllabusPdfs } from "../utils/syllabusPdfStorage";
import { SUBJECTS } from "../utils/data";
import { generateExamQuestions } from "../utils/aiQuestionGenerator";
import { usePdfExtractor } from "../hooks/usePdfExtractor";
import { PdfDropZone } from "./shared/PdfDropZone";
import { ErrorBanner } from "./shared/ErrorBanner";

// ─── Question section keys that drive the collapsible panels ────────────────
const QUESTION_SECTIONS = [
  { key: "mcqs",         label: "Multiple Choice Questions" },
  { key: "twoMarkers",   label: "2-Mark Questions" },
  { key: "fiveMarkers",  label: "5-Mark Theory Questions" },
  { key: "numericals",   label: "Numerical Problems" },
  { key: "definitions",  label: "Important Definitions" },
  { key: "commonMistakes", label: "Common Mistakes / Traps" },
];

const DIFFICULTY_LEVELS = [
  { value: "easy",   label: "Easy",   description: "Basic concepts" },
  { value: "medium", label: "Medium", description: "University level" },
  { value: "hard",   label: "Hard",   description: "JEE / Competitive" },
];

/** Build all-sections-expanded initial state from the section config. */
function buildExpandedSectionsState() {
  return QUESTION_SECTIONS.reduce((acc, { key }) => {
    acc[key] = true;
    return acc;
  }, {});
}

/** Serialise a generated question set to plain text for clipboard / download. */
function buildPlainTextExport(questions, subjectName, difficulty) {
  const separator = "═══════════════════════════════";
  let output = `EXAM QUESTIONS — ${subjectName}\nDifficulty: ${difficulty.toUpperCase()}\n\n`;

  const appendSection = (heading, items, renderItem) => {
    if (!items?.length) return;
    output += `${separator}\n${heading}\n${separator}\n\n`;
    items.forEach((item, idx) => {
      output += renderItem(item, idx + 1);
    });
  };

  appendSection("MULTIPLE CHOICE QUESTIONS", questions.mcqs, (q, n) =>
    `${n}. ${q.question}\n${q.options.join("\n")}\nCorrect Answer: ${q.correctAnswer}\n\n`
  );
  appendSection("2-MARK QUESTIONS", questions.twoMarkers, (q, n) =>
    `${n}. ${q.question} (${q.marks} marks)\n\n`
  );
  appendSection("5-MARK THEORY QUESTIONS", questions.fiveMarkers, (q, n) =>
    `${n}. ${q.question} (${q.marks} marks)\n\n`
  );
  appendSection("NUMERICAL PROBLEMS", questions.numericals, (q, n) =>
    `${n}. ${q.question} (${q.marks} marks)\nHint: ${q.hint}\n\n`
  );
  appendSection("DEFINITIONS", questions.definitions, (q, n) =>
    `${n}. ${q.question}\n\n`
  );
  appendSection("COMMON MISTAKES TO AVOID", questions.commonMistakes, (m, n) =>
    `${n}. ${m.mistake}\n   Tip: ${m.tip}\n\n`
  );

  return output;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function DifficultySelector({ difficulty, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {DIFFICULTY_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelect(level.value)}
          className={`p-4 rounded-lg border-2 transition-all ${
            difficulty === level.value
              ? "border-blue-400 bg-blue-500/20"
              : "border-white/10 bg-white/5 hover:border-blue-400/50"
          }`}
        >
          <div className="text-white font-semibold mb-1">{level.label}</div>
          <div className="text-white/50 text-xs">{level.description}</div>
        </button>
      ))}
    </div>
  );
}

function CollapsibleQuestionSection({ sectionKey, label, isExpanded, onToggle, children }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <h4 className="text-lg font-bold text-white">{label}</h4>
        {isExpanded ? (
          <ChevronUp size={20} className="text-white/70" />
        ) : (
          <ChevronDown size={20} className="text-white/70" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">{children}</div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const ExamQuestionGenerator = () => {
  const [storedPdfs, setStoredPdfs] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [cachedExtractedText, setCachedExtractedText] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState(buildExpandedSectionsState);

  const pdfExtractor = usePdfExtractor({
    onFileCleared: () => {
      setGeneratedQuestions(null);
      setCachedExtractedText("");
      setGenerationError(null);
    },
  });

  useEffect(() => {
    setStoredPdfs(loadSyllabusPdfs());
  }, []);

  function toggleSection(sectionKey) {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  }

  async function handleGenerate() {
    if (!pdfExtractor.uploadedFile && !selectedSubject) {
      setGenerationError("Upload a PDF or select a subject that already has one.");
      return;
    }
    if (pdfExtractor.uploadedFile && !selectedSubject) {
      setGenerationError("Enter a subject name for the uploaded PDF.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedQuestions(null);

    try {
      let pdfText = cachedExtractedText;

      if (!pdfText) {
        if (pdfExtractor.uploadedFile) {
          pdfText = await pdfExtractor.extractTextFromFileObject(pdfExtractor.uploadedFile);
        } else if (storedPdfs[selectedSubject]) {
          pdfText = await pdfExtractor.extractTextFromBase64DataUrl(
            storedPdfs[selectedSubject].fileData
          );
        } else {
          throw new Error("No PDF source found for this subject.");
        }
        setCachedExtractedText(pdfText);
      }

      const questions = generateExamQuestions(
        pdfText,
        selectedSubject || "Unknown Subject",
        difficulty
      );
      setGeneratedQuestions(questions);
    } catch (err) {
      setGenerationError(err.message || "Question generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRegenerate() {
    if (cachedExtractedText) {
      setIsGenerating(true);
      setGenerationError(null);
      setTimeout(() => {
        const questions = generateExamQuestions(
          cachedExtractedText,
          selectedSubject || "Unknown Subject",
          difficulty
        );
        setGeneratedQuestions(questions);
        setIsGenerating(false);
      }, 400);
    } else {
      handleGenerate();
    }
  }

  async function handleCopyAllQuestions() {
    if (!generatedQuestions) return;
    const text = buildPlainTextExport(generatedQuestions, selectedSubject, difficulty);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setGenerationError("Clipboard write failed.");
    }
  }

  const subjectsWithStoredPdfs = SUBJECTS.filter((s) => storedPdfs[s]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Exam Question Practice Generator
        </h2>
        <p className="text-white/60">
          Generate exam-oriented revision questions and practice problems from your course materials
        </p>
      </div>

      {/* PDF upload */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-400/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-300" />
          Upload PDF or Select Subject
        </h3>
        <PdfDropZone
          uploadedFile={pdfExtractor.uploadedFile}
          isDragging={pdfExtractor.isDragging}
          fileInputRef={pdfExtractor.fileInputRef}
          onFileInputChange={(e) =>
            pdfExtractor.handleFileInputChange(e, () => {
              setGeneratedQuestions(null);
              setCachedExtractedText("");
            })
          }
          onDragOver={pdfExtractor.handleDragOver}
          onDragLeave={pdfExtractor.handleDragLeave}
          onDrop={(e) =>
            pdfExtractor.handleDrop(e, () => {
              setGeneratedQuestions(null);
              setCachedExtractedText("");
            })
          }
          onRemoveFile={pdfExtractor.clearUploadedFile}
        />
      </div>

      {/* Config */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
        {/* Subject input / selector */}
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-3">
            Subject / Topic Name
          </label>
          {pdfExtractor.uploadedFile ? (
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="e.g. Mathematics, Physics, History…"
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          ) : (
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setGeneratedQuestions(null);
                setGenerationError(null);
                setCachedExtractedText("");
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            >
              <option value="">Choose from existing PDFs…</option>
              {subjectsWithStoredPdfs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-3">
            Difficulty Level
          </label>
          <DifficultySelector difficulty={difficulty} onSelect={setDifficulty} />
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={(!pdfExtractor.uploadedFile && !selectedSubject) || isGenerating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          {isGenerating ? (
            <>
              <Loader size={20} className="animate-spin" />
              Generating Questions…
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Exam Questions
            </>
          )}
        </button>
      </div>

      {/* Errors */}
      <ErrorBanner message={generationError || pdfExtractor.extractionError} />

      {/* Results */}
      {generatedQuestions && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-blue-300" />
              <div>
                <h3 className="text-xl font-bold text-white">Generated Questions</h3>
                <p className="text-white/60 text-sm">
                  {selectedSubject} · {difficulty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllQuestions}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check size={18} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} className="text-white/70" />
                    <span className="text-white/70 text-sm font-semibold">Copy All</span>
                  </>
                )}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">Regenerate</span>
              </button>
            </div>
          </div>

          {/* MCQs */}
          {generatedQuestions.mcqs?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="mcqs"
              label={`Multiple Choice Questions (${generatedQuestions.mcqs.length})`}
              isExpanded={expandedSections.mcqs}
              onToggle={toggleSection}
            >
              {generatedQuestions.mcqs.map((mcq, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-semibold mb-3">{i + 1}. {mcq.question}</p>
                  <div className="space-y-2 mb-3">
                    {mcq.options.map((opt, j) => (
                      <div key={j} className="text-white/70 text-sm">{opt}</div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-green-400 font-semibold text-sm">
                      Correct: {mcq.correctAnswer}
                    </span>
                    <p className="text-white/60 text-sm mt-1">{mcq.explanation}</p>
                  </div>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}

          {/* 2-mark questions */}
          {generatedQuestions.twoMarkers?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="twoMarkers"
              label={`2-Mark Questions (${generatedQuestions.twoMarkers.length})`}
              isExpanded={expandedSections.twoMarkers}
              onToggle={toggleSection}
            >
              {generatedQuestions.twoMarkers.map((q, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-semibold">{i + 1}. {q.question}</p>
                  <span className="text-blue-300 text-sm font-semibold">({q.marks} marks)</span>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}

          {/* 5-mark questions */}
          {generatedQuestions.fiveMarkers?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="fiveMarkers"
              label={`5-Mark Theory Questions (${generatedQuestions.fiveMarkers.length})`}
              isExpanded={expandedSections.fiveMarkers}
              onToggle={toggleSection}
            >
              {generatedQuestions.fiveMarkers.map((q, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-semibold">{i + 1}. {q.question}</p>
                  <span className="text-blue-300 text-sm font-semibold">({q.marks} marks)</span>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}

          {/* Numericals */}
          {generatedQuestions.numericals?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="numericals"
              label={`Numerical Problems (${generatedQuestions.numericals.length})`}
              isExpanded={expandedSections.numericals}
              onToggle={toggleSection}
            >
              {generatedQuestions.numericals.map((q, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-semibold mb-2">{i + 1}. {q.question}</p>
                  <span className="text-blue-300 text-sm font-semibold block mb-2">({q.marks} marks)</span>
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded p-3 mt-2">
                    <p className="text-white/70 text-sm">
                      <span className="text-blue-300 font-semibold">Hint: </span>
                      {q.hint}
                    </p>
                  </div>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}

          {/* Definitions */}
          {generatedQuestions.definitions?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="definitions"
              label={`Important Definitions (${generatedQuestions.definitions.length})`}
              isExpanded={expandedSections.definitions}
              onToggle={toggleSection}
            >
              {generatedQuestions.definitions.map((q, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <p className="text-white font-semibold text-sm">{i + 1}. {q.question}</p>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}

          {/* Common mistakes */}
          {generatedQuestions.commonMistakes?.length > 0 && (
            <CollapsibleQuestionSection
              sectionKey="commonMistakes"
              label={`Common Mistakes / Traps (${generatedQuestions.commonMistakes.length})`}
              isExpanded={expandedSections.mistakes}
              onToggle={toggleSection}
            >
              {generatedQuestions.commonMistakes.map((m, i) => (
                <div key={i} className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <p className="text-white font-semibold mb-2">⚠️ {m.mistake}</p>
                  <p className="text-white/70 text-sm">
                    <span className="text-blue-300 font-semibold">Tip: </span>
                    {m.tip}
                  </p>
                </div>
              ))}
            </CollapsibleQuestionSection>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamQuestionGenerator;
