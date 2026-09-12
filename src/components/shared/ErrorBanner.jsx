import React from "react";
import { AlertCircle } from "lucide-react";

/** Inline error notice shown below input sections. */
export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
      <AlertCircle size={20} className="text-red-300 flex-shrink-0 mt-0.5" />
      <p className="text-red-200 text-sm">{message}</p>
    </div>
  );
}
