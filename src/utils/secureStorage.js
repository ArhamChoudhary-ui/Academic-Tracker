/**
 * Secure Storage Module
 * Provides encrypted localStorage/IndexedDB operations
 * Uses TweetNaCl.js for encryption
 */

import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "./crypto.js";

const DB_NAME = "MarksApp_SecureDB";
const DB_VERSION = 1;
const STORE_NAME = "encryptedData";
const METADATA_KEY = "app_metadata";

/**
 * Initialize IndexedDB for encrypted storage
 */
export const initializeSecureDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

/**
 * Encrypt and save data to IndexedDB
 * @param {string} key - Storage key
 * @param {object} data - Data to encrypt
 * @param {Uint8Array} encryptionKey - Derived encryption key
 * @param {string} nonce - Nonce for encryption
 */
export const saveEncryptedData = async (key, data, encryptionKey, nonce) => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Convert nonce back to Uint8Array if string
    const nonceArray = typeof nonce === "string" ? decodeBase64(nonce) : nonce;

    // Encrypt data
    const plaintext = JSON.stringify(data);
    const message = new TextEncoder().encode(plaintext);
    const ciphertext = nacl.secretbox(message, nonceArray, encryptionKey);

    // Store encrypted blob
    const encryptedPayload = {
      ciphertext: encodeBase64(ciphertext),
      nonce: encodeBase64(nonceArray),
      timestamp: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const putRequest = store.put(encryptedPayload, key);
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error("Error saving encrypted data:", error);
    throw error;
  }
};

/**
 * Load and decrypt data from IndexedDB
 * @param {string} key - Storage key
 * @param {Uint8Array} encryptionKey - Derived encryption key
 */
export const loadEncryptedData = async (key, encryptionKey) => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(key);
      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (!result) {
          resolve(null);
          return;
        }

        try {
          // Decrypt data
          const ciphertext = decodeBase64(result.ciphertext);
          const nonce = decodeBase64(result.nonce);
          const plaintext = nacl.secretbox.open(
            ciphertext,
            nonce,
            encryptionKey,
          );

          if (!plaintext) {
            throw new Error("Decryption failed - invalid password");
          }

          const decrypted = JSON.parse(new TextDecoder().decode(plaintext));
          resolve(decrypted);
        } catch (error) {
          reject(error);
        }
      };
    });
  } catch (error) {
    console.error("Error loading encrypted data:", error);
    throw error;
  }
};

/**
 * Delete encrypted data from IndexedDB
 */
export const deleteEncryptedData = async (key) => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const deleteRequest = store.delete(key);
      deleteRequest.onerror = () => reject(deleteRequest.error);
      deleteRequest.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error("Error deleting encrypted data:", error);
    throw error;
  }
};

/**
 * Clear all encrypted data from IndexedDB
 */
export const clearAllEncryptedData = async () => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(clearRequest.error);
      clearRequest.onsuccess = () => resolve(true);
    });
  } catch (error) {
    console.error("Error clearing encrypted data:", error);
    throw error;
  }
};

/**
 * List all keys in encrypted storage
 */
export const listEncryptedKeys = async () => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getAllKeys = store.getAllKeys();
      getAllKeys.onerror = () => reject(getAllKeys.error);
      getAllKeys.onsuccess = () => resolve(getAllKeys.result || []);
    });
  } catch (error) {
    console.error("Error listing keys:", error);
    throw error;
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = async () => {
  try {
    const db = await initializeSecureDB();
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const countRequest = store.count();
      countRequest.onerror = () => reject(countRequest.error);
      countRequest.onsuccess = () => {
        resolve({
          itemCount: countRequest.result,
          estimatedSize: "N/A (encrypted)",
          database: DB_NAME,
        });
      };
    });
  } catch (error) {
    console.error("Error getting storage stats:", error);
    throw error;
  }
};
