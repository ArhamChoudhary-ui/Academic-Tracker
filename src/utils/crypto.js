/**
 * Cryptographic utilities
 * Base64 encoding/decoding and key derivation
 */

/**
 * Encode Uint8Array to Base64
 */
export const encodeBase64 = (bytes) => {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Decode Base64 to Uint8Array
 */
export const decodeBase64 = (str) => {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Derive encryption key from password using PBKDF2
 * @param {string} password - User password
 * @param {string} salt - Salt for key derivation (should be stored)
 * @returns {Promise<Uint8Array>} - 32-byte encryption key
 */
export const deriveKeyFromPassword = async (password, salt) => {
  try {
    // Convert password and salt to buffers
    const enc = new TextEncoder();
    const passwordBuffer = enc.encode(password);
    const saltBuffer = enc.encode(salt);

    // Use PBKDF2 with SHA-256
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: 100000, // OWASP recommended
        hash: "SHA-256",
      },
      await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveKey"],
      ),
      { name: "AES-GCM", length: 256 }, // 32-byte key for NaCl
      true, // extractable
      ["encrypt", "decrypt"],
    );

    // Extract raw key bytes
    const keyBuffer = await window.crypto.subtle.exportKey("raw", key);
    return new Uint8Array(keyBuffer);
  } catch (error) {
    console.error("Error deriving key:", error);
    throw error;
  }
};

/**
 * Generate random salt for key derivation
 */
export const generateSalt = () => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return encodeBase64(salt);
};

/**
 * Generate random nonce for encryption
 */
export const generateNonce = () => {
  const nonce = window.crypto.getRandomValues(new Uint8Array(24));
  return nonce; // Return as Uint8Array, not base64
};

/**
 * Hash password for secure storage (NOT for key derivation)
 * Used to verify password without storing it
 */
export const hashPassword = async (password) => {
  try {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return encodeBase64(new Uint8Array(hashBuffer));
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (password, hash) => {
  try {
    const calculatedHash = await hashPassword(password);
    return calculatedHash === hash;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
};

/**
 * Generate random session token
 */
export const generateSessionToken = () => {
  const token = window.crypto.getRandomValues(new Uint8Array(32));
  return encodeBase64(token);
};

/**
 * Secure clear sensitive data from memory
 * Note: JavaScript doesn't have true memory clearing,
 * but this zeros out string representations
 */
export const clearSensitiveData = (data) => {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = 0;
    }
  } else if (typeof data === "string") {
    return ""; // Create new empty string
  }
};
