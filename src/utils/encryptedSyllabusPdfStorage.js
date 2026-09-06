/**
 * Encrypted Syllabus PDF Storage
 * Replaces original unencrypted storage with encrypted version
 */

import {
  saveEncryptedData,
  loadEncryptedData,
  deleteEncryptedData,
  clearAllEncryptedData,
  listEncryptedKeys,
} from "./secureStorage.js";
import { getEncryptionKey, getNonce } from "./authManager.js";
import { encodeBase64 } from "./crypto.js";

const SYLLABUS_PDF_KEY = "syllabus_pdfs";

/**
 * Save syllabus PDF with encryption
 * @param {string} subject - Subject name
 * @param {File} file - PDF file to save
 */
export const saveSyllabusPdf = async (subject, file) => {
  try {
    const encryptionKey = getEncryptionKey();
    const nonce = getNonce();

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const pdfData = {
            fileName: file.name,
            fileData: e.target.result, // base64 encoded PDF
            uploadDate: new Date().toISOString(),
            fileSize: file.size,
            fileType: file.type,
          };

          // Load existing PDFs
          const allPdfs = await loadAllPdfs(encryptionKey, nonce);
          allPdfs[subject] = pdfData;

          // Save encrypted
          await saveEncryptedData(
            SYLLABUS_PDF_KEY,
            allPdfs,
            encryptionKey,
            nonce,
          );
          resolve(true);
        } catch (error) {
          console.error("Error saving encrypted PDF:", error);
          reject(error);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file");
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error in saveSyllabusPdf:", error);
    throw error;
  }
};

/**
 * Load all syllabus PDFs (decrypted)
 */
export const loadSyllabusPdfs = async () => {
  try {
    const encryptionKey = getEncryptionKey();
    const nonce = getNonce();
    return await loadAllPdfs(encryptionKey, nonce);
  } catch (error) {
    console.error("Error loading PDFs:", error);
    throw error;
  }
};

/**
 * Internal function to load all PDFs
 */
const loadAllPdfs = async (encryptionKey, nonce) => {
  try {
    const data = await loadEncryptedData(SYLLABUS_PDF_KEY, encryptionKey);
    return data || {};
  } catch (error) {
    console.error("Error loading encrypted PDFs:", error);
    return {};
  }
};

/**
 * Remove syllabus PDF
 */
export const removeSyllabusPdf = async (subject) => {
  try {
    const encryptionKey = getEncryptionKey();
    const nonce = getNonce();

    const allPdfs = await loadAllPdfs(encryptionKey, nonce);
    delete allPdfs[subject];

    if (Object.keys(allPdfs).length === 0) {
      await deleteEncryptedData(SYLLABUS_PDF_KEY);
    } else {
      await saveEncryptedData(SYLLABUS_PDF_KEY, allPdfs, encryptionKey, nonce);
    }
    return true;
  } catch (error) {
    console.error("Error removing PDF:", error);
    throw error;
  }
};

/**
 * Get specific syllabus PDF
 */
export const getSyllabusPdf = async (subject) => {
  try {
    const pdfs = await loadSyllabusPdfs();
    return pdfs[subject] || null;
  } catch (error) {
    console.error("Error getting PDF:", error);
    throw error;
  }
};

/**
 * Clear all PDFs
 */
export const clearAllPdfs = async () => {
  try {
    const encryptionKey = getEncryptionKey();
    await deleteEncryptedData(SYLLABUS_PDF_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing PDFs:", error);
    throw error;
  }
};

/**
 * Get storage size of PDFs (encrypted size is approximate)
 */
export const getStorageSize = async () => {
  try {
    const pdfs = await loadSyllabusPdfs();
    let totalSize = 0;
    Object.values(pdfs).forEach((pdf) => {
      totalSize += pdf.fileSize || 0;
    });
    return totalSize;
  } catch (error) {
    console.error("Error calculating storage size:", error);
    return 0;
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
