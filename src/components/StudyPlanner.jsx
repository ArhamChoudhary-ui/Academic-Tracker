import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  loadPlannerData,
  getPlansForDate,
} from "../utils/subjectPlannerStorage";
import PlannerDayModal from "./PlannerDayModal";

const StudyPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasksMap, setTasksMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTasksForMonth();
  }, [currentDate]);

  const loadTasksForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const tasksForMonth = {};

    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) break;

      const dateKey = date.toISOString().split("T")[0];
      tasksForMonth[dateKey] = getPlannerTasksForDate(dateKey);
    }

    setTasksMap(tasksForMonth);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleSelectDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    loadTasksForMonth();
  };

  const getMonthName = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getDaysInMonth = () => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();
  };

  const hasTasksForDate = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    return tasksMap[dateKey]?.length > 0;
  };

  const getTasksCount = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    return tasksMap[dateKey]?.length || 0;
  };

  const getCompletedCount = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dateKey = date.toISOString().split("T")[0];
    const tasks = tasksMap[dateKey] || [];
    return tasks.filter((t) => t.completed).length;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const daysArray = [];
  const firstDay = getFirstDayOfMonth();
  const daysInMonth = getDaysInMonth();

  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(day);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Study Planner
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Plan your study sessions day by day
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight
                size={24}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getMonthName()}
          </h3>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-max">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="w-24 text-center font-semibold text-sm text-gray-700 dark:text-gray-300 py-2"
              >
                {day}
              </div>
            ))}

            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="w-24 h-32"></div>;
              }

              const tasksCount = getTasksCount(day);
              const completedCount = getCompletedCount(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDate(day)}
                  className={`
                    w-24 h-32 rounded-lg p-2 transition-all flex flex-col
                    ${
                      today ?
                        "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                    }
                  `}
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {day}
                  </span>

                  {tasksCount > 0 && (
                    <div className="mt-auto">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {completedCount}/{tasksCount}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${tasksCount > 0 ? (completedCount / tasksCount) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Legend
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 rounded border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 rounded border-2 border-gray-200 dark:border-gray-700"></div>
              <span>Has tasks</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              <span>Progress bar</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedDate && (
        <PlannerDayModal dateKey={selectedDate} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default StudyPlanner;
