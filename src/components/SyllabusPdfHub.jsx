import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  Download,
  AlertCircle,
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
      window.open(pdf.fileData, "_blank");
    }
  }, []);

  const handleDownloadPdf = useCallback((subject) => {
    const pdf = getSyllabusPdf(subject);
    if (pdf && pdf.fileData) {
      const link = document.createElement("a");
      link.href = pdf.fileData;
      link.download = pdf.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Syllabus PDF Hub
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Upload and manage syllabus PDFs for each subject
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Storage Used
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatFileSize(storageSize)}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle
            size={20}
            className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
          />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> PDFs are stored in your browser's local
            storage. Maximum file size is 10MB per PDF. Large files may affect
            browser performance.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUBJECTS.map((subject) => {
            const pdf = pdfs[subject];
            const isUploading = uploadingSubject === subject;

            return (
              <div
                key={subject}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {subject}
                  </h3>
                  {pdf && (
                    <FileText
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}
                </div>

                {pdf ?
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {pdf.fileName}
                      </div>
                      <div className="mt-1">
                        Size: {formatFileSize(pdf.fileSize)}
                      </div>
                      <div>Uploaded: {formatDate(pdf.uploadDate)}</div>
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
                        className="flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
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
                      <div className="cursor-pointer text-center px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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
                      <div className="cursor-pointer flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg transition-colors group">
                        {isUploading ?
                          <div className="text-blue-600 dark:text-blue-400 animate-pulse">
                            Uploading...
                          </div>
                        : <>
                            <Upload
                              size={32}
                              className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors"
                            />
                            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center">
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
      </div>
    </div>
  );
};

export default memo(SyllabusPdfHub);
