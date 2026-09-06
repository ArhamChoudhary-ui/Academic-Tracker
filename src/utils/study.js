const STUDY_SESSIONS_KEY = "academic_tracker_study_sessions";

export const saveStudySession = (session) => {
  try {
    const sessions = loadAllStudySessions();
    const newSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error("Error saving study session:", error);
    return null;
  }
};

export const loadAllStudySessions = () => {
  try {
    const sessions = localStorage.getItem(STUDY_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error("Error loading study sessions:", error);
    return [];
  }
};

export const deleteStudySession = (sessionId) => {
  try {
    const sessions = loadAllStudySessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(STUDY_SESSIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting study session:", error);
    return false;
  }
};

export const getStudyStatsForSubject = (subject) => {
  const sessions = loadAllStudySessions();
  const subjectSessions = sessions.filter((s) => s.subject === subject);

  if (subjectSessions.length === 0) {
    return {
      totalMinutes: 0,
      sessionCount: 0,
      averageFocus: 0,
      averageDuration: 0,
    };
  }

  const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalFocus = subjectSessions.reduce((sum, s) => sum + s.focus, 0);
  const averageFocus = totalFocus / subjectSessions.length;
  const averageDuration = totalMinutes / subjectSessions.length;

  return {
    totalMinutes,
    sessionCount: subjectSessions.length,
    averageFocus: parseFloat(averageFocus.toFixed(1)),
    averageDuration: parseFloat(averageDuration.toFixed(1)),
  };
};

export const getAllSubjectStats = (subjects) => {
  const stats = {};
  subjects.forEach((subject) => {
    stats[subject] = getStudyStatsForSubject(subject);
  });
  return stats;
};

export const clearAllStudySessions = () => {
  try {
    localStorage.removeItem(STUDY_SESSIONS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing study sessions:", error);
    return false;
  }
};
