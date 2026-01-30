const PLANNER_KEY = "academic_tracker_planner_data";

export const savePlannerData = (data) => {
  try {
    localStorage.setItem(PLANNER_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving planner data:", error);
    return false;
  }
};

export const loadPlannerData = () => {
  try {
    const data = localStorage.getItem(PLANNER_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading planner data:", error);
    return {};
  }
};

export const clearPlannerData = () => {
  try {
    localStorage.removeItem(PLANNER_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing planner data:", error);
    return false;
  }
};

export const addPlannerTask = (dateKey, task) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) {
      data[dateKey] = [];
    }
    const newTask = {
      ...task,
      id: `${dateKey}-${Date.now()}`,
    };
    data[dateKey].push(newTask);
    savePlannerData(data);
    return newTask;
  } catch (error) {
    console.error("Error adding planner task:", error);
    return null;
  }
};

export const updatePlannerTask = (dateKey, taskId, updates) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) return null;

    const taskIndex = data[dateKey].findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return null;

    data[dateKey][taskIndex] = {
      ...data[dateKey][taskIndex],
      ...updates,
    };
    savePlannerData(data);
    return data[dateKey][taskIndex];
  } catch (error) {
    console.error("Error updating planner task:", error);
    return null;
  }
};

export const deletePlannerTask = (dateKey, taskId) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) return false;

    data[dateKey] = data[dateKey].filter((t) => t.id !== taskId);
    if (data[dateKey].length === 0) {
      delete data[dateKey];
    }
    savePlannerData(data);
    return true;
  } catch (error) {
    console.error("Error deleting planner task:", error);
    return false;
  }
};

export const getPlannerTasksForDate = (dateKey) => {
  try {
    const data = loadPlannerData();
    return data[dateKey] || [];
  } catch (error) {
    console.error("Error getting planner tasks:", error);
    return [];
  }
};

export const getAllPlannerTasks = () => {
  try {
    return loadPlannerData();
  } catch (error) {
    console.error("Error getting all planner tasks:", error);
    return {};
  }
};

export const getUpcomingTasks = (daysAhead = 7) => {
  try {
    const data = loadPlannerData();
    const today = new Date();
    const upcoming = [];

    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split("T")[0];

      if (data[dateKey]) {
        upcoming.push({
          date: dateKey,
          tasks: data[dateKey],
        });
      }
    }

    return upcoming;
  } catch (error) {
    console.error("Error getting upcoming tasks:", error);
    return [];
  }
};

export const getTasksBySubject = (subject) => {
  try {
    const data = loadPlannerData();
    const tasks = [];

    for (const dateKey in data) {
      const dateTasks = data[dateKey].filter((t) => t.subject === subject);
      tasks.push(...dateTasks.map((t) => ({ ...t, dateKey })));
    }

    return tasks;
  } catch (error) {
    console.error("Error getting tasks by subject:", error);
    return [];
  }
};
