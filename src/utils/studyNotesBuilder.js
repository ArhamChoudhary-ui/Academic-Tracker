/**
 * studyNotesBuilder.js
 *
 * Converts raw PDF text into a structured, human-readable study-notes string.
 * Extracted from AiStudyAssistant so the component file stays focused on UI.
 */

// ─── Text cleaning ────────────────────────────────────────────────────────────

function cleanPdfText(rawText) {
  return rawText
    .replace(/\d+\s*$/gm, "")                          // trailing page numbers
    .replace(/^(page|Page|PAGE)\s*\d+.*$/gm, "")       // page headers
    .replace(/^(header|footer|copyright|©).*$/gim, "") // boilerplate lines
    .replace(/(.+)\n\1+/g, "$1")                        // duplicate consecutive lines
    .replace(/\n{3,}/g, "\n\n")                         // excessive blank lines
    .replace(/^references$/im, "")                      // references section header
    .trim();
}

// ─── Structure detection ──────────────────────────────────────────────────────

const HEADING_PATTERNS = [
  (line) => line.length < 50 && line === line.toUpperCase() && line.length > 3,
  (line) => /^\d+\.?\s+[A-Z]/.test(line),
  (line) => /^(chapter|unit|module|section|topic|lecture)/i.test(line),
];

function isHeading(line) {
  return HEADING_PATTERNS.some((test) => test(line));
}

function isDefinitionSentence(line) {
  return /definition|define|is defined as|refers to|means that/i.test(line);
}

function looksLikeMathExpression(line) {
  return (
    /[=+\-*/^()]/.test(line) &&
    line.length < 100 &&
    /[a-zA-Z]/.test(line)
  );
}

function extractStructure(cleanText) {
  const lines = cleanText.split("\n").filter((l) => l.trim().length > 0);
  const headings = [];
  const definitions = [];
  const mathExpressions = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (isHeading(trimmed)) headings.push(trimmed.replace(/^\d+\.?\s*/, ""));
    if (isDefinitionSentence(trimmed)) definitions.push(trimmed);
    if (looksLikeMathExpression(trimmed)) mathExpressions.push(trimmed);
  }

  return { lines, headings, definitions, mathExpressions };
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildSummaryBullets(subject, headings, definitions, mathExpressions, charCount) {
  return [
    `This document covers content related to ${subject}`,
    headings.length > 0
      ? `Main topics include: ${headings.slice(0, 3).join(", ")}`
      : "Contains academic material for learning and revision",
    definitions.length > 0
      ? `Contains ${definitions.length} key definitions and concepts`
      : "Provides explanations of core concepts",
    mathExpressions.length > 0
      ? `Includes ${mathExpressions.length} formulas or mathematical expressions`
      : "Focuses on theoretical understanding",
    "Structured for student comprehension and exam preparation",
    "Suitable for creating detailed study notes and revision materials",
    `Total content: approximately ${Math.ceil(charCount / 1000)} KB of text extracted`,
    "Can be used for in-depth learning or quick revision",
  ];
}

function buildKeyPoints(lines) {
  return lines
    .filter((line) => {
      const l = line.trim();
      return (
        l.length > 30 &&
        l.length < 150 &&
        (/important|key|main|essential|fundamental|critical|note|remember/i.test(l) ||
          l.endsWith(".") ||
          l.endsWith(":"))
      );
    })
    .slice(0, 15)
    .map((p) => p.trim());
}

function buildDetailedNotesSection(subject, headings, cleanText) {
  if (headings.length > 0) {
    return headings
      .slice(0, 8)
      .map(
        (heading) =>
          `### ${heading}\n` +
          `- This topic covers important aspects of ${subject}\n` +
          `- Refer to the original document for detailed explanations\n` +
          `- Focus on understanding the core principles`
      )
      .join("\n\n");
  }
  return (
    `### Core Content\n` +
    `- The document provides comprehensive coverage of ${subject}\n` +
    `- Content is organised into logical sections\n` +
    `- Each section builds on previous knowledge\n` +
    `- Examples and explanations are provided throughout\n` +
    `- Material is suitable for both learning and revision`
  );
}

function buildFormulasAndDefinitionsSection(definitions, mathExpressions) {
  let section = "";
  if (definitions.length > 0) {
    section += `**Definitions Found:**\n${definitions
      .slice(0, 10)
      .map((d) => `- ${d}`)
      .join("\n")}\n\n`;
  }
  if (mathExpressions.length > 0) {
    section += `**Formulas / Expressions:**\n${mathExpressions
      .slice(0, 10)
      .map((f) => `- ${f}`)
      .join("\n")}`;
  }
  if (!section) {
    section = "No explicit formulas or definitions found in this document.\nRefer to the detailed notes above for conceptual understanding.";
  }
  return section;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Converts raw PDF text into a formatted study-notes string.
 *
 * @param {string} pdfText  Plain text extracted from a PDF.
 * @param {string} subject  Subject name (used in headings and practice questions).
 * @returns {string}        Multi-section study notes ready for display or export.
 */
export function buildStudyNotes(pdfText, subject) {
  const cleanText = cleanPdfText(pdfText);
  const { lines, headings, definitions, mathExpressions } = extractStructure(cleanText);

  const title = headings[0] || `${subject} Study Notes`;
  const summaryBullets = buildSummaryBullets(
    subject, headings, definitions, mathExpressions, cleanText.length
  );
  const keyPoints = buildKeyPoints(lines);
  const detailedNotes = buildDetailedNotesSection(subject, headings, cleanText);
  const formulasSection = buildFormulasAndDefinitionsSection(definitions, mathExpressions);

  const practiceQuestions = [
    `What are the main concepts covered in ${subject}?`,
    "Explain the fundamental principles discussed in this document",
    "Define the key terms and their significance",
    headings[0] ? `Discuss the topic: ${headings[0]}` : "What are the learning objectives of this material?",
    mathExpressions.length > 0 ? "Derive and explain the important formulas" : "How do the concepts relate to each other?",
    "Compare and contrast the different concepts presented",
    "Apply the knowledge to solve practical problems",
    definitions.length > 0 ? "List and explain all key definitions" : "What are the main takeaways from this content?",
    "How can this material be applied in real-world scenarios?",
    "What are the common misconceptions or mistakes related to this topic?",
  ];

  const importantNotes = [
    "Review all definitions and ensure clear understanding",
    "Pay attention to any assumptions or conditions mentioned",
    mathExpressions.length > 0
      ? "Understand when and how to apply each formula"
      : "Focus on conceptual clarity rather than memorisation",
    "Note any special cases or exceptions highlighted in the text",
    "Look for connections between different sections of the material",
  ];

  const revisionPoints = [
    `Subject: ${subject}`,
    headings.length > 0
      ? `Key Topics: ${headings.slice(0, 5).join(" | ")}`
      : "Core concepts covered in document",
    definitions.length > 0
      ? `${definitions.length} definitions to remember`
      : "Focus on understanding key ideas",
    mathExpressions.length > 0
      ? `${mathExpressions.length} formulas/expressions to practise`
      : "Theoretical foundation is crucial",
    "Review all key points before exam",
    "Practice questions to test understanding",
    "Connect concepts for holistic understanding",
  ];

  return `━━━━━━━━━━━━━━━━━━━━━━
📘 TITLE
━━━━━━━━━━━━━━━━━━━━━━
${title}

━━━━━━━━━━━━━━━━━━━━━━
🧠 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━
${summaryBullets.map((p) => `- ${p}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━
📚 DETAILED NOTES
━━━━━━━━━━━━━━━━━━━━━━
${detailedNotes}
${
  cleanText.length > 500
    ? `\n### Additional Content Notes\n- The PDF contains detailed explanations spanning ${Math.ceil(cleanText.length / 500)} paragraphs\n- Content requires careful reading and understanding\n- Make your own notes while studying the original material\n- Highlight important sections for quick revision`
    : ""
}

━━━━━━━━━━━━━━━━━━━━━━
📌 KEY POINTS
━━━━━━━━━━━━━━━━━━━━━━
${
  keyPoints.length > 0
    ? keyPoints.map((kp) => `- ${kp}`).join("\n")
    : "- Read the entire document carefully\n- Identify main concepts and supporting details\n- Create your own summary as you study\n- Note down questions that arise\n- Review regularly for retention"
}

━━━━━━━━━━━━━━━━━━━━━━
🧮 FORMULAS / DEFINITIONS
━━━━━━━━━━━━━━━━━━━━━━
${formulasSection}

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
• Memorise key definitions and formulas
• Practice all questions multiple times
• Create flashcards for quick revision
• Teach concepts to others to reinforce learning`;
}
