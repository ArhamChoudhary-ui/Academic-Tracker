const SYLLABUS_KEY = "academic_tracker_syllabus_data";

export const createDefaultSyllabus = (subjects) => {
  const syllabus = {};
  subjects.forEach((subject) => {
    syllabus[subject] = [];
  });
  return syllabus;
};

export const saveSyllabusData = (data) => {
  try {
    localStorage.setItem(SYLLABUS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving syllabus data:", error);
    return false;
  }
};

export const loadSyllabusData = (subjects) => {
  try {
    const data = localStorage.getItem(SYLLABUS_KEY);
    const parsed = data ? JSON.parse(data) : {};

    subjects.forEach((subject) => {
      if (!parsed[subject]) {
        parsed[subject] = [];
      }
    });

    return parsed;
  } catch (error) {
    console.error("Error loading syllabus data:", error);
    return createDefaultSyllabus(subjects);
  }
};

export const clearSyllabusData = () => {
  try {
    localStorage.removeItem(SYLLABUS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing syllabus data:", error);
    return false;
  }
};

export const addTopic = (subject, topic, parentId = null) => {
  try {
    const allData = loadSyllabusData([]);
    if (!allData[subject]) {
      allData[subject] = [];
    }

    const newTopic = {
      id: `${subject}-${Date.now()}`,
      name: topic.name,
      completed: topic.completed || false,
      difficulty: topic.difficulty || null,
      notes: topic.notes || "",
      children: [],
    };

    if (parentId) {
      const parent = findTopic(allData[subject], parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(newTopic);
      }
    } else {
      allData[subject].push(newTopic);
    }

    saveSyllabusData(allData);
    return newTopic;
  } catch (error) {
    console.error("Error adding topic:", error);
    return null;
  }
};

export const findTopic = (topics, topicId) => {
  if (!Array.isArray(topics)) return null;

  for (const topic of topics) {
    if (topic.id === topicId) return topic;
    if (topic.children && topic.children.length > 0) {
      const found = findTopic(topic.children, topicId);
      if (found) return found;
    }
  }
  return null;
};

export const updateTopic = (subject, topicId, updates) => {
  try {
    const allData = loadSyllabusData([]);
    if (!allData[subject]) return null;

    const topic = findTopic(allData[subject], topicId);
    if (!topic) return null;

    Object.assign(topic, updates);
    saveSyllabusData(allData);
    return topic;
  } catch (error) {
    console.error("Error updating topic:", error);
    return null;
  }
};

export const deleteTopic = (subject, topicId) => {
  try {
    const allData = loadSyllabusData([]);
    if (!allData[subject]) return false;

    const removeFromArray = (arr) => {
      const index = arr.findIndex((t) => t.id === topicId);
      if (index !== -1) {
        arr.splice(index, 1);
        return true;
      }
      for (const topic of arr) {
        if (topic.children && removeFromArray(topic.children)) {
          return true;
        }
      }
      return false;
    };

    const removed = removeFromArray(allData[subject]);
    if (removed) {
      saveSyllabusData(allData);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting topic:", error);
    return false;
  }
};

export const getSyllabusForSubject = (subject, subjects) => {
  try {
    const allData = loadSyllabusData(subjects);
    return allData[subject] || [];
  } catch (error) {
    console.error("Error getting syllabus:", error);
    return [];
  }
};

export const getAllSyllabusData = (subjects) => {
  try {
    return loadSyllabusData(subjects);
  } catch (error) {
    console.error("Error getting all syllabus data:", error);
    return createDefaultSyllabus(subjects);
  }
};

const countCompletedTopics = (topics) => {
  if (!Array.isArray(topics)) return { total: 0, completed: 0 };

  let total = 0;
  let completed = 0;

  topics.forEach((topic) => {
    total += 1;
    if (topic.completed) completed += 1;

    if (topic.children && topic.children.length > 0) {
      const childCounts = countCompletedTopics(topic.children);
      total += childCounts.total;
      completed += childCounts.completed;
    }
  });

  return { total, completed };
};

export const getSubjectProgress = (subject, subjects) => {
  try {
    const syllabus = getSyllabusForSubject(subject, subjects);
    const counts = countCompletedTopics(syllabus);

    return {
      total: counts.total,
      completed: counts.completed,
      percentage:
        counts.total > 0 ?
          Math.round((counts.completed / counts.total) * 100)
        : 0,
    };
  } catch (error) {
    console.error("Error calculating subject progress:", error);
    return { total: 0, completed: 0, percentage: 0 };
  }
};

export const getOverallProgress = (subjects) => {
  try {
    let totalTopics = 0;
    let completedTopics = 0;

    subjects.forEach((subject) => {
      const progress = getSubjectProgress(subject, subjects);
      totalTopics += progress.total;
      completedTopics += progress.completed;
    });

    return {
      total: totalTopics,
      completed: completedTopics,
      percentage:
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    };
  } catch (error) {
    console.error("Error calculating overall progress:", error);
    return { total: 0, completed: 0, percentage: 0 };
  }
};

export const getAllTopicsFlattened = (subject, subjects) => {
  try {
    const syllabus = getSyllabusForSubject(subject, subjects);
    const flattened = [];

    const flatten = (topics) => {
      topics.forEach((topic) => {
        flattened.push(topic);
        if (topic.children && topic.children.length > 0) {
          flatten(topic.children);
        }
      });
    };

    flatten(syllabus);
    return flattened;
  } catch (error) {
    console.error("Error flattening topics:", error);
    return [];
  }
};

export const getTopicById = (subject, topicId, subjects) => {
  try {
    const syllabus = getSyllabusForSubject(subject, subjects);
    return findTopic(syllabus, topicId);
  } catch (error) {
    console.error("Error getting topic by ID:", error);
    return null;
  }
};

export const markTopicCompleted = (subject, topicId, completed = true) => {
  try {
    const topic = updateTopic(subject, topicId, { completed });
    return topic;
  } catch (error) {
    console.error("Error marking topic completed:", error);
    return null;
  }
};
