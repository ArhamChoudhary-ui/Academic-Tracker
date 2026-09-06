import React, { useState, useEffect } from "react";
import { Gamepad2, Lock, Play } from "lucide-react";
import {
  canPlay,
  getRemainingPlayTime,
  formatPlayTime,
  lockPlaySession,
} from "../services/playSessionManager";

export default function GameTab() {
  const [isEligible, setIsEligible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    const checkEligibility = () => {
      const eligible = canPlay();
      setIsEligible(eligible);
      setRemainingTime(getRemainingPlayTime());

      if (!eligible) {
        setGameActive(false);
      }
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isEligible) {
    return (
      <div className="space-y-8 pb-24 md:pb-12">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Gamepad2 size={32} className="text-blue-300" />
            Game Zone
          </h2>
          <p className="text-white/60">
            Unlock game time by completing study sessions
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <Lock size={32} className="text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Game Locked</h3>
              <p className="text-white/60">
                Complete a study session to unlock 5 minutes of game time
              </p>
            </div>
          </div>

          <div className="bg-blue-900/50 rounded-lg p-4 text-sm text-white/70 space-y-2">
            <p>
              💡 <strong>How to unlock:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Go to Study Timer</li>
              <li>Complete a study session</li>
              <li>Return here to play</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-12">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Gamepad2 size={32} className="text-blue-300" />
          Game Zone
        </h2>
        <p className="text-white/60">You have game time available!</p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-green-400/30 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            🎮 Game Session Active!
          </h3>
          <p className="text-white/70 mb-6">
            Time remaining: {formatPlayTime(remainingTime)}
          </p>
          <button
            onClick={() => setGameActive(!gameActive)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg flex items-center gap-2 mx-auto transition-all"
          >
            <Play size={20} />
            {gameActive ? "Playing..." : "Start Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
