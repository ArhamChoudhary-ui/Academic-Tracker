import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  FileText,
  AlertCircle,
  Loader,
  Upload,
  X,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { loadSyllabusPdfs } from "../utils/syllabusPdfStorage";
import { SUBJECTS } from "../utils/data";
import * as pdfjsLib from "pdfjs-dist";
import { generateExamQuestions } from "../utils/aiQuestionGenerator";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ExamQuestionGenerator = () => {
  // State management
  const [pdfs, setPdfs] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    mcqs: true,
    twoMarkers: true,
    fiveMarkers: true,
    numericals: true,
    definitions: true,
    mistakes: true,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const allPdfs = loadSyllabusPdfs();
    setPdfs(allPdfs);
  }, []);

  // File validation
  const validateFile = (file) => {
    if (!file) {
      setError("No file selected");
      return false;
    }
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      );
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      setError(null);
      setQuestions(null);
      setExtractedText("");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      setError(null);
      setQuestions(null);
      setExtractedText("");
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setExtractedText("");
    setQuestions(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Extract text from uploaded PDF file
  const extractTextFromFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      return fullText;
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      throw new Error(
        "Failed to extract text from PDF. The PDF might be image-based or corrupted.",
      );
    }
  };

  // Extract text from base64 PDF (existing PDFs)
  const extractTextFromPdf = async (base64Data) => {
    try {
      const base64String = base64Data.split(",")[1];
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      return fullText;
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      throw new Error(
        "Failed to extract text from PDF. The PDF might be image-based or corrupted.",
      );
    }
  };

  // Generate questions
  const handleGenerate = async () => {
    if (!uploadedFile && !selectedSubject) {
      setError("Please upload a PDF or select a subject with an existing PDF");
      return;
    }

    if (uploadedFile && !selectedSubject) {
      setError("Please enter a subject name");
      return;
    }

    setGenerating(true);
    setError(null);
    setQuestions(null);

    try {
      let pdfText = extractedText;

      // Extract text if not already extracted
      if (!pdfText) {
        if (uploadedFile) {
          pdfText = await extractTextFromFile(uploadedFile);
        } else if (selectedSubject && pdfs[selectedSubject]) {
          pdfText = await extractTextFromPdf(pdfs[selectedSubject].fileData);
        } else {
          throw new Error("No PDF available");
        }
        setExtractedText(pdfText);
      }

      // Generate questions
      const generatedQuestions = generateExamQuestions(
        pdfText,
        selectedSubject || "Unknown Subject",
        difficulty,
      );
      setQuestions(generatedQuestions);
    } catch (err) {
      setError(err.message || "Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  };

  // Regenerate with same settings
  const handleRegenerate = () => {
    if (extractedText) {
      setGenerating(true);
      setError(null);
      setTimeout(() => {
        const generatedQuestions = generateExamQuestions(
          extractedText,
          selectedSubject || "Unknown Subject",
          difficulty,
        );
        setQuestions(generatedQuestions);
        setGenerating(false);
      }, 500);
    } else {
      handleGenerate();
    }
  };

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Copy all questions
  const handleCopyQuestions = async () => {
    if (!questions) return;

    let textToCopy = `EXAM QUESTIONS - ${selectedSubject}\nDifficulty: ${difficulty.toUpperCase()}\n\n`;

    // MCQs
    if (questions.mcqs && questions.mcqs.length > 0) {
      textToCopy +=
        "═══════════════════════════════\nMULTIPLE CHOICE QUESTIONS\n═══════════════════════════════\n\n";
      questions.mcqs.forEach((mcq, i) => {
        textToCopy += `${i + 1}. ${mcq.question}\n${mcq.options.join("\n")}\nCorrect Answer: ${mcq.correctAnswer}\n\n`;
      });
    }

    // 2-mark questions
    if (questions.twoMarkers && questions.twoMarkers.length > 0) {
      textToCopy +=
        "═══════════════════════════════\n2-MARK QUESTIONS\n═══════════════════════════════\n\n";
      questions.twoMarkers.forEach((q, i) => {
        textToCopy += `${i + 1}. ${q.question} (${q.marks} marks)\n\n`;
      });
    }

    // 5-mark questions
    if (questions.fiveMarkers && questions.fiveMarkers.length > 0) {
      textToCopy +=
        "═══════════════════════════════\n5-MARK THEORY QUESTIONS\n═══════════════════════════════\n\n";
      questions.fiveMarkers.forEach((q, i) => {
        textToCopy += `${i + 1}. ${q.question} (${q.marks} marks)\n\n`;
      });
    }

    // Numericals
    if (questions.numericals && questions.numericals.length > 0) {
      textToCopy +=
        "═══════════════════════════════\nNUMERICAL PROBLEMS\n═══════════════════════════════\n\n";
      questions.numericals.forEach((q, i) => {
        textToCopy += `${i + 1}. ${q.question} (${q.marks} marks)\nHint: ${q.hint}\n\n`;
      });
    }

    // Definitions
    if (questions.definitions && questions.definitions.length > 0) {
      textToCopy +=
        "═══════════════════════════════\nDEFINITIONS\n═══════════════════════════════\n\n";
      questions.definitions.forEach((q, i) => {
        textToCopy += `${i + 1}. ${q.question}\n\n`;
      });
    }

    // Common mistakes
    if (questions.commonMistakes && questions.commonMistakes.length > 0) {
      textToCopy +=
        "═══════════════════════════════\nCOMMON MISTAKES TO AVOID\n═══════════════════════════════\n\n";
      questions.commonMistakes.forEach((m, i) => {
        textToCopy += `${i + 1}. ${m.mistake}\n   Tip: ${m.tip}\n\n`;
      });
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          AI Exam Question Generator
        </h2>
        <p className="text-white/60">
          Generate exam-oriented questions from your study materials
        </p>
      </div>

      {/* PDF Upload Section */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-400/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-300" />
          Upload PDF or Select Subject
        </h3>

        {!uploadedFile ?
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200
              ${
                isDragging ?
                  "border-blue-400 bg-blue-500/20 scale-105"
                : "border-white/30 bg-white/5 hover:border-blue-400/50 hover:bg-white/10"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload size={48} className="mx-auto mb-4 text-blue-300/70" />
            <p className="text-white font-semibold mb-2">
              {isDragging ? "Drop PDF here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-white/50 text-sm">
              PDF files only • Max size: 10MB
            </p>
          </div>
        : <div className="bg-white/10 border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <FileText
                size={32}
                className="text-blue-300 flex-shrink-0 mt-1"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate mb-1">
                  {uploadedFile.name}
                </p>
                <p className="text-white/60 text-sm">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                title="Remove file"
              >
                <X
                  size={20}
                  className="text-white/60 group-hover:text-red-400"
                />
              </button>
            </div>
          </div>
        }
      </div>

      {/* Configuration Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
        {/* Subject Input */}
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-3">
            Subject / Topic Name
          </label>
          {uploadedFile ?
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics, History..."
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />
          : <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setQuestions(null);
                setError(null);
                setExtractedText("");
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            >
              <option value="">Choose from existing PDFs...</option>
              {SUBJECTS.filter((subject) => pdfs[subject]).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          }
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-3">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "easy", label: "Easy", desc: "Basic concepts" },
              { value: "medium", label: "Medium", desc: "University level" },
              { value: "hard", label: "Hard", desc: "JEE / Competitive" },
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setDifficulty(level.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  difficulty === level.value ?
                    "border-blue-400 bg-blue-500/20"
                  : "border-white/10 bg-white/5 hover:border-blue-400/50"
                }`}
              >
                <div className="text-white font-semibold mb-1">
                  {level.label}
                </div>
                <div className="text-white/50 text-xs">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={(!uploadedFile && !selectedSubject) || generating}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
        >
          {generating ?
            <>
              <Loader size={20} className="animate-spin" />
              Generating Questions...
            </>
          : <>
              <Sparkles size={20} />
              Generate Exam Questions
            </>
          }
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle
            size={20}
            className="text-red-300 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Questions Display */}
      {questions && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-blue-300" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Generated Questions
                </h3>
                <p className="text-white/60 text-sm">
                  {selectedSubject} • {difficulty} level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuestions}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {copied ?
                  <>
                    <Check size={18} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">
                      Copied!
                    </span>
                  </>
                : <>
                    <Copy size={18} className="text-white/70" />
                    <span className="text-white/70 text-sm font-semibold">
                      Copy All
                    </span>
                  </>
                }
              </button>
              <button
                onClick={handleRegenerate}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">
                  Regenerate
                </span>
              </button>
            </div>
          </div>

          {/* MCQs Section */}
          {questions.mcqs && questions.mcqs.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("mcqs")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  Multiple Choice Questions ({questions.mcqs.length})
                </h4>
                {expandedSections.mcqs ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.mcqs && (
                <div className="px-6 pb-6 space-y-6">
                  {questions.mcqs.map((mcq, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-semibold mb-3">
                        {i + 1}. {mcq.question}
                      </p>
                      <div className="space-y-2 mb-3">
                        {mcq.options.map((opt, j) => (
                          <div key={j} className="text-white/70 text-sm">
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-green-400 font-semibold text-sm">
                          Correct Answer: {mcq.correctAnswer}
                        </span>
                        <p className="text-white/60 text-sm mt-1">
                          {mcq.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2-Mark Questions */}
          {questions.twoMarkers && questions.twoMarkers.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("twoMarkers")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  2-Mark Questions ({questions.twoMarkers.length})
                </h4>
                {expandedSections.twoMarkers ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.twoMarkers && (
                <div className="px-6 pb-6 space-y-4">
                  {questions.twoMarkers.map((q, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-semibold">
                        {i + 1}. {q.question}
                      </p>
                      <span className="text-blue-300 text-sm font-semibold">
                        ({q.marks} marks)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5-Mark Questions */}
          {questions.fiveMarkers && questions.fiveMarkers.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("fiveMarkers")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  5-Mark Theory Questions ({questions.fiveMarkers.length})
                </h4>
                {expandedSections.fiveMarkers ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.fiveMarkers && (
                <div className="px-6 pb-6 space-y-4">
                  {questions.fiveMarkers.map((q, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-semibold">
                        {i + 1}. {q.question}
                      </p>
                      <span className="text-blue-300 text-sm font-semibold">
                        ({q.marks} marks)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Numericals */}
          {questions.numericals && questions.numericals.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("numericals")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  Numerical Problems ({questions.numericals.length})
                </h4>
                {expandedSections.numericals ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.numericals && (
                <div className="px-6 pb-6 space-y-4">
                  {questions.numericals.map((q, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4">
                      <p className="text-white font-semibold mb-2">
                        {i + 1}. {q.question}
                      </p>
                      <span className="text-blue-300 text-sm font-semibold mb-2 block">
                        ({q.marks} marks)
                      </span>
                      <div className="bg-blue-900/20 border border-blue-400/30 rounded p-3 mt-2">
                        <p className="text-white/70 text-sm">
                          <span className="text-blue-300 font-semibold">
                            Hint:
                          </span>{" "}
                          {q.hint}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Numericals Message */}
          {questions.numericals === null && (
            <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                <AlertCircle size={16} className="inline mr-2" />
                Not enough information in this PDF for numerical problems. The
                content appears to be more theoretical.
              </p>
            </div>
          )}

          {/* Definitions */}
          {questions.definitions && questions.definitions.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("definitions")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  Important Definitions ({questions.definitions.length})
                </h4>
                {expandedSections.definitions ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.definitions && (
                <div className="px-6 pb-6 space-y-3">
                  {questions.definitions.map((q, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white font-semibold text-sm">
                        {i + 1}. {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Common Mistakes */}
          {questions.commonMistakes && questions.commonMistakes.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("mistakes")}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
              >
                <h4 className="text-lg font-bold text-white">
                  Common Mistakes / Traps ({questions.commonMistakes.length})
                </h4>
                {expandedSections.mistakes ?
                  <ChevronUp size={20} className="text-white/70" />
                : <ChevronDown size={20} className="text-white/70" />}
              </button>
              {expandedSections.mistakes && (
                <div className="px-6 pb-6 space-y-4">
                  {questions.commonMistakes.map((m, i) => (
                    <div
                      key={i}
                      className="bg-red-500/10 border border-red-400/30 rounded-lg p-4"
                    >
                      <p className="text-white font-semibold mb-2">
                        ⚠️ {m.mistake}
                      </p>
                      <p className="text-white/70 text-sm">
                        <span className="text-blue-300 font-semibold">
                          Tip:
                        </span>{" "}
                        {m.tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamQuestionGenerator;
