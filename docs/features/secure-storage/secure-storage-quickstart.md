# 🔐 Secure Storage - Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Encryption Library

```bash
npm install tweetnacl
```

### Step 2: Copy Files to Your Project

Copy these new files to your project:

```
src/utils/
  ├── crypto.js                       ✨ NEW
  ├── authManager.js                  ✨ NEW
  ├── secureStorage.js                ✨ NEW
  ├── encryptedStorage.js             ✨ NEW
  └── encryptedSyllabusPdfStorage.js  ✨ NEW

src/components/
  └── UnlockScreen.jsx                ✨ NEW
```

### Step 3: Update App.jsx

Replace your current `src/App.jsx` with the code in `APP_INTEGRATION_EXAMPLE.jsx`.

**OR** manually integrate these changes:

```jsx
// Add imports
import UnlockScreen from "./components/UnlockScreen";
import { initializeAuth, isAuthenticated, logout, getSessionTimeRemaining } from "./utils/authManager";
import { saveToEncryptedStorage, loadFromEncryptedStorage } from "./utils/encryptedStorage";

// Add state
const [authenticated, setAuthenticated] = useState(false);

// Replace data loading
useEffect(() => {
  if (authenticated) {
    const data = await loadFromEncryptedStorage();
    setSubjectsData(data);
  }
}, [authenticated]);

// Replace data saving
useEffect(() => {
  if (authenticated && subjectsData) {
    await saveToEncryptedStorage(subjectsData);
  }
}, [subjectsData, authenticated]);

// Show unlock screen if not authenticated
if (!authenticated) {
  return <UnlockScreen onAuthenticated={() => setAuthenticated(true)} />;
}

// Rest of app renders here...
```

### Step 4: Update PDF Storage (Optional)

If using PDFs, replace imports:

```jsx
// OLD
import { saveSyllabusPdf, loadSyllabusPdfs } from "./utils/syllabusPdfStorage";

// NEW
import {
  saveSyllabusPdf,
  loadSyllabusPdfs,
} from "./utils/encryptedSyllabusPdfStorage";
```

### Step 5: Test

```bash
npm run dev
```

1. Create password on first launch
2. Enter password to unlock app
3. Save some data
4. Refresh page → must re-enter password
5. Open DevTools → Storage → IndexedDB → see encrypted data

---

## Security Checklist

✅ **Before deploying**, verify:

- [ ] All sensitive data uses `encryptedStorage.js`
- [ ] No hardcoded passwords in code
- [ ] sessionStorage is cleared on logout
- [ ] PBKDF2 using 100,000 iterations
- [ ] Nonce generated fresh for each encryption
- [ ] Error messages don't leak sensitive info
- [ ] Auto-lock on inactivity enabled
- [ ] Password requirements enforced (6+ chars)

---

## Common Integration Points

### Save Marks

```javascript
// Instead of: localStorage.setItem('marks', JSON.stringify(data));
// Use:
await saveToEncryptedStorage(data);
```

### Load Marks

```javascript
// Instead of: const data = JSON.parse(localStorage.getItem('marks'));
// Use:
const data = await loadFromEncryptedStorage();
```

### Save PDF

```javascript
// Instead of: saveSyllabusPdf(subject, file);
// Use: (it's already updated in encryptedSyllabusPdfStorage.js)
await saveSyllabusPdf(subject, file);
```

### Check Auth Status

```javascript
if (!isAuthenticated()) {
  throw new Error("User not authenticated");
}
```

### Logout

```javascript
logout(); // Clears session and data from memory
```

---

## Data Flow Summary

```
User opens app
  ↓
Is user authenticated? (check sessionStorage)
  ├─ NO → Show UnlockScreen
  │        User enters password
  │        ↓
  │        Verify password hash
  │        Derive encryption key from password + salt
  │        Create session with key + token
  │        Load encrypted data from IndexedDB
  │        Decrypt and display
  │
  └─ YES → Load data directly
           User can read/edit
           ↓
           Changes saved encrypted to IndexedDB
           ↓
           Auto-save every 30 seconds
           ↓
           Session expires after 30 mins inactivity
           → Auto-logout
```

---

## File Purposes

| File                             | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| `crypto.js`                      | PBKDF2 key derivation, hashing, base64     |
| `authManager.js`                 | Password setup, authentication, sessions   |
| `secureStorage.js`               | IndexedDB encryption/decryption operations |
| `encryptedStorage.js`            | App-level data save/load with encryption   |
| `encryptedSyllabusPdfStorage.js` | File storage with encryption               |
| `UnlockScreen.jsx`               | Authentication UI component                |

---

## Configuration

All in `src/utils/authManager.js`:

```javascript
// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Change if needed:
// const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
```

---

## Testing Scenarios

### Scenario 1: First Time User

1. Open app → UnlockScreen
2. Click "Create Password"
3. Enter password + confirm
4. Auto-login → Shows app
5. ✅ Password saved (hashed), encryption key in session

### Scenario 2: Returning User

1. Open app → UnlockScreen
2. App checks for existing password
3. Enter password
4. Authenticates → Load encrypted data
5. ✅ Data decrypted and displayed

### Scenario 3: Wrong Password

1. Enter incorrect password
2. Verify fails → "Invalid password" message
3. ✅ No data leaked, can retry

### Scenario 4: Session Timeout

1. Login successfully
2. Wait 30 minutes idle
3. App auto-logs out
4. Page redirects to UnlockScreen
5. ✅ Session cleared, data inaccessible

### Scenario 5: Browser Restart

1. Login and save marks
2. Close entire browser
3. Reopen app
4. sessionStorage is empty
5. Show UnlockScreen
6. Enter password → data loads
7. ✅ Data persists, password required

---

## Troubleshooting

### Error: "tweetnacl is not defined"

- Install: `npm install tweetnacl`
- Restart dev server: `npm run dev`

### Error: "User not authenticated"

- Check: Is user logged in?
- Verify: `isAuthenticated()` returns true
- Try: Logout and login again

### Error: "Decryption failed"

- User entered wrong password
- Try again with correct password

### PDFs not saving

- Check: User is authenticated (`isAuthenticated()`)
- Check: IndexedDB not corrupted
- Clear browser storage and re-login

### Slow performance

- PBKDF2 derivation takes ~1 second (normal)
- Encryption slower for large files
- Consider lazy-loading for big datasets

---

## Next Steps

1. ✅ Install `tweetnacl`
2. ✅ Copy new utility files
3. ✅ Copy `UnlockScreen.jsx`
4. ✅ Update `App.jsx` with auth flow
5. ✅ Test authentication
6. ✅ Test data persistence
7. ✅ Test encryption (open DevTools)
8. ✅ Deploy!

---

## Security Reminder

🔒 **Your data is now:**

- Encrypted before storage (AES-256)
- Protected by password (PBKDF2, 100K iterations)
- Not accessible without authentication
- Invisible in DevTools
- Cleared on logout
- Auto-locked on inactivity

🚀 **Ready for production personal use!**

---

For detailed architecture, see: [SECURE_STORAGE_GUIDE.md](SECURE_STORAGE_GUIDE.md)
