import React from "react";
import { FileText, Upload, X } from "lucide-react";
import { sanitizeDisplayFileName } from "../../utils/fileNameSanitizer";

/**
 * Reusable PDF upload zone. Used by both StudyNotesAssistant and
 * ExamQuestionGenerator. Stateless — state managed via usePdfExtractor.
 */
export function PdfDropZone({
  uploadedFile,
  isDragging,
  fileInputRef,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
}) {
  if (uploadedFile) {
    return (
      <div className="bg-white/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start gap-4">
          <FileText size={32} className="text-blue-300 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate mb-1">
              {sanitizeDisplayFileName(uploadedFile.name)}
            </p>
            <p className="text-white/60 text-sm">
              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={onRemoveFile}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
            title="Remove file"
          >
            <X size={20} className="text-white/60 group-hover:text-red-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileInputChange}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-500/20 scale-105"
            : "border-white/30 bg-white/5 hover:border-blue-400/50 hover:bg-white/10"
        }`}
      >
        <Upload size={48} className="mx-auto mb-4 text-blue-300/70" />
        <p className="text-white font-semibold mb-2">
          {isDragging ? "Drop PDF here" : "Click to upload or drag & drop"}
        </p>
        <p className="text-white/50 text-sm">PDF files only · Max 10 MB</p>
      </div>
    </>
  );
}
