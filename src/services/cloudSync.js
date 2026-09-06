export const authenticateUser = async (email, password, provider = "email") => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { email, provider, authenticated: true };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("cloud_user");
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("cloud_user");
  localStorage.removeItem("cloud_sync_enabled");
};

export const isSyncEnabled = () => {
  return localStorage.getItem("cloud_sync_enabled") === "true";
};

export const getLastSyncTime = () => {
  return localStorage.getItem("cloud_last_sync");
};

export const performFullSync = async (localData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  localStorage.setItem("cloud_last_sync", new Date().toISOString());
  return { success: true };
};

export const formatLastSync = () => {
  const time = getLastSyncTime();
  if (!time) return "Never";
  const mins = Math.floor((Date.now() - new Date(time).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
