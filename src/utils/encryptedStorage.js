/**
 * Encrypted Storage Module
 * Replaces unencrypted localStorage with encrypted IndexedDB
 * All app data is encrypted with user password
 */

import {
  saveEncryptedData,
  loadEncryptedData,
  deleteEncryptedData,
} from "./secureStorage.js";
import { getEncryptionKey, getNonce } from "./authManager.js";
import { encodeBase64 } from "./crypto.js";

const SUBJECT_DATA_KEY = "subject_data";
const THEME_KEY = "user_theme"; // Non-sensitive
const WEIGHTS_KEY = "subject_weights";

/**
 * Save subject marks data (encrypted)
 */
export const saveToEncryptedStorage = async (data) => {
  try {
    const encryptionKey = getEncryptionKey();
    const nonce = getNonce();
    await saveEncryptedData(SUBJECT_DATA_KEY, data, encryptionKey, nonce);
    return true;
  } catch (error) {
    console.error("Error saving to encrypted storage:", error);
    throw error;
  }
};

/**
 * Load subject marks data (decrypted)
 */
export const loadFromEncryptedStorage = async () => {
  try {
    const encryptionKey = getEncryptionKey();
    const data = await loadEncryptedData(SUBJECT_DATA_KEY, encryptionKey);
    return data || null;
  } catch (error) {
    console.error("Error loading from encrypted storage:", error);
    throw error;
  }
};

/**
 * Save subject weights (encrypted)
 */
export const saveWeights = async (weights) => {
  try {
    const encryptionKey = getEncryptionKey();
    const nonce = getNonce();
    await saveEncryptedData(WEIGHTS_KEY, weights, encryptionKey, nonce);
    return true;
  } catch (error) {
    console.error("Error saving weights:", error);
    throw error;
  }
};

/**
 * Load subject weights (decrypted)
 */
export const loadWeights = async () => {
  try {
    const encryptionKey = getEncryptionKey();
    const data = await loadEncryptedData(WEIGHTS_KEY, encryptionKey);
    return data || null;
  } catch (error) {
    console.error("Error loading weights:", error);
    return null;
  }
};

/**
 * Save theme (non-sensitive, can be in localStorage)
 */
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
    return true;
  } catch (error) {
    console.error("Error saving theme:", error);
    return false;
  }
};

/**
 * Load theme
 */
export const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch (error) {
    console.error("Error loading theme:", error);
    return "light";
  }
};

/**
 * Clear all encrypted data
 */
export const clearAllEncryptedData = async () => {
  try {
    await deleteEncryptedData(SUBJECT_DATA_KEY);
    await deleteEncryptedData(WEIGHTS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing encrypted data:", error);
    throw error;
  }
};

/**
 * Export to CSV (decrypted data only)
 */
export const exportToCSV = async (data) => {
  const headers = [
    "Subject",
    "CAT-1",
    "CAT-2",
    "QUIZ-1",
    "QUIZ-2",
    "QUIZ-3",
    "INTERNALS",
    "FAT",
    "LAB",
    "Total",
  ];
  const rows = [];

  for (const [subject, subjectData] of Object.entries(data)) {
    const marks = subjectData.marks;
    const total = Object.values(marks).reduce((sum, val) => {
      return (
        sum +
        (val !== null && val !== undefined && !isNaN(val) ? Number(val) : 0)
      );
    }, 0);
    rows.push([
      subject,
      marks.cat1 || 0,
      marks.cat2 || 0,
      marks.quiz1 || 0,
      marks.quiz2 || 0,
      marks.quiz3 || 0,
      marks.internals?.toFixed(2) || 0,
      marks.fat || 0,
      marks.lab || 0,
      total.toFixed(2),
    ]);
  }

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `academic_marks_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Fallback to unencrypted storage (for migration or unauth access)
 * Use only with explicit user consent
 */
export const saveToStorage = (data) => {
  try {
    localStorage.setItem("academic_tracker_data", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

export const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("academic_tracker_data");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};

export const clearStorage = () => {
  try {
    localStorage.removeItem("academic_tracker_data");
    localStorage.removeItem("academic_tracker_weights");
    return true;
  } catch (error) {
    console.error("Error clearing storage:", error);
    return false;
  }
};
