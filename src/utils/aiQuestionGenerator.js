/**
 * AI Exam Question Generator
 * Generates exam-oriented questions from extracted PDF text
 */

export const generateExamQuestions = (pdfText, subject, difficulty) => {
  // Clean and prepare text
  const cleanText = pdfText
    .replace(/\d+\s*$/gm, "")
    .replace(/^(page|Page|PAGE)\s*\d+.*$/gm, "")
    .replace(/(.+)\n\1+/g, "$1")
    .trim();

  const lines = cleanText.split("\n").filter((line) => line.trim().length > 0);

  // Detect content types
  const hasFormulas = /[=+\-*/^()]/.test(cleanText) && /[0-9]/.test(cleanText);
  const hasDefinitions =
    /definition|define|is defined as|refers to|means that/i.test(cleanText);
  const topics = extractTopics(lines);
  const keyTerms = extractKeyTerms(cleanText);

  // Generate questions based on difficulty
  const questions = {
    mcqs: generateMCQs(cleanText, subject, difficulty, topics, keyTerms),
    twoMarkers: generateTwoMarkers(cleanText, subject, difficulty, topics),
    fiveMarkers: generateFiveMarkers(cleanText, subject, difficulty, topics),
    numericals:
      hasFormulas ? generateNumericals(cleanText, subject, difficulty) : null,
    definitions:
      hasDefinitions ?
        generateDefinitionQuestions(cleanText, subject, keyTerms)
      : [],
    commonMistakes: generateCommonMistakes(cleanText, subject, difficulty),
  };

  return questions;
};

// Extract topics/headings from text
const extractTopics = (lines) => {
  const topics = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (
      (trimmed.length < 50 &&
        trimmed === trimmed.toUpperCase() &&
        trimmed.length > 3) ||
      /^\d+\.?\s+[A-Z]/.test(trimmed) ||
      /^(chapter|unit|module|section|topic|lecture)/i.test(trimmed)
    ) {
      topics.push(trimmed.replace(/^\d+\.?\s*/, ""));
    }
  });
  return topics.slice(0, 10);
};

// Extract key terms
const extractKeyTerms = (text) => {
  const terms = new Set();
  const words = text.split(/\s+/);

  words.forEach((word) => {
    const clean = word.replace(/[^a-zA-Z]/g, "");
    if (clean.length > 4 && clean[0] === clean[0].toUpperCase()) {
      terms.add(clean);
    }
  });

  return Array.from(terms).slice(0, 20);
};

// Generate MCQs
const generateMCQs = (text, subject, difficulty, topics, terms) => {
  const mcqs = [];
  const count =
    difficulty === "easy" ? 5
    : difficulty === "medium" ? 7
    : 10;

  const templates = {
    easy: [
      { q: `What is the primary focus of ${subject}?`, type: "concept" },
      {
        q: `Which of the following is related to ${topics[0] || subject}?`,
        type: "relation",
      },
      { q: `The main purpose of studying ${subject} is:`, type: "purpose" },
    ],
    medium: [
      {
        q: `In the context of ${subject}, ${topics[0] || "this topic"} primarily deals with:`,
        type: "context",
      },
      {
        q: `Which statement correctly describes ${topics[1] || "the concept"}?`,
        type: "description",
      },
      {
        q: `The relationship between ${terms[0] || "concepts"} and ${terms[1] || "applications"} is best explained as:`,
        type: "relationship",
      },
    ],
    hard: [
      {
        q: `Consider the advanced concepts in ${subject}. Which of the following BEST represents the critical analysis of ${topics[0] || "this topic"}?`,
        type: "analysis",
      },
      {
        q: `In competitive examinations, the most frequently tested aspect of ${topics[1] || subject} is:`,
        type: "competitive",
      },
      {
        q: `Which of the following statements about ${terms[0] || "the topic"} is INCORRECT?`,
        type: "negative",
      },
    ],
  };

  const selectedTemplates = templates[difficulty] || templates.medium;

  for (let i = 0; i < count; i++) {
    const template = selectedTemplates[i % selectedTemplates.length];
    const options = generateOptions(text, terms, i);

    mcqs.push({
      question: template.q,
      options: options.choices,
      correctAnswer: options.correct,
      explanation: `Based on the content about ${subject}, option ${options.correct} is the most accurate.`,
    });
  }

  return mcqs;
};

// Generate options for MCQ
const generateOptions = (text, terms, seed) => {
  const optionLabels = ["A", "B", "C", "D"];
  const choices = [];

  // Generate 4 options using available terms or generic text
  for (let i = 0; i < 4; i++) {
    const term = terms[(seed + i) % terms.length] || `Concept ${i + 1}`;
    choices.push(`${optionLabels[i]}. ${generateOptionText(term, i, seed)}`);
  }

  // Randomly select correct answer (but deterministically based on seed)
  const correct = optionLabels[seed % 4];

  return { choices, correct };
};

const generateOptionText = (term, index, seed) => {
  const patterns = [
    `Understanding and application of ${term}`,
    `${term} and its practical implications`,
    `Theoretical framework of ${term}`,
    `${term} in real-world scenarios`,
  ];
  return patterns[(seed + index) % patterns.length];
};

// Generate 2-mark questions
const generateTwoMarkers = (text, subject, difficulty, topics) => {
  const questions = [];
  const count =
    difficulty === "easy" ? 5
    : difficulty === "medium" ? 7
    : 10;

  const templates = {
    easy: [
      `Define ${topics[0] || subject}.`,
      `What is meant by ${topics[1] || "the main concept"}?`,
      `List two key features of ${subject}.`,
      `State the importance of ${topics[0] || "this topic"}.`,
      `Mention two applications of ${subject}.`,
    ],
    medium: [
      `Explain briefly the concept of ${topics[0] || subject}.`,
      `Differentiate between ${topics[0] || "concept A"} and ${topics[1] || "concept B"}.`,
      `State and explain any two principles of ${subject}.`,
      `Write a short note on ${topics[1] || "the key topic"}.`,
      `What are the main characteristics of ${topics[0] || subject}?`,
    ],
    hard: [
      `Critically analyze the role of ${topics[0] || subject} in modern applications.`,
      `Derive or prove the fundamental relationship in ${topics[1] || subject}.`,
      `Compare and contrast ${topics[0] || "concept A"} with ${topics[1] || "concept B"}.`,
      `Justify why ${topics[0] || "this approach"} is preferred in ${subject}.`,
      `Evaluate the significance of ${topics[1] || "the theory"} in practical scenarios.`,
    ],
  };

  const selectedTemplates = templates[difficulty] || templates.medium;

  for (let i = 0; i < Math.min(count, selectedTemplates.length); i++) {
    questions.push({
      question: selectedTemplates[i],
      marks: 2,
      type: "short",
    });
  }

  return questions;
};

// Generate 5-mark questions
const generateFiveMarkers = (text, subject, difficulty, topics) => {
  const questions = [];
  const count =
    difficulty === "easy" ? 3
    : difficulty === "medium" ? 5
    : 7;

  const templates = {
    easy: [
      `Describe the basic concepts of ${subject}.`,
      `Explain the main principles of ${topics[0] || subject}.`,
      `Discuss the importance of ${subject} in academic learning.`,
    ],
    medium: [
      `Explain in detail the concept of ${topics[0] || subject} with suitable examples.`,
      `Describe the various aspects of ${topics[1] || "the topic"} and their applications.`,
      `Discuss the theoretical framework of ${subject} and its practical implications.`,
      `Elaborate on the key principles governing ${topics[0] || "the concept"}.`,
      `Analyze the relationship between ${topics[0] || "theory"} and ${topics[1] || "practice"} in ${subject}.`,
    ],
    hard: [
      `Critically examine the advanced concepts of ${topics[0] || subject} with proper derivations and examples.`,
      `Derive and explain the fundamental equations/principles of ${subject}. Discuss their applications in competitive scenarios.`,
      `Compare and contrast different approaches to ${topics[0] || "problem-solving"} in ${subject}. Which is most efficient and why?`,
      `Analyze the complex interplay between ${topics[0] || "theoretical aspects"} and ${topics[1] || "practical applications"}. Provide case studies.`,
      `Evaluate the strengths and limitations of ${topics[1] || "the methodology"} used in ${subject}. Suggest improvements.`,
    ],
  };

  const selectedTemplates = templates[difficulty] || templates.medium;

  for (let i = 0; i < Math.min(count, selectedTemplates.length); i++) {
    questions.push({
      question: selectedTemplates[i],
      marks: 5,
      type: "theory",
    });
  }

  return questions;
};

// Generate numerical problems
const generateNumericals = (text, subject, difficulty) => {
  // Extract formulas
  const formulas = [];
  const lines = text.split("\n");

  lines.forEach((line) => {
    if (
      /[=+\-*/^()]/.test(line) &&
      line.length < 100 &&
      /[a-zA-Z]/.test(line)
    ) {
      formulas.push(line.trim());
    }
  });

  if (formulas.length === 0) {
    return null;
  }

  const questions = [];
  const count =
    difficulty === "easy" ? 3
    : difficulty === "medium" ? 5
    : 7;

  for (let i = 0; i < Math.min(count, 5); i++) {
    const difficultyText =
      difficulty === "easy" ? "simple"
      : difficulty === "medium" ? "moderate"
      : "complex";
    questions.push({
      question: `Solve the following ${difficultyText} numerical problem related to ${subject}: Using the concepts discussed, calculate the required value when appropriate parameters are given.`,
      marks:
        difficulty === "easy" ? 3
        : difficulty === "medium" ? 5
        : 8,
      type: "numerical",
      hint:
        formulas[i % formulas.length] ||
        "Use the relevant formula from the text",
    });
  }

  return questions;
};

// Generate definition questions
const generateDefinitionQuestions = (text, subject, terms) => {
  const questions = [];
  const definitionRegex =
    /(.{10,50})\s+(is defined as|is|means|refers to)\s+(.{20,100})/gi;
  const matches = [...text.matchAll(definitionRegex)];

  matches.slice(0, 8).forEach((match, i) => {
    const term = match[1].trim();
    questions.push({
      question: `Define: ${term}`,
      marks: 1,
      type: "definition",
    });
  });

  // If no matches, use key terms
  if (questions.length === 0) {
    terms.slice(0, 5).forEach((term) => {
      questions.push({
        question: `Define: ${term}`,
        marks: 1,
        type: "definition",
      });
    });
  }

  return questions;
};

// Generate common mistakes
const generateCommonMistakes = (text, subject, difficulty) => {
  const mistakes = [];

  const templates = {
    easy: [
      `Confusing basic terminology in ${subject}`,
      `Not understanding fundamental concepts clearly`,
      `Skipping important definitions`,
      `Ignoring simple examples that clarify concepts`,
    ],
    medium: [
      `Misapplying formulas without understanding conditions`,
      `Confusing similar concepts due to lack of practice`,
      `Not writing complete answers in theory questions`,
      `Ignoring units and significant figures in numerical problems`,
      `Rushing through derivations without proper steps`,
    ],
    hard: [
      `Failing to identify which approach to use in complex problems`,
      `Not considering boundary conditions and special cases`,
      `Mixing up similar-looking formulas in competitive exams`,
      `Inadequate analysis of multi-step problems`,
      `Not connecting theoretical concepts with practical applications`,
      `Overlooking hidden assumptions in problem statements`,
    ],
  };

  const selected = templates[difficulty] || templates.medium;

  selected.forEach((mistake, i) => {
    mistakes.push({
      mistake: mistake,
      tip: `Review the relevant section carefully and practice related problems.`,
    });
  });

  return mistakes;
};
