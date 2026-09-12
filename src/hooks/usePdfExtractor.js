import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Iterates over every page in a loaded pdf.js document and concatenates
 * the plain text from each page with a blank line between pages.
 */
async function readPagesAsText(pdfDocument) {
  let fullText = "";
  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n\n";
  }
  return fullText;
}

/**
 * Shared hook for PDF file validation, drag-and-drop upload, and text extraction.
 *
 * Eliminates the ~120 lines of copy-pasted PDF handling that existed in
 * both AiStudyAssistant and ExamQuestionGenerator.
 */
export function usePdfExtractor({ onFileCleared } = {}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractionError, setExtractionError] = useState(null);

  const fileInputRef = useRef(null);

  function validatePdfFile(file) {
    if (!file) return "No file selected.";
    if (file.type !== "application/pdf") return "Only PDF files are accepted.";
    if (file.size > MAX_PDF_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return `File is ${sizeMb} MB — the 10 MB limit applies.`;
    }
    return null;
  }

  function acceptFile(file, clearOutput) {
    const validationError = validatePdfFile(file);
    if (validationError) {
      setExtractionError(validationError);
      return false;
    }
    setUploadedFile(file);
    setExtractionError(null);
    clearOutput?.();
    return true;
  }

  function handleFileInputChange(event, clearOutput) {
    const file = event.target.files[0];
    if (file) acceptFile(file, clearOutput);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e, clearOutput) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) acceptFile(file, clearOutput);
  }

  function clearUploadedFile() {
    setUploadedFile(null);
    setExtractionError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileCleared?.();
  }

  /** Extract text from a File object (freshly uploaded). */
  async function extractTextFromFileObject(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return readPagesAsText(pdfDoc);
    } catch (err) {
      throw new Error(
        "Could not extract text from this PDF — it may be image-based or corrupted.",
      );
    }
  }

  /** Extract text from a base64 data-URL (stored syllabus PDF). */
  async function extractTextFromBase64DataUrl(dataUrl) {
    try {
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
      return readPagesAsText(pdfDoc);
    } catch (err) {
      throw new Error(
        "Could not read the stored PDF — it may be corrupt or missing.",
      );
    }
  }

  return {
    uploadedFile,
    isDragging,
    extractionError,
    fileInputRef,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearUploadedFile,
    extractTextFromFileObject,
    extractTextFromBase64DataUrl,
    setExtractionError,
  };
}
