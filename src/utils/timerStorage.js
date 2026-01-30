const TIMER_SESSIONS_KEY = "academic_tracker_timer_sessions";

export const saveTimerSession = (session) => {
  try {
    const sessions = loadTimerSessions();
    const newSession = {
      ...session,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem(TIMER_SESSIONS_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (error) {
    console.error("Error saving timer session:", error);
    return null;
  }
};

export const loadTimerSessions = () => {
  try {
    const sessions = localStorage.getItem(TIMER_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error("Error loading timer sessions:", error);
    return [];
  }
};

export const deleteTimerSession = (sessionId) => {
  try {
    const sessions = loadTimerSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(TIMER_SESSIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting timer session:", error);
    return false;
  }
};

export const getTimerStatsForSubject = (subject) => {
  try {
    const sessions = loadTimerSessions();
    const subjectSessions = sessions.filter((s) => s.subject === subject);

    if (subjectSessions.length === 0) {
      return {
        totalMinutes: 0,
        sessionCount: 0,
        averageDuration: 0,
        targetsCompleted: 0,
      };
    }

    const totalSeconds = subjectSessions.reduce(
      (sum, s) => sum + (s.durationSeconds || 0),
      0,
    );
    const targetsCompleted = subjectSessions.filter(
      (s) => s.completedTarget,
    ).length;

    return {
      totalMinutes: Math.round(totalSeconds / 60),
      sessionCount: subjectSessions.length,
      averageDuration: Math.round(totalSeconds / subjectSessions.length / 60),
      targetsCompleted,
    };
  } catch (error) {
    console.error("Error calculating timer stats:", error);
    return {
      totalMinutes: 0,
      sessionCount: 0,
      averageDuration: 0,
      targetsCompleted: 0,
    };
  }
};

export const getAllTimerStats = (subjects) => {
  const stats = {};
  subjects.forEach((subject) => {
    stats[subject] = getTimerStatsForSubject(subject);
  });
  return stats;
};

export const calculateDailyStreak = () => {
  try {
    const sessions = loadTimerSessions();
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate - sessionDate) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
};

export const clearAllTimerSessions = () => {
  try {
    localStorage.removeItem(TIMER_SESSIONS_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing timer sessions:", error);
    return false;
  }
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

export const calculateTargetCompletion = (durationSeconds, targetSeconds) => {
  if (targetSeconds === 0) return 0;
  return Math.min(100, (durationSeconds / targetSeconds) * 100);
};
