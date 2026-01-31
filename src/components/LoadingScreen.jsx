import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const durationMs = 2400;
    const stepMs = 30;
    const increment = 100 / (durationMs / stepMs);

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 100));
    }, stepMs);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    const timer = setTimeout(() => {
      onComplete?.();
    }, 250);
    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  const statusText = useMemo(() => {
    if (progress < 25) return "initializing your workspace…";
    if (progress < 50) return "loading subjects…";
    if (progress < 75) return "processing marks…";
    if (progress < 95) return "finalizing dashboard…";
    return "finalizing dashboard…";
  }, [progress]);

  const fillHeight = (progress / 100) * 24;
  const fillY = 24 - fillHeight;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="bookFillClip">
                <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" />
              </clipPath>
            </defs>
            <rect
              x="0"
              y={fillY}
              width="24"
              height={fillHeight}
              fill="currentColor"
              opacity="0.25"
              clipPath="url(#bookFillClip)"
            />
            <path
              d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={statusText}
            className="text-base font-medium text-white/90 tracking-wide"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {statusText}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
