/**
 * SECURE STORAGE CODE EXAMPLES
 * Real-world usage patterns for encrypted storage
 */

// ============================================================================
// EXAMPLE 1: ENCRYPT & SAVE USER MARKS
// ============================================================================

import { saveToEncryptedStorage } from "./utils/encryptedStorage";
import { isAuthenticated } from "./utils/authManager";

async function handleSaveMarks(marksData) {
  // Check authentication first
  if (!isAuthenticated()) {
    throw new Error("User not authenticated. Please login first.");
  }

  try {
    // Save encrypted to IndexedDB
    await saveToEncryptedStorage(marksData);
    console.log("✓ Marks saved securely");
    return true;
  } catch (error) {
    if (error.message.includes("not authenticated")) {
      // Session expired
      console.error("Session expired. Please login again.");
      return false;
    } else {
      console.error("Failed to save marks:", error.message);
      throw error;
    }
  }
}

// Usage in component:
// const handleSubjectUpdate = async (subject, data) => {
//   try {
//     await handleSaveMarks(data);
//   } catch (error) {
//     showErrorMessage(error.message);
//   }
// };

// ============================================================================
// EXAMPLE 2: DECRYPT & LOAD USER MARKS
// ============================================================================

import { loadFromEncryptedStorage } from "./utils/encryptedStorage";

async function handleLoadMarks() {
  if (!isAuthenticated()) {
    throw new Error("Not authenticated");
  }

  try {
    const marks = await loadFromEncryptedStorage();
    return marks || null;
  } catch (error) {
    if (error.message.includes("Decryption failed")) {
      throw new Error("Invalid password or corrupted data");
    }
    throw error;
  }
}

// Usage in useEffect:
// useEffect(() => {
//   if (authenticated) {
//     handleLoadMarks().then(data => setMarks(data));
//   }
// }, [authenticated]);

// ============================================================================
// EXAMPLE 3: ENCRYPT & SAVE PDF
// ============================================================================

import { saveSyllabusPdf } from "./utils/encryptedSyllabusPdfStorage";

async function handlePdfUpload(subject, pdfFile) {
  if (!isAuthenticated()) {
    throw new Error("User not authenticated");
  }

  if (!pdfFile.type.includes("pdf")) {
    throw new Error("Only PDF files allowed");
  }

  if (pdfFile.size > 50 * 1024 * 1024) {
    // 50MB limit
    throw new Error("File too large (max 50MB)");
  }

  try {
    setIsUploading(true);
    await saveSyllabusPdf(subject, pdfFile);
    console.log(`✓ PDF saved for ${subject}`);
    return true;
  } catch (error) {
    console.error("Failed to save PDF:", error);
    throw error;
  } finally {
    setIsUploading(false);
  }
}

// Usage in component:
// const handleDrop = async (e) => {
//   const file = e.dataTransfer.files[0];
//   try {
//     await handlePdfUpload(selectedSubject, file);
//     showSuccess('PDF uploaded securely');
//   } catch (error) {
//     showError(error.message);
//   }
// };

// ============================================================================
// EXAMPLE 4: DECRYPT & LOAD PDF
// ============================================================================

import { getSyllabusPdf } from "./utils/encryptedSyllabusPdfStorage";

async function handleOpenPdf(subject) {
  if (!isAuthenticated()) {
    throw new Error("Not authenticated");
  }

  try {
    const pdfData = await getSyllabusPdf(subject);
    if (!pdfData) {
      throw new Error("No PDF found for this subject");
    }

    // pdfData.fileData is base64 encoded
    // Create blob and open in new tab
    const binaryString = atob(pdfData.fileData.split(",")[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    return true;
  } catch (error) {
    console.error("Failed to load PDF:", error);
    throw error;
  }
}

// Usage:
// <button onClick={() => handleOpenPdf(subject)}>View PDF</button>

// ============================================================================
// EXAMPLE 5: CHANGE PASSWORD
// ============================================================================

import { changePassword } from "./utils/authManager";

async function handleChangePassword(oldPassword, newPassword) {
  try {
    // Validate inputs
    if (!oldPassword) throw new Error("Current password required");
    if (!newPassword) throw new Error("New password required");
    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }
    if (oldPassword === newPassword) {
      throw new Error("New password must be different from old password");
    }

    // Change password (re-derives key with new salt)
    await changePassword(oldPassword, newPassword);
    console.log("✓ Password changed successfully");
    return true;
  } catch (error) {
    if (error.message.includes("incorrect")) {
      throw new Error("Current password is incorrect");
    }
    throw error;
  }
}

// Usage in form:
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     await handleChangePassword(oldPwd, newPwd);
//     showSuccess('Password updated');
//     setOldPwd('');
//     setNewPwd('');
//   } catch (error) {
//     showError(error.message);
//   }
// };

// ============================================================================
// EXAMPLE 6: HANDLE LOGOUT
// ============================================================================

import { logout } from "./utils/authManager";

function handleUserLogout() {
  // Perform any cleanup
  saveUnencryptedUserPreferences(); // Theme, etc.

  // Logout (clears all sensitive data)
  logout();

  // Reset app state
  setAuthenticated(false);
  setSubjectsData(null);
  setCurrentUser(null);

  console.log("✓ Logged out securely");
}

// Usage:
// <button onClick={handleUserLogout}>Logout</button>

// ============================================================================
// EXAMPLE 7: AUTO-SAVE WITH ERROR HANDLING
// ============================================================================

import { saveToEncryptedStorage } from "./utils/encryptedStorage";
import { isAuthenticated } from "./utils/authManager";

function useAutoSave(data, delayMs = 5000) {
  const [saveStatus, setSaveStatus] = useState("idle"); // idle|saving|success|error
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated() || !data) return;

    // Clear existing timer
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set new timer
    timeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await saveToEncryptedStorage(data);
        setSaveStatus("success");

        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("error");
      }
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, delayMs]);

  return saveStatus;
}

// Usage in component:
// const saveStatus = useAutoSave(subjectsData);
// return (
//   <>
//     {saveStatus === 'saving' && <p>Saving...</p>}
//     {saveStatus === 'success' && <p>✓ Saved</p>}
//     {saveStatus === 'error' && <p>✗ Save failed</p>}
//   </>
// );

// ============================================================================
// EXAMPLE 8: SESSION MONITORING
// ============================================================================

import {
  getSessionTimeRemaining,
  logout,
  isAuthenticated,
} from "./utils/authManager";

function useSessionMonitor() {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const interval = setInterval(() => {
      const remaining = getSessionTimeRemaining();
      setTimeRemaining(remaining);

      // Warn when less than 5 minutes
      if (remaining > 0 && remaining < 5 * 60) {
        setIsExpiring(true);
      } else {
        setIsExpiring(false);
      }

      // Auto-logout when expired
      if (remaining === 0) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { timeRemaining, isExpiring };
}

// Usage:
// const { timeRemaining, isExpiring } = useSessionMonitor();
// return (
//   <>
//     {isExpiring && (
//       <div className="warning">
//         Session expires in {Math.floor(timeRemaining / 60)} minutes
//       </div>
//     )}
//   </>
// );

// ============================================================================
// EXAMPLE 9: CLEAR ALL DATA (WITH CONFIRMATION)
// ============================================================================

import { clearAllEncryptedData } from "./utils/encryptedStorage";

async function handleDeleteAllData() {
  // Show confirmation
  const confirmed = await new Promise((resolve) => {
    const result = window.confirm(
      "⚠️ WARNING: This will permanently delete ALL your encrypted data.\n\n" +
        "This action CANNOT be undone. Are you sure?",
    );
    resolve(result);
  });

  if (!confirmed) return false;

  // Second confirmation for critical action
  const doubleConfirmed = await new Promise((resolve) => {
    const result = window.confirm(
      "Last chance! Click OK to permanently delete all data.",
    );
    resolve(result);
  });

  if (!doubleConfirmed) return false;

  try {
    await clearAllEncryptedData();
    console.log("✓ All data deleted");
    // Reset app
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Failed to delete data:", error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 10: EXPORT TO CSV (WITH ENCRYPTION NOTICE)
// ============================================================================

import { exportToCSV } from "./utils/encryptedStorage";

async function handleExportData(data) {
  if (!isAuthenticated()) {
    throw new Error("Not authenticated");
  }

  try {
    // Show warning
    const confirmed = window.confirm(
      "📄 You are about to export your data as plaintext CSV.\n\n" +
        "This file will NOT be encrypted. Store it securely!\n\n" +
        "Continue?",
    );

    if (!confirmed) return false;

    exportToCSV(data);
    console.log("✓ Data exported to CSV");
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 11: PROTECTED COMPONENT (REQUIRES AUTH)
// ============================================================================

import { isAuthenticated } from "./utils/authManager";

function ProtectedComponent({ children }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check auth on mount and when it might change
    setHasAccess(isAuthenticated());

    // Optional: setup listener for auth changes
    const checkAuth = setInterval(() => {
      setHasAccess(isAuthenticated());
    }, 1000);

    return () => clearInterval(checkAuth);
  }, []);

  if (!hasAccess) {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        🔒 You must be logged in to access this content.
      </div>
    );
  }

  return children;
}

// Usage:
// <ProtectedComponent>
//   <SensitiveData />
// </ProtectedComponent>

// ============================================================================
// EXAMPLE 12: ERROR BOUNDARY FOR CRYPTO ERRORS
// ============================================================================

class CryptoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Crypto error:", error, errorInfo);

    // Log to error tracking service
    // logErrorToService(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 rounded">
          <h3>Encryption Error</h3>
          <p>Failed to encrypt/decrypt data. Please try again.</p>
          <button onClick={() => window.location.reload()}>Reload App</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage:
// <CryptoErrorBoundary>
//   <App />
// </CryptoErrorBoundary>

// ============================================================================
// SUMMARY
// ============================================================================

/*
KEY PATTERNS:

1. Always check isAuthenticated() before accessing encrypted data
2. Use try-catch for all async encryption operations
3. Handle "Decryption failed" = wrong password
4. Handle "not authenticated" = session expired
5. Auto-save data on changes
6. Monitor session timeout
7. Show confirmation for destructive operations
8. Export warns about plaintext
9. Use error boundaries for crypto errors
10. Never hardcode keys or passwords

PERFORMANCE TIPS:

- PBKDF2 derivation takes ~1 second (do on login, not on every operation)
- Encryption/decryption is fast (<100ms for typical data)
- Use debounce for auto-save (avoid constant encryption)
- Consider batching multiple saves
- IndexedDB async, so avoid blocking main thread

SECURITY TIPS:

- Always logout on app close
- Never console.log sensitive data
- Use HTTPS in production
- Validate password strength
- Implement account recovery (backup codes)
- Log auth attempts
- Monitor for unusual access patterns
*/
