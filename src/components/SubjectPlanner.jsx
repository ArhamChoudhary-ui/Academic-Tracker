import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { loadPlannerData } from "../utils/subjectPlannerStorage";
import SubjectPlannerModal from "./SubjectPlannerModal";

const StudyPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plansMap, setPlansMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadPlansForMonth = useCallback(() => {
    const allPlans = loadPlannerData();
    setPlansMap(allPlans);
  }, []);

  useEffect(() => {
    loadPlansForMonth();
  }, [currentDate, loadPlansForMonth]);

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleSelectDate = useCallback(
    (day) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      setSelectedDate(date.toISOString().split("T")[0]);
      setShowModal(true);
    },
    [currentDate],
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedDate(null);
    loadPlansForMonth();
  }, [loadPlansForMonth]);

  const getMonthName = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const getDaysInMonth = useMemo(() => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
  }, [currentDate]);

  const getFirstDayOfMonth = useMemo(() => {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();
  }, [currentDate]);

  const getPlansForDay = useCallback(
    (day) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const dateKey = date.toISOString().split("T")[0];
      return plansMap[dateKey] || [];
    },
    [currentDate, plansMap],
  );

  const getDateColor = useCallback(
    (day) => {
      const plans = getPlansForDay(day);
      if (plans.length === 0) return null;
      return plans[0].color || "blue";
    },
    [getPlansForDay],
  );

  const isToday = useCallback(
    (day) => {
      const today = new Date();
      return (
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    },
    [currentDate],
  );

  const daysArray = useMemo(() => {
    const arr = [];
    const firstDay = getFirstDayOfMonth;
    const daysInMonth = getDaysInMonth;

    for (let i = 0; i < firstDay; i++) {
      arr.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      arr.push(day);
    }
    return arr;
  }, [getFirstDayOfMonth, getDaysInMonth]);

  const colorClasses = useMemo(
    () => ({
      blue: "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600",
      green:
        "bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-600",
      purple:
        "bg-purple-100 dark:bg-purple-900/40 border-purple-400 dark:border-purple-600",
      red: "bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-600",
      yellow:
        "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-400 dark:border-yellow-600",
      orange:
        "bg-orange-100 dark:bg-orange-900/40 border-orange-400 dark:border-orange-600",
    }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Subject Planner
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Plan your study subjects by date
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
            {getMonthName}
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
                return <div key={`empty-${idx}`} className="w-24 h-24"></div>;
              }

              const plans = getPlansForDay(day);
              const color = getDateColor(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDate(day)}
                  className={`
                    w-24 h-24 rounded-lg p-2 transition-all flex flex-col items-center justify-center
                    ${today ? "ring-2 ring-blue-500" : ""}
                    ${
                      plans.length > 0 && color ?
                        colorClasses[color] + " border-2"
                      : "border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                    }
                  `}
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {day}
                  </span>

                  {plans.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        {plans.length} plan{plans.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Color Legend
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(colorClasses).map(([color, classes]) => (
              <div key={color} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${classes}`}></div>
                <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && selectedDate && (
        <SubjectPlannerModal
          dateKey={selectedDate}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default React.memo(StudyPlanner);
