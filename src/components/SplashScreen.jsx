import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    // Prevent body scroll during splash
    document.body.style.overflow = "hidden";

    // Auto-dismiss after short brand display
    const timer = setTimeout(() => {
      document.body.style.overflow = "unset";
      onComplete?.();
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-center justify-center">
        {/* Title */}
        <motion.h1
          className="text-6xl md:text-7xl font-black text-white tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          Academic Tracker
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-xl md:text-2xl text-white/80 font-light tracking-wide text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          Your Study Companion
        </motion.p>

        {/* Minimal bottom accent line */}
        <motion.div
          className="mt-8 h-1 w-20 bg-white rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: "easeOut",
          }}
        />
      </div>
    </motion.div>
  );
}
