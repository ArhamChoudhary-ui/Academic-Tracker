import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Clock, Volume2, VolumeX } from "lucide-react";
import { SUBJECTS } from "../utils/data";
import {
  saveTimerSession,
  loadTimerSessions,
  deleteTimerSession,
  getTimerStatsForSubject,
  calculateDailyStreak,
  formatTime,
  calculateTargetCompletion,
} from "../utils/timerStorage";
import TimerStatsSummary from "./timer/TimerStatsSummary";
import TimerFeedbackModal from "./timer/TimerFeedbackModal";
import TimerHistoryList from "./timer/TimerHistoryList";

// TODO: Add audio notification tone selector in user settings
// FIXME: Handle visibilitychange event so timer accurately tracks time when tab is backgrounded

const StudyTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [targetReached, setTargetReached] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [focusRating, setFocusRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [timerStats, setTimerStats] = useState({});
  const [dailyStreak, setDailyStreak] = useState(0);
  const [pomodoroMode, setPomodoroMode] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const stats = getTimerStatsForSubject(selectedSubject);
      setTimerStats(stats);
    }
  }, [selectedSubject, sessions]);

  useEffect(() => {
    const streak = calculateDailyStreak();
    setDailyStreak(streak);
  }, [sessions]);

  const loadSessions = () => {
    const loaded = loadTimerSessions();
    setSessions(loaded);
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        const targetSeconds = targetHours * 3600 + targetMinutes * 60;

        if (targetSeconds > 0 && next >= targetSeconds && !targetReached) {
          setTargetReached(true);
          playAlertSound();
          setIsRunning(false);
        }

        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, targetHours, targetMinutes, targetReached]);

  const playAlertSound = () => {
    if (!soundEnabled) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio context playback blocked or unsupported
    }
  };

  const handleStart = () => {
    if (!selectedSubject) {
      alert("Please select a subject first");
      return;
    }
    if (pomodoroMode && seconds === 0) {
      setTargetHours(0);
      setTargetMinutes(25);
    }
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleStop = () => {
    setIsRunning(false);
    if (seconds > 0) {
      setShowFeedback(true);
    }
  };

  const handleReset = () => {
    setSeconds(0);
    setTargetReached(false);
    setShowFeedback(false);
    setFocusRating(3);
    setNotes("");
  };

  const handleSaveSession = () => {
    const targetSeconds = targetHours * 3600 + targetMinutes * 60;
    const session = {
      subject: selectedSubject,
      durationSeconds: seconds,
      targetSeconds,
      startTime: new Date(Date.now() - seconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      completedTarget: seconds >= targetSeconds,
      focusRating,
      notes: notes || null,
    };

    saveTimerSession(session);
    loadSessions();
    handleReset();
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm("Delete this session? This action cannot be undone.")) {
      deleteTimerSession(sessionId);
      loadSessions();
    }
  };

  const targetSeconds = targetHours * 3600 + targetMinutes * 60;
  const progressPercent = calculateTargetCompletion(seconds, targetSeconds);
  const subjectSessions = sessions.filter((s) => s.subject === selectedSubject);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-blue-200 dark:border-blue-700">
        <div className="text-center space-y-6">
          <div className="flex gap-4 justify-center mb-6">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                handleReset();
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              disabled={isRunning || showFeedback}
            >
              <option value="">Select Subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={pomodoroMode}
                onChange={(e) => {
                  setPomodoroMode(e.target.checked);
                  if (e.target.checked && !isRunning) {
                    setTargetHours(0);
                    setTargetMinutes(25);
                  }
                }}
                disabled={isRunning || showFeedback}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pomodoro (25/5)
              </span>
            </label>
          </div>

          <div className="text-7xl font-bold font-mono text-blue-600 dark:text-blue-400 tracking-wider">
            {formatTime(seconds)}
          </div>

          {targetSeconds > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Target: {formatTime(targetSeconds)}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPercent >= 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(progressPercent)}% of target
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Hours
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={targetHours}
                onChange={(e) =>
                  setTargetHours(Math.max(0, parseInt(e.target.value) || 0))
                }
                disabled={isRunning || showFeedback}
                className="w-full px-3 py-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={targetMinutes}
                onChange={(e) =>
                  setTargetMinutes(
                    Math.max(0, Math.min(59, parseInt(e.target.value) || 0)),
                  )
                }
                disabled={isRunning || showFeedback}
                className="w-full px-3 py-2 text-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            {!isRunning && seconds === 0 && (
              <button
                type="button"
                onClick={handleStart}
                disabled={!selectedSubject}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
              >
                <Play size={20} />
                Start
              </button>
            )}

            {isRunning && (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Pause size={20} />
                Pause
              </button>
            )}

            {!isRunning && seconds > 0 && !showFeedback && (
              <button
                type="button"
                onClick={handleResume}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Play size={20} />
                Resume
              </button>
            )}

            {seconds > 0 && !showFeedback && (
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Square size={20} />
                Stop
              </button>
            )}

            {showFeedback && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Clock size={20} />
                New Session
              </button>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-lg font-semibold transition-colors ${
                soundEnabled
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
              }`}
              title={soundEnabled ? "Sound ON" : "Sound OFF"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          {targetReached && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-500 rounded-lg">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                🎉 Target Time Reached!
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Great work! You've completed your study session.
              </p>
            </div>
          )}
        </div>
      </div>

      {showFeedback && (
        <TimerFeedbackModal
          focusRating={focusRating}
          onFocusRatingChange={setFocusRating}
          notes={notes}
          onNotesChange={setNotes}
          onSave={handleSaveSession}
          onDiscard={handleReset}
        />
      )}

      {selectedSubject && (
        <TimerStatsSummary
          timerStats={timerStats}
          dailyStreak={dailyStreak}
        />
      )}

      <TimerHistoryList
        sessions={subjectSessions}
        selectedSubject={selectedSubject}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
};

export default StudyTimer;
