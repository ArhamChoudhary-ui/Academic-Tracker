/**
 * fileNameSanitizer.js
 * 
 * Sanitizes uploaded/stored file names for clean, natural human presentation.
 * Hides raw extensions (like .freebuff, .pdf, .tmp, etc.), strips random hashes/timestamps,
 * and ensures the displayed title appears as an authentic document name.
 */

const EXTENSIONS_REGEX = /\.(freebuff|pdf|docx?|txt|tmp|bin|crdownload|dat|bak)$/gi;
const JUNK_SUFFIX_REGEX = /([_-]?(v\d+|copy|\(\d+\)|\[\d+\]|final|compressed|\d{8,}|\b[a-f0-9]{8,}\b))+$/gi;

/**
 * Format a string to clean Title Case.
 */
function toTitleCase(str) {
  return str
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => {
      if (word.length <= 2 && /^[A-Z0-9]+$/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Sanitizes a file name for display in the UI.
 * Completely removes raw extensions (e.g. .freebuff) and formats naturally.
 *
 * @param {string} rawFileName - The raw name of the file or stored path
 * @param {string} [subjectName] - Optional associated subject name for fallback
 * @returns {string} Clean, natural human document title without extensions
 */
export function sanitizeDisplayFileName(rawFileName, subjectName = "") {
  if (!rawFileName || typeof rawFileName !== "string") {
    return subjectName ? `${subjectName} Course Syllabus` : "Syllabus Document";
  }

  // Strip all recognized extensions repeatedly (e.g. .pdf.freebuff)
  let clean = rawFileName;
  while (EXTENSIONS_REGEX.test(clean)) {
    clean = clean.replace(EXTENSIONS_REGEX, "");
  }

  // Strip trailing hash/version/timestamp artifacts
  clean = clean.replace(JUNK_SUFFIX_REGEX, "").trim();

  // If the resulting name is too short, numeric, or unhelpful, use the subject name
  if (!clean || clean.length < 3 || /^\d+$/.test(clean) || /^[a-f0-9]+$/i.test(clean)) {
    return subjectName ? `${subjectName} Course Outline` : "Course Syllabus";
  }

  const title = toTitleCase(clean);

  // If the title doesn't mention syllabus/outline/curriculum, append a natural descriptor
  if (!/(syllabus|outline|curriculum|notes|handout|guide|overview)/i.test(title)) {
    return `${title} Document`;
  }

  return title;
}

/**
 * Generates a clean, safe download filename with standard .pdf extension,
 * hiding any internal backend extensions like .freebuff.
 *
 * @param {string} rawFileName - The stored file name
 * @param {string} [subjectName] - Associated subject
 * @returns {string} e.g. "Physics_Course_Syllabus.pdf"
 */
export function getSafeDownloadFileName(rawFileName, subjectName = "") {
  const displayTitle = sanitizeDisplayFileName(rawFileName, subjectName);
  const safeBase = displayTitle.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_");
  return `${safeBase || "Syllabus"}.pdf`;
}
