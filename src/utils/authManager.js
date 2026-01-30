/**
 * Authentication Manager
 * Handles user authentication, session management, and encryption keys
 */

import {
  deriveKeyFromPassword,
  generateSalt,
  generateSessionToken,
  hashPassword,
  verifyPassword,
  generateNonce,
  encodeBase64,
} from "./crypto.js";

const AUTH_STORAGE_KEY = "app_auth_metadata";
const SESSION_STORAGE_KEY = "app_session";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let currentSession = null;
let sessionTimer = null;

/**
 * Initialize authentication system
 * Creates auth metadata if not exists
 */
export const initializeAuth = async () => {
  try {
    const metadata = getAuthMetadata();
    if (!metadata) {
      // First time setup - user needs to create password
      return { isFirstTime: true };
    }
    return { isFirstTime: false, passwordExists: true };
  } catch (error) {
    console.error("Error initializing auth:", error);
    throw error;
  }
};

/**
 * Set up authentication with password
 * Stores hashed password and salt
 */
export const setupPassword = async (password) => {
  try {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password);

    const metadata = {
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error("Error setting up password:", error);
    throw error;
  }
};

/**
 * Authenticate user with password
 * Returns session with encryption key
 */
export const authenticate = async (password) => {
  try {
    const metadata = getAuthMetadata();
    if (!metadata) {
      throw new Error("No password set. Please create a password first.");
    }

    // Verify password
    const isValid = await verifyPassword(password, metadata.passwordHash);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // Derive encryption key from password
    const encryptionKey = await deriveKeyFromPassword(password, metadata.salt);

    // Create session
    const sessionToken = generateSessionToken();
    const sessionNonce = generateNonce();

    currentSession = {
      token: sessionToken,
      encryptionKey,
      nonce: sessionNonce,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TIMEOUT,
      authenticated: true,
    };

    // Store session token (not the key!)
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        token: sessionToken,
        expiresAt: currentSession.expiresAt,
      }),
    );

    // Start auto-lock timer
    resetSessionTimer();

    return {
      success: true,
      token: sessionToken,
    };
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

/**
 * Validate current session
 */
export const validateSession = () => {
  if (!currentSession) {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      return false;
    }

    try {
      const session = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Check if session expired
  if (Date.now() > currentSession.expiresAt) {
    logout();
    return false;
  }

  return true;
};

/**
 * Get current session (after authentication)
 */
export const getSession = () => {
  if (!validateSession()) {
    return null;
  }
  return currentSession;
};

/**
 * Get encryption key from session
 */
export const getEncryptionKey = () => {
  const session = getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return session.encryptionKey;
};

/**
 * Get current nonce
 */
export const getNonce = () => {
  const session = getSession();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return session.nonce;
};

/**
 * Reset session timeout
 */
export const resetSessionTimer = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }

  sessionTimer = setTimeout(() => {
    console.warn("Session expired due to inactivity");
    logout();
  }, SESSION_TIMEOUT);
};

/**
 * Logout user
 */
export const logout = () => {
  currentSession = null;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
};

/**
 * Get stored auth metadata
 */
export const getAuthMetadata = () => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    // Verify old password
    const metadata = getAuthMetadata();
    const isValid = await verifyPassword(oldPassword, metadata.passwordHash);

    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    // Update password
    const newSalt = generateSalt();
    const newPasswordHash = await hashPassword(newPassword);

    const updatedMetadata = {
      ...metadata,
      passwordHash: newPasswordHash,
      salt: newSalt,
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedMetadata));
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Clear all auth data (logout permanently)
 * Warning: This cannot be undone without knowing the password
 */
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  currentSession = null;
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return validateSession() && currentSession !== null;
};

/**
 * Get time until session expires (in seconds)
 */
export const getSessionTimeRemaining = () => {
  const session = getSession();
  if (!session) return 0;
  return Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
};
