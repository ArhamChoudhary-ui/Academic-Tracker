export const groupSessionsByDate = (sessions) => {
  if (!sessions || !Array.isArray(sessions)) return {};

  const grouped = {};

  sessions.forEach((session) => {
    try {
      if (!session.startTime) return;

      const date = new Date(session.startTime);
      const dateKey = date.toISOString().split("T")[0];

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    } catch (error) {
      console.error("Error grouping session by date:", error);
    }
  });

  return grouped;
};

export const getTotalStudyTimeForDate = (dateKey, groupedSessions) => {
  if (!groupedSessions[dateKey]) return 0;

  return groupedSessions[dateKey].reduce((total, session) => {
    const duration = session.durationSeconds || 0;
    return total + duration;
  }, 0);
};

export const getHeatmapColor = (totalSeconds) => {
  if (totalSeconds === 0) {
    return {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      hover: "hover:bg-gray-200 dark:hover:bg-gray-700",
      ring: "ring-gray-300 dark:ring-gray-600",
    };
  }

  const totalMinutes = totalSeconds / 60;

  if (totalMinutes < 30) {
    return {
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-700 dark:text-green-300",
      hover: "hover:bg-green-200 dark:hover:bg-green-800/60",
      ring: "ring-green-300 dark:ring-green-700",
    };
  }

  if (totalMinutes < 90) {
    return {
      bg: "bg-green-300 dark:bg-green-800/60",
      text: "text-green-900 dark:text-green-100",
      hover: "hover:bg-green-400 dark:hover:bg-green-700/80",
      ring: "ring-green-400 dark:ring-green-600",
    };
  }

  if (totalMinutes < 180) {
    return {
      bg: "bg-green-600 dark:bg-green-700",
      text: "text-white dark:text-white",
      hover: "hover:bg-green-700 dark:hover:bg-green-600",
      ring: "ring-green-500 dark:ring-green-500",
    };
  }

  return {
    bg: "bg-green-900 dark:bg-green-900/80",
    text: "text-white dark:text-white",
    hover: "hover:bg-green-800 dark:hover:bg-green-800/70",
    ring: "ring-green-700 dark:ring-green-800",
  };
};

export const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const matrix = [];
  let week = new Array(startingDayOfWeek).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    week.push({
      date: new Date(year, month, day),
      day,
      dateKey: new Date(year, month, day).toISOString().split("T")[0],
    });

    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    matrix.push(week);
  }

  return matrix;
};

export const getMonthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
};

export const formatDurationForDisplay = (seconds) => {
  if (seconds === 0) return "0 min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const getStudyStatsForDate = (dateKey, groupedSessions) => {
  const sessions = groupedSessions[dateKey] || [];

  if (sessions.length === 0) {
    return {
      totalSeconds: 0,
      totalMinutes: 0,
      sessionCount: 0,
      avgFocus: null,
      subjects: [],
      sessions: [],
    };
  }

  const totalSeconds = sessions.reduce(
    (sum, s) => sum + (s.durationSeconds || 0),
    0,
  );
  const focusRatings = sessions
    .filter((s) => s.focusRating !== null && s.focusRating !== undefined)
    .map((s) => s.focusRating);
  const avgFocus =
    focusRatings.length > 0 ?
      (focusRatings.reduce((a, b) => a + b, 0) / focusRatings.length).toFixed(1)
    : null;

  const subjects = [...new Set(sessions.map((s) => s.subject))];

  return {
    totalSeconds,
    totalMinutes: Math.round(totalSeconds / 60),
    sessionCount: sessions.length,
    avgFocus,
    subjects,
    sessions: sessions.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    }),
  };
};

export const isToday = (dateKey) => {
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  return dateKey === todayKey;
};

export const isCurrentMonth = (date, month, year) => {
  return date.getMonth() === month && date.getFullYear() === year;
};

export const calculateMonthStats = (groupedSessions, year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalMinutes = 0;
  let daysWithActivity = 0;
  let maxDayMinutes = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = new Date(year, month, day).toISOString().split("T")[0];
    const daySeconds = getTotalStudyTimeForDate(dateKey, groupedSessions);
    const dayMinutes = daySeconds / 60;

    if (dayMinutes > 0) {
      daysWithActivity++;
      totalMinutes += dayMinutes;
      maxDayMinutes = Math.max(maxDayMinutes, dayMinutes);
    }
  }

  return {
    totalMinutes: Math.round(totalMinutes),
    daysWithActivity,
    avgMinutesPerActiveDay:
      daysWithActivity > 0 ? Math.round(totalMinutes / daysWithActivity) : 0,
    maxDayMinutes: Math.round(maxDayMinutes),
  };
};
