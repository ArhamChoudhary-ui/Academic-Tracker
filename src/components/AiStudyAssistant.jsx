import React, { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Loader,
  Upload,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { loadSyllabusPdfs } from "../utils/syllabusPdfStorage";
import { SUBJECTS } from "../utils/data";
import { usePdfExtractor } from "../hooks/usePdfExtractor";
import { PdfDropZone } from "./shared/PdfDropZone";
import { ErrorBanner } from "./shared/ErrorBanner";
import { buildStudyNotes } from "../utils/studyNotesBuilder";
import { sanitizeDisplayFileName } from "../utils/fileNameSanitizer";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Trigger a browser file download with the given text content. */
function downloadTextFile(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Convert the plain-text notes into styled HTML for the preview panel. */
function renderNotesAsHtml(rawNotes) {
  return rawNotes
    .replace(/━{20,}/g, '<hr class="border-blue-400/30 my-4" />')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-blue-200 font-bold">$1</strong>')
    .replace(
      /^(📘|🧠|📌|🧮|❓|📝|⚠️|📚|📄)(.+)$/gm,
      '<div class="text-xl font-bold text-blue-300 mt-6 mb-3">$1$2</div>'
    )
    .replace(
      /^###\s+(.+)$/gm,
      '<h4 class="text-lg font-bold text-blue-200 mt-4 mb-2">$1</h4>'
    )
    .replace(/^- (.+)$/gm, '<div class="ml-4 mb-2 text-white/70">• $1</div>')
    .replace(/^• (.+)$/gm, '<div class="ml-4 mb-2 text-white/70">• $1</div>')
    .replace(/^\d+\.\s(.+)$/gm, '<div class="ml-4 mb-2 text-white/70">$&</div>');
}

// ─── Main component ───────────────────────────────────────────────────────────

const AiStudyAssistant = () => {
  const [storedPdfs, setStoredPdfs] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [studyNotes, setStudyNotes] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const pdfExtractor = usePdfExtractor({
    onFileCleared: () => {
      setStudyNotes(null);
      setAnalysisError(null);
    },
  });

  useEffect(() => {
    setStoredPdfs(loadSyllabusPdfs());
  }, []);

  async function handleAnalyze() {
    if (!pdfExtractor.uploadedFile && !selectedSubject) {
      setAnalysisError("Upload a PDF or select a subject that already has one.");
      return;
    }
    if (pdfExtractor.uploadedFile && !selectedSubject) {
      setAnalysisError("Enter a subject name for the uploaded PDF.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setStudyNotes(null);

    try {
      let pdfText;
      if (pdfExtractor.uploadedFile) {
        pdfText = await pdfExtractor.extractTextFromFileObject(pdfExtractor.uploadedFile);
      } else if (storedPdfs[selectedSubject]) {
        pdfText = await pdfExtractor.extractTextFromBase64DataUrl(
          storedPdfs[selectedSubject].fileData
        );
      } else {
        throw new Error("No PDF found for this subject.");
      }

      const notes = buildStudyNotes(pdfText, selectedSubject || "Unknown Subject");
      setStudyNotes(notes);
    } catch (err) {
      setAnalysisError(err.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleCopyNotes() {
    if (!studyNotes) return;
    try {
      await navigator.clipboard.writeText(studyNotes);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setAnalysisError("Clipboard write failed.");
    }
  }

  const subjectsWithStoredPdfs = SUBJECTS.filter((s) => storedPdfs[s]);
  const safeFileStem = selectedSubject?.replace(/\s+/g, "_") || "study";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Study Notes Assistant</h2>
        <p className="text-white/60">
          Upload course syllabus or lecture slides to generate comprehensive, structured study notes
        </p>
      </div>

      {/* PDF upload */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm border-2 border-blue-400/30 rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-300" />
          Upload PDF
        </h3>
        <PdfDropZone
          uploadedFile={pdfExtractor.uploadedFile}
          isDragging={pdfExtractor.isDragging}
          fileInputRef={pdfExtractor.fileInputRef}
          onFileInputChange={(e) =>
            pdfExtractor.handleFileInputChange(e, () => {
              setStudyNotes(null);
            })
          }
          onDragOver={pdfExtractor.handleDragOver}
          onDragLeave={pdfExtractor.handleDragLeave}
          onDrop={(e) =>
            pdfExtractor.handleDrop(e, () => {
              setStudyNotes(null);
            })
          }
          onRemoveFile={pdfExtractor.clearUploadedFile}
        />
      </div>

      {/* Subject + generate */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-semibold text-white/70 mb-3">
          Subject / Topic Name
        </label>

        {pdfExtractor.uploadedFile ? (
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            placeholder="e.g. Mathematics, Physics, History…"
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all mb-6"
          />
        ) : (
          <>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setStudyNotes(null);
                setAnalysisError(null);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all mb-6"
            >
              <option value="">Choose from existing PDFs…</option>
              {subjectsWithStoredPdfs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {selectedSubject && storedPdfs[selectedSubject] && (
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg mb-6">
                <FileText size={24} className="text-blue-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {sanitizeDisplayFileName(storedPdfs[selectedSubject].fileName, selectedSubject)}
                  </p>
                  <p className="text-white/50 text-sm">
                    Uploaded on{" "}
                    {new Date(storedPdfs[selectedSubject].uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={handleAnalyze}
          disabled={(!pdfExtractor.uploadedFile && !selectedSubject) || isAnalyzing}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          {isAnalyzing ? (
            <>
              <Loader size={20} className="animate-spin" />
              Generating Study Notes…
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Study Notes
            </>
          )}
        </button>
      </div>

      {/* Errors */}
      <ErrorBanner message={analysisError || pdfExtractor.extractionError} />

      {/* Notes output */}
      {studyNotes && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 space-y-6">
          {/* Toolbar */}
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
                {isCopied ? (
                  <>
                    <Check size={18} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} className="text-white/70" />
                    <span className="text-white/70 text-sm font-semibold">Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={() => downloadTextFile(`${safeFileStem}_notes.txt`, studyNotes)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Download as .txt"
              >
                <Download size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">.txt</span>
              </button>
              <button
                onClick={() =>
                  downloadTextFile(`${safeFileStem}_notes.md`, studyNotes, "text/markdown")
                }
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Download as .md"
              >
                <Download size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-semibold">.md</span>
              </button>
            </div>
          </div>

          {/* Notes preview */}
          <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
            <div
              className="text-white/80 whitespace-pre-wrap leading-relaxed font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: renderNotesAsHtml(studyNotes) }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AiStudyAssistant;
