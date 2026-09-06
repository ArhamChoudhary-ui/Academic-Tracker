export const createPlaySession = () => {
  const session = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };

  const sessions = JSON.parse(
    localStorage.getItem("game_play_sessions") || "[]",
  );
  sessions.push(session);
  localStorage.setItem("game_play_sessions", JSON.stringify(sessions));
  return session;
};

export const canPlay = () => {
  const sessions = JSON.parse(
    localStorage.getItem("game_play_sessions") || "[]",
  );
  const now = new Date().toISOString();
  return sessions.some((s) => s.expiresAt > now);
};

export const getRemainingPlayTime = () => {
  const sessions = JSON.parse(
    localStorage.getItem("game_play_sessions") || "[]",
  );
  const now = Date.now();

  for (const session of sessions) {
    const expiresAt = new Date(session.expiresAt).getTime();
    if (expiresAt > now) {
      return Math.max(0, expiresAt - now);
    }
  }
  return 0;
};

export const formatPlayTime = (ms) => {
  const seconds = Math.ceil(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const lockPlaySession = () => {
  localStorage.setItem("game_play_sessions", "[]");
};
