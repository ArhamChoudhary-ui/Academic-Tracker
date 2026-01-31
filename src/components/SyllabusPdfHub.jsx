import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  Download,
  AlertCircle,
  X,
} from "lucide-react";
import {
  loadSyllabusPdfs,
  saveSyllabusPdf,
  removeSyllabusPdf,
  getSyllabusPdf,
  getStorageSize,
  formatFileSize,
} from "../utils/syllabusPdfStorage";
import { SUBJECTS } from "../utils/data";

const SyllabusPdfHub = () => {
  const [pdfs, setPdfs] = useState({});
  const [storageSize, setStorageSize] = useState(0);
  const [uploadingSubject, setUploadingSubject] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);

  const loadPdfs = useCallback(() => {
    const allPdfs = loadSyllabusPdfs();
    setPdfs(allPdfs);
    setStorageSize(getStorageSize());
  }, []);

  useEffect(() => {
    loadPdfs();
  }, [loadPdfs]);

  const handleFileUpload = useCallback(
    async (subject, event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setUploadingSubject(subject);

      try {
        const success = await saveSyllabusPdf(subject, file);
        if (success) {
          loadPdfs();
          alert(`${subject} syllabus uploaded successfully!`);
        } else {
          alert("Failed to upload syllabus");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading file");
      } finally {
        setUploadingSubject(null);
        event.target.value = "";
      }
    },
    [loadPdfs],
  );

  const handleViewPdf = useCallback((subject) => {
    const pdf = getSyllabusPdf(subject);
    if (pdf && pdf.fileData) {
      setViewingPdf({ subject, ...pdf });
    }
  }, []);

  const handleDownloadPdf = useCallback((subject) => {
    const pdf = getSyllabusPdf(subject);
    if (pdf && pdf.fileData) {
      // Convert base64 to blob for proper download
      const byteString = atob(pdf.fileData.split(",")[1]);
      const mimeString = pdf.fileData.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = pdf.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleDeletePdf = useCallback(
    (subject) => {
      if (
        window.confirm(
          `Are you sure you want to delete the ${subject} syllabus?`,
        )
      ) {
        const success = removeSyllabusPdf(subject);
        if (success) {
          loadPdfs();
          alert("Syllabus deleted successfully");
        } else {
          alert("Failed to delete syllabus");
        }
      }
    },
    [loadPdfs],
  );

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Syllabus PDFs</h2>
        <p className="text-white/60">
          Upload and manage syllabus PDFs for each subject
        </p>
      </div>

      <div className="bg-blue-900/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex gap-3">
        <AlertCircle size={20} className="text-blue-300 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/80">
          <strong>Note:</strong> PDFs are stored in your browser's local
          storage. Maximum file size is 10MB per PDF.
        </div>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="text-sm text-white/60">Storage Used</div>
        <div className="text-lg font-semibold text-white">
          {formatFileSize(storageSize)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((subject) => {
          const pdf = pdfs[subject];
          const isUploading = uploadingSubject === subject;

          return (
            <div
              key={subject}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/[0.08] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg text-white">{subject}</h3>
                {pdf && <FileText size={24} className="text-blue-300" />}
              </div>

              {pdf ?
                <div className="space-y-4">
                  <div className="text-sm text-white/70">
                    <div className="font-medium text-white truncate">
                      {pdf.fileName}
                    </div>
                    <div className="mt-2 text-white/50">
                      Size: {formatFileSize(pdf.fileSize)}
                    </div>
                    <div className="text-white/50">
                      Uploaded: {formatDate(pdf.uploadDate)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewPdf(subject)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(subject)}
                      className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePdf(subject)}
                      className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <label className="block">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(subject, e)}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="cursor-pointer text-center px-3 py-2 border-2 border-dashed border-white/20 hover:border-blue-400 rounded-lg text-sm text-white/60 hover:text-blue-300 transition-colors">
                      Replace PDF
                    </div>
                  </label>
                </div>
              : <div>
                  <label className="block">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(subject, e)}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="cursor-pointer flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-white/20 hover:border-blue-400 rounded-lg transition-colors group">
                      {isUploading ?
                        <div className="text-blue-300 animate-pulse">
                          Uploading...
                        </div>
                      : <>
                          <Upload
                            size={32}
                            className="text-white/40 group-hover:text-blue-300 transition-colors"
                          />
                          <div className="text-sm text-white/60 group-hover:text-blue-300 text-center transition-colors">
                            <div className="font-medium">Upload PDF</div>
                            <div className="text-xs mt-1">Max 10MB</div>
                          </div>
                        </>
                      }
                    </div>
                  </label>
                </div>
              }
            </div>
          );
        })}
      </div>

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-blue-800 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {viewingPdf.subject} - Syllabus
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  {viewingPdf.fileName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadPdf(viewingPdf.subject)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Download size={18} />
                  Download
                </button>
                <button
                  onClick={() => setViewingPdf(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                  aria-label="Close PDF viewer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={viewingPdf.fileData}
                className="w-full h-full"
                title={`${viewingPdf.subject} Syllabus PDF`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SyllabusPdfHub);
