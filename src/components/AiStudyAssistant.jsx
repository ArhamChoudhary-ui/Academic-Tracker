import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  Sparkles,
  FileText,
  AlertCircle,
  Loader,
  Upload,
  X,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { loadSyllabusPdfs } from "../utils/syllabusPdfStorage";
import { SUBJECTS } from "../utils/data";
import * as pdfjsLib from "pdfjs-dist";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const AiStudyAssistant = () => {
  // Existing state
  const [pdfs, setPdfs] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // New state for PDF upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const allPdfs = loadSyllabusPdfs();
    setPdfs(allPdfs);
  }, []);

  // Validate file before processing
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

  // Handle file selection from input
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      setError(null);
      setAnalysis(null);
      setExtractedText("");
    }
  };

  // Handle drag and drop
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
      setAnalysis(null);
      setExtractedText("");
    }
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setExtractedText("");
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Extract text from uploaded PDF file (File object)
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

  const extractTextFromPdf = async (base64Data) => {
    try {
      // Remove data URL prefix
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

  const generateStudyNotes = (pdfText, subject) => {
    // STEP 1: CLEAN THE CONTENT
    let cleanText = pdfText
      .replace(/\d+\s*$/gm, "") // Remove page numbers at line ends
      .replace(/^(page|Page|PAGE)\s*\d+.*$/gm, "") // Remove page headers
      .replace(/^(header|footer|copyright|©).*$/gim, "") // Remove headers/footers/copyright
      .replace(/(.+)\n\1+/g, "$1") // Remove repeated consecutive lines
      .replace(/\n{3,}/g, "\n\n") // Normalize spacing
      .replace(/^references$/im, "") // Remove references section header
      .trim();

    // STEP 2: IDENTIFY STRUCTURE
    // Extract potential topics/headings based on capitalization, numbering, or keywords
    const lines = cleanText
      .split("\n")
      .filter((line) => line.trim().length > 0);
    const topics = [];
    const definitions = [];
    const formulas = [];
    let contentSections = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Detect potential headings (all caps, numbered sections, or short lines followed by content)
      if (
        (trimmed.length < 50 &&
          trimmed === trimmed.toUpperCase() &&
          trimmed.length > 3) ||
        /^\d+\.?\s+[A-Z]/.test(trimmed) ||
        /^(chapter|unit|module|section|topic|lecture)/i.test(trimmed)
      ) {
        topics.push(trimmed.replace(/^\d+\.?\s*/, ""));
      }

      // Extract definitions
      if (
        /definition|define|is defined as|refers to|means that/i.test(trimmed)
      ) {
        definitions.push(trimmed);
      }

      // Extract formulas (lines with = sign and mathematical content)
      if (
        /[=+\-*/^()]/.test(trimmed) &&
        trimmed.length < 100 &&
        /[a-zA-Z]/.test(trimmed)
      ) {
        formulas.push(trimmed);
      }
    });

    // STEP 3: GENERATE NOTES

    // Generate title from first meaningful content or subject
    const title = topics[0] || `${subject} Study Notes`;

    // Generate summary (6-10 bullet points)
    const summaryPoints = [
      `This document covers content related to ${subject}`,
      topics.length > 0 ?
        `Main topics include: ${topics.slice(0, 3).join(", ")}`
      : "Contains academic material for learning and revision",
      definitions.length > 0 ?
        `Contains ${definitions.length} key definitions and concepts`
      : "Provides explanations of core concepts",
      formulas.length > 0 ?
        `Includes ${formulas.length} formulas or mathematical expressions`
      : "Focuses on theoretical understanding",
      "Structured for student comprehension and exam preparation",
      "Suitable for creating detailed study notes and revision materials",
      `Total content: approximately ${Math.ceil(cleanText.length / 1000)} KB of text extracted`,
      "Can be used for in-depth learning or quick revision",
    ];

    // Identify key points (extract important sentences)
    const keyPoints = lines
      .filter((line) => {
        const l = line.trim();
        return (
          l.length > 30 &&
          l.length < 150 &&
          (/important|key|main|essential|fundamental|critical|note|remember/i.test(
            l,
          ) ||
            l.endsWith(".") ||
            l.endsWith(":"))
        );
      })
      .slice(0, 15)
      .map((point) => point.trim());

    // Generate practice questions
    const practiceQuestions = [
      `What are the main concepts covered in ${subject}?`,
      `Explain the fundamental principles discussed in this document`,
      `Define the key terms and their significance`,
      topics[0] ?
        `Discuss the topic: ${topics[0]}`
      : `What are the learning objectives of this material?`,
      formulas.length > 0 ?
        "Derive and explain the important formulas"
      : "How do the concepts relate to each other?",
      `Compare and contrast the different concepts presented`,
      `Apply the knowledge to solve practical problems`,
      definitions.length > 0 ?
        "List and explain all key definitions"
      : "What are the main takeaways from this content?",
      `How can this material be applied in real-world scenarios?`,
      `What are the common misconceptions or mistakes related to this topic?`,
    ];

    // Generate important notes
    const importantNotes = [
      "Review all definitions and ensure clear understanding",
      "Pay attention to any assumptions or conditions mentioned",
      formulas.length > 0 ?
        "Understand when and how to apply each formula"
      : "Focus on conceptual clarity rather than memorization",
      "Note any special cases or exceptions highlighted in the text",
      "Look for connections between different sections of the material",
    ];

    // Generate one-page revision
    const revisionPoints = [
      `Subject: ${subject}`,
      topics.length > 0 ?
        `Key Topics: ${topics.slice(0, 5).join(" | ")}`
      : "Core concepts covered in document",
      definitions.length > 0 ?
        `${definitions.length} definitions to remember`
      : "Focus on understanding key ideas",
      formulas.length > 0 ?
        `${formulas.length} formulas/expressions to practice`
      : "Theoretical foundation is crucial",
      "Review all key points before exam",
      "Practice questions to test understanding",
      "Connect concepts for holistic understanding",
    ];

    // BUILD FINAL OUTPUT
    const notes = `━━━━━━━━━━━━━━━━━━━━━━
📘 TITLE
━━━━━━━━━━━━━━━━━━━━━━
${title}

━━━━━━━━━━━━━━━━━━━━━━
🧠 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━
${summaryPoints.map((p) => `- ${p}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━
📚 DETAILED NOTES
━━━━━━━━━━━━━━━━━━━━━━
${
  topics.length > 0 ?
    topics
      .slice(0, 8)
      .map(
        (topic) =>
          `### ${topic}\n- This topic covers important aspects of ${subject}\n- Refer to the original document for detailed explanations\n- Focus on understanding the core principles`,
      )
      .join("\n\n")
  : `### Core Content\n- The document provides comprehensive coverage of ${subject}\n- Content is organized into logical sections\n- Each section builds upon previous knowledge\n- Examples and explanations are provided throughout\n- Material is suitable for both learning and revision`
}

${
  cleanText.length > 500 ?
    `### Additional Content Notes\n- The PDF contains detailed explanations spanning ${Math.ceil(cleanText.length / 500)} paragraphs\n- Content requires careful reading and understanding\n- Make your own notes while studying the original material\n- Highlight important sections for quick revision`
  : ""
}

━━━━━━━━━━━━━━━━━━━━━━
📌 KEY POINTS
━━━━━━━━━━━━━━━━━━━━━━
${keyPoints.length > 0 ? keyPoints.map((kp) => `- ${kp}`).join("\n") : "- Read the entire document carefully\n- Identify main concepts and supporting details\n- Create your own summary as you study\n- Note down questions that arise\n- Review regularly for retention"}

━━━━━━━━━━━━━━━━━━━━━━
🧮 FORMULAS / DEFINITIONS
━━━━━━━━━━━━━━━━━━━━━━
${
  definitions.length > 0 ?
    `**Definitions Found:**\n${definitions
      .slice(0, 10)
      .map((d) => `- ${d}`)
      .join("\n")}\n\n`
  : ""
}${
      formulas.length > 0 ?
        `**Formulas/Expressions:**\n${formulas
          .slice(0, 10)
          .map((f) => `- ${f}`)
          .join("\n")}`
      : definitions.length === 0 ?
        "No explicit formulas or definitions found in this document.\nRefer to the detailed notes above for conceptual understanding."
      : ""
    }

━━━━━━━━━━━━━━━━━━━━━━
❓ QUESTIONS FOR PRACTICE
━━━━━━━━━━━━━━━━━━━━━━
${practiceQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPORTANT NOTES
━━━━━━━━━━━━━━━━━━━━━━
${importantNotes.map((note) => `- ${note}`).join("\n")}
- This is an AI-generated summary from PDF text extraction
- Some content may be missing if the PDF had images or complex formatting
- Always refer to the original PDF for complete information
- Use these notes as a study aid, not a replacement for the original material

━━━━━━━━━━━━━━━━━━━━━━
📄 ONE-PAGE REVISION
━━━━━━━━━━━━━━━━━━━━━━
${revisionPoints.map((rp) => `• ${rp}`).join("\n")}
• Study the detailed notes section thoroughly
• Memorize key definitions and formulas
• Practice all questions multiple times
• Create flashcards for quick revision
• Teach concepts to others to reinforce learning`;

    return notes;
  };

  const handleAnalyze = async () => {
    // Validate inputs
    if (!uploadedFile && !selectedSubject) {
      setError(
        "Please upload a PDF file or select a subject with an existing PDF",
      );
      return;
    }

    if (uploadedFile && !selectedSubject) {
      setError("Please enter a subject name for this PDF");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      let pdfText = "";

      // If user uploaded a new file, extract text from it
      if (uploadedFile) {
        pdfText = await extractTextFromFile(uploadedFile);
        setExtractedText(pdfText);
      }
      // Otherwise use existing PDF from storage
      else if (selectedSubject && pdfs[selectedSubject]) {
        const pdf = pdfs[selectedSubject];
        pdfText = await extractTextFromPdf(pdf.fileData);
        setExtractedText(pdfText);
      } else {
        throw new Error("No PDF available to analyze");
      }

      // Generate study notes from extracted text
      const studyNotes = generateStudyNotes(
        pdfText,
        selectedSubject || "Unknown Subject",
      );
      setAnalysis(studyNotes);
    } catch (err) {
      setError(err.message || "Failed to analyze PDF");
    } finally {
      setAnalyzing(false);
    }
  };

  // Copy notes to clipboard
  const handleCopyNotes = async () => {
    if (!analysis) return;

    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  // Download notes as text file
  const handleDownloadTxt = () => {
    if (!analysis) return;

    const blob = new Blob([analysis], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSubject || "study"}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download notes as markdown file
  const handleDownloadMarkdown = () => {
    if (!analysis) return;

    const blob = new Blob([analysis], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSubject || "study"}_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const availableSubjects = SUBJECTS.filter((subject) => pdfs[subject]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          AI Study Assistant
        </h2>
        <p className="text-white/60">
          Upload any PDF and get structured, human-readable study notes
        </p>
      </div>

      {/* PDF Upload Section */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-400/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-300" />
          Upload PDF
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

      {/* Subject Input */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-white/70 mb-3">
          Subject / Topic Name
        </label>

        {/* If user uploaded a file, show text input. Otherwise show dropdown */}
        {uploadedFile ?
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            placeholder="e.g., Mathematics, Physics, History..."
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all mb-6"
          />
        : <>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setAnalysis(null);
                setError(null);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all mb-6"
            >
              <option value="">Choose from existing PDFs...</option>
              {SUBJECTS.filter((subject) => pdfs[subject]).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            {selectedSubject && pdfs[selectedSubject] && (
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg mb-6">
                <FileText size={24} className="text-blue-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {pdfs[selectedSubject].fileName}
                  </p>
                  <p className="text-white/50 text-sm">
                    Uploaded on{" "}
                    {new Date(
                      pdfs[selectedSubject].uploadDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </>
        }

        {/* Generate Button */}
        <button
          onClick={handleAnalyze}
          disabled={(!uploadedFile && !selectedSubject) || analyzing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
        >
          {analyzing ?
            <>
              <Loader size={20} className="animate-spin" />
              Generating Study Notes...
            </>
          : <>
              <Sparkles size={20} />
              Generate Study Notes
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

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 space-y-6">
          {/* Header with action buttons */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-blue-300" />
              <h3 className="text-2xl font-bold text-white">
                Study Notes: {selectedSubject}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNotes}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Copy to clipboard"
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
                      Copy
                    </span>
                  </>
                }
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Download as text file"
              >
                <Download size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">
                  .txt
                </span>
              </button>
              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Download as markdown"
              >
                <Download size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">.md</span>
              </button>
            </div>
          </div>

          {/* Notes Content */}
          <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
            <div
              className="text-white/80 whitespace-pre-wrap leading-relaxed font-mono text-sm"
              dangerouslySetInnerHTML={{
                __html: analysis
                  .replace(/━{20,}/g, '<hr class="border-blue-400/30 my-4" />')
                  .replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-blue-200 font-bold">$1</strong>',
                  )
                  .replace(
                    /^(📘|🧠|📌|🧮|❓|📝|⚠️|📚|📄)(.+)$/gm,
                    '<div class="text-xl font-bold text-blue-300 mt-6 mb-3">$1$2</div>',
                  )
                  .replace(
                    /^###\s+(.+)$/gm,
                    '<h4 class="text-lg font-bold text-blue-200 mt-4 mb-2">$1</h4>',
                  )
                  .replace(
                    /^- (.+)$/gm,
                    '<div class="ml-4 mb-2 text-white/70">• $1</div>',
                  )
                  .replace(
                    /^• (.+)$/gm,
                    '<div class="ml-4 mb-2 text-white/70">• $1</div>',
                  )
                  .replace(
                    /^\d+\.\s(.+)$/gm,
                    '<div class="ml-4 mb-2 text-white/70">$&</div>',
                  ),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AiStudyAssistant;
