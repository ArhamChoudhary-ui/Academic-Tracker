const SUBJECT_PLANNER_KEY = "academic_tracker_subject_planner";

export const savePlannerData = (data) => {
  try {
    localStorage.setItem(SUBJECT_PLANNER_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving planner data:", error);
    return false;
  }
};

export const loadPlannerData = () => {
  try {
    const data = localStorage.getItem(SUBJECT_PLANNER_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading planner data:", error);
    return {};
  }
};

export const clearPlannerData = () => {
  try {
    localStorage.removeItem(SUBJECT_PLANNER_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing planner data:", error);
    return false;
  }
};

export const addPlanToDate = (dateKey, plan) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) {
      data[dateKey] = [];
    }
    data[dateKey].push({
      ...plan,
      id: Date.now().toString(),
    });
    savePlannerData(data);
    return true;
  } catch (error) {
    console.error("Error adding plan:", error);
    return false;
  }
};

export const removePlanFromDate = (dateKey, planId) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) return false;

    data[dateKey] = data[dateKey].filter((p) => p.id !== planId);
    if (data[dateKey].length === 0) {
      delete data[dateKey];
    }
    savePlannerData(data);
    return true;
  } catch (error) {
    console.error("Error removing plan:", error);
    return false;
  }
};

export const getPlansForDate = (dateKey) => {
  try {
    const data = loadPlannerData();
    return data[dateKey] || [];
  } catch (error) {
    console.error("Error getting plans:", error);
    return [];
  }
};

export const updatePlan = (dateKey, planId, updates) => {
  try {
    const data = loadPlannerData();
    if (!data[dateKey]) return false;

    const planIndex = data[dateKey].findIndex((p) => p.id === planId);
    if (planIndex === -1) return false;

    data[dateKey][planIndex] = {
      ...data[dateKey][planIndex],
      ...updates,
    };
    savePlannerData(data);
    return true;
  } catch (error) {
    console.error("Error updating plan:", error);
    return false;
  }
};

export const getAllDatesWithPlans = () => {
  try {
    const data = loadPlannerData();
    return Object.keys(data);
  } catch (error) {
    console.error("Error getting dates:", error);
    return [];
  }
};
