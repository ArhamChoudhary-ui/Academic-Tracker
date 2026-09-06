import React from "react";
import { Book, BookOpen, Calendar, LineChart } from "lucide-react";

export default function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "subjects", label: "Subjects", icon: Book },
    { id: "charts", label: "Charts", icon: LineChart },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-t border-white/10 z-40">
      <div className="flex justify-around items-center h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                isActive ? "text-white scale-110" : "text-white/60"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
