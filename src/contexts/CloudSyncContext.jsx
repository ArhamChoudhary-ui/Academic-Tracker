import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authenticateUser,
  logoutUser,
  getCurrentUser,
  isSyncEnabled,
  getLastSyncTime,
  performFullSync,
  formatLastSync,
} from "../services/cloudSync";

const CloudSyncContext = createContext();

export const CloudSyncProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setLastSyncTime(getLastSyncTime());
    }
  }, []);

  const login = async (email, password, provider = "email") => {
    try {
      setSyncError(null);
      setIsSyncing(true);
      const authenticatedUser = await authenticateUser(
        email,
        password,
        provider,
      );
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem("cloud_user", JSON.stringify(authenticatedUser));
      localStorage.setItem("cloud_sync_enabled", "true");
      return { success: true, user: authenticatedUser };
    } catch (error) {
      setSyncError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setSyncError(null);
  };

  const manualSync = async (localData) => {
    try {
      setSyncError(null);
      setIsSyncing(true);
      await performFullSync(localData);
      setLastSyncTime(new Date().toISOString());
      return { success: true };
    } catch (error) {
      setSyncError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsSyncing(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    isSyncing,
    syncError,
    lastSyncTime,
    lastSyncFormatted: formatLastSync(),
    manualSync,
  };

  return (
    <CloudSyncContext.Provider value={value}>
      {children}
    </CloudSyncContext.Provider>
  );
};

export const useCloudSync = () => {
  const context = useContext(CloudSyncContext);
  if (!context) {
    throw new Error("useCloudSync must be used within CloudSyncProvider");
  }
  return context;
};
