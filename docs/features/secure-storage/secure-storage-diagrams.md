# 🔐 Secure Storage - Visual Architecture & Diagrams

## 1. Complete System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                      │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ UnlockScreen    │  │ Main App     │  │ Settings/Logout      │ │
│  │ ├ Create Pwd    │  │ ├ Marks      │  │ ├ Change Password    │ │
│  │ ├ Enter Pwd     │  │ ├ PDFs       │  │ ├ Clear Data         │ │
│  │ └ Confirm Pwd   │  │ └ Session    │  │ └ Logout             │ │
│  └────────┬────────┘  └──────┬───────┘  └──────────┬───────────┘ │
└───────────┼──────────────────┼──────────────────────┼─────────────┘
            │                  │                      │
            └──────────────────┼──────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                 AUTHENTICATION & KEY MANAGEMENT                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   authManager.js                            │  │
│  │  ├ setupPassword(pwd)                                       │  │
│  │  ├ authenticate(pwd)                                        │  │
│  │  ├ changePassword(old, new)                                 │  │
│  │  ├ logout()                                                 │  │
│  │  ├ getSession()                                             │  │
│  │  ├ isAuthenticated()                                        │  │
│  │  └ getSessionTimeRemaining()                                │  │
│  └──────────────────┬───────────────────────────────────────┬──┘  │
│                    │                                         │     │
│                    ↓                                         ↓     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐      │
│  │    crypto.js             │  │ Session State (Memory)   │      │
│  │ ├ PBKDF2 derivation      │  │ ├ encryptionKey         │      │
│  │ ├ SHA-256 hashing        │  │ ├ sessionToken          │      │
│  │ ├ Base64 encoding        │  │ ├ nonce                 │      │
│  │ ├ Random generators      │  │ ├ expiresAt              │      │
│  │ └ Sensitive data clear   │  │ └ authenticated          │      │
│  └──────────────────────────┘  └──────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                      ENCRYPTION & STORAGE LAYER                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              secureStorage.js (Core)                        │  │
│  │  ├ initializeSecureDB()                                     │  │
│  │  ├ saveEncryptedData(key, data, encKey, nonce)             │  │
│  │  ├ loadEncryptedData(key, encKey)                          │  │
│  │  ├ deleteEncryptedData(key)                                │  │
│  │  └ clearAllEncryptedData()                                 │  │
│  └──────────────────┬───────────────────────────────────────┬──┘  │
│                    │                                         │     │
│                    ↓                                         ↓     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐      │
│  │   encryptedStorage.js    │  │ encryptedSyllabus...js   │      │
│  │ ├ saveToEncrypted...     │  │ ├ saveSyllabusPdf()      │      │
│  │ ├ loadFromEncrypted...   │  │ ├ loadSyllabusPdfs()     │      │
│  │ ├ saveWeights()          │  │ ├ removeSyllabusPdf()    │      │
│  │ ├ loadWeights()          │  │ ├ getSyllabusPdf()       │      │
│  │ ├ clearAllEncryptedData()│  │ └ clearAllPdfs()         │      │
│  │ └ exportToCSV()          │  │                          │      │
│  └──────────────────┬───────┘  └──────────┬───────────────┘      │
└─────────────────────┼──────────────────────┼──────────────────────┘
                      │                      │
                      └──────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                    PERSISTENT STORAGE LAYER                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  IndexedDB: "MarksApp_SecureDB"                            │  │
│  │  [ENCRYPTED] Object Store: "encryptedData"                 │  │
│  │  ├ subject_data: { ciphertext, nonce, timestamp }          │  │
│  │  ├ subject_weights: { ciphertext, nonce, timestamp }       │  │
│  │  └ syllabus_pdfs: { ciphertext, nonce, timestamp }         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  localStorage: Non-sensitive data only                      │  │
│  │  ├ app_auth_metadata: { passwordHash, salt, ... }          │  │
│  │  └ user_theme: "light" | "dark"                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  sessionStorage: Auto-cleared on browser close              │  │
│  │  └ app_session: { token, expiresAt }                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Encryption Flow (Detailed)

```
┌─ USER CREATES PASSWORD ─────────────────────────────────────────┐
│                                                                  │
│  User Input: "MySecure123!"                                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 1: Generate Salt                                       │ │
│  │  salt = crypto.getRandomValues(16 bytes)                    │ │
│  │  salt_b64 = encodeBase64(salt)                              │ │
│  │  → Example: "a1b2c3d4e5f6g7h8i9j0"                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Hash Password (for verification)                    │ │
│  │  hash = SHA-256("MySecure123!")                             │ │
│  │  hash_b64 = encodeBase64(hash)                              │ │
│  │  → Example: "f9e8d7c6..."                                   │ │
│  │                                                              │ │
│  │  ✓ Hash stored in localStorage                             │ │
│  │  ✗ Password NOT stored                                     │ │
│  │  ✓ Salt stored in localStorage                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Derive Encryption Key                              │ │
│  │  key = PBKDF2(                                              │ │
│  │    password: "MySecure123!",                                │ │
│  │    salt: "a1b2c3d4e5f6g7h8i9j0",                            │ │
│  │    iterations: 100000,                                      │ │
│  │    hash_fn: SHA-256                                         │ │
│  │  )                                                           │ │
│  │  → 32-byte encryption key (256 bits)                        │ │
│  │  → Takes ~1 second (intentional - slows brute force)        │ │
│  │                                                              │ │
│  │  ✗ Key NOT stored                                          │ │
│  │  ✓ Key kept in memory (session)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 4: Create Session Token                               │ │
│  │  token = crypto.getRandomValues(32 bytes)                   │ │
│  │  token_b64 = encodeBase64(token)                            │ │
│  │  → Example: "x1y2z3..."                                     │ │
│  │                                                              │ │
│  │  ✓ Token stored in sessionStorage (auto-clears)            │ │
│  │  ✓ Token in memory (session object)                        │ │
│  │  ✗ Key NOT in sessionStorage                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  Password setup complete ✓                                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Encryption Process

```
┌─ USER SAVES MARKS ──────────────────────────────────────────────┐
│                                                                  │
│  Plaintext Data: { CAT1: 45, CAT2: 38, ... }                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 1: Get Encryption Key from Session                    │ │
│  │  key = session.encryptionKey                                │ │
│  │  (Already in memory from authentication)                    │ │
│  │                                                              │ │
│  │  Binary format: [0x4f, 0x2a, 0x89, ...]  (32 bytes)        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Generate Random Nonce                              │ │
│  │  nonce = crypto.getRandomValues(24 bytes)                   │ │
│  │  (Random per encryption - CRITICAL)                         │ │
│  │                                                              │ │
│  │  Binary format: [0xf1, 0x3e, 0x77, ...]  (24 bytes)        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Serialize Data to JSON                             │ │
│  │  plaintext = JSON.stringify(data)                           │ │
│  │  → '{"CAT1":45,"CAT2":38,...}'                              │ │
│  │                                                              │ │
│  │  message = UTF-8 encode(plaintext)                          │ │
│  │  → [123, 34, 67, 65, 84, 49, ...] (bytes)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 4: Encrypt with NaCl SecretBox (XSalsa20-Poly1305)    │ │
│  │  ciphertext = nacl.secretbox(                               │ │
│  │    message: [plaintext bytes],                              │ │
│  │    nonce: [nonce bytes],                                    │ │
│  │    key: [encryption key]                                    │ │
│  │  )                                                           │ │
│  │                                                              │ │
│  │  Output format:                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Poly1305 MAC (16 bytes) + Ciphertext + Extra Byte   │  │ │
│  │  │ [0x8f, 0x2a, 0x91, ..., encrypted data, ...]        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  Encryption algorithm: XSalsa20 (stream cipher)             │ │
│  │  Authentication: Poly1305 (HMAC equivalent)                 │ │
│  │  Time: <100ms                                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 5: Encode to Base64                                   │ │
│  │  ciphertext_b64 = encodeBase64(ciphertext)                  │ │
│  │  → "8aL2K9x4f/Op2+8kLx..." (can be stored as text)         │ │
│  │                                                              │ │
│  │  nonce_b64 = encodeBase64(nonce)                            │ │
│  │  → "q9mL2K5p1m8s0v..." (stored with ciphertext)            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 6: Store to IndexedDB                                 │ │
│  │  payload = {                                                │ │
│  │    ciphertext: "8aL2K9x4f/Op2+8kLx...",                     │ │
│  │    nonce: "q9mL2K5p1m8s0v...",                              │ │
│  │    timestamp: "2026-01-30T10:45:23Z"                        │ │
│  │  }                                                           │ │
│  │                                                              │ │
│  │  await saveEncryptedData(                                   │ │
│  │    "subject_data",                                          │ │
│  │    payload,                                                 │ │
│  │    key,                                                     │ │
│  │    nonce                                                    │ │
│  │  )                                                           │ │
│  │                                                              │ │
│  │  ✓ Stored in IndexedDB (encrypted)                         │ │
│  │  ✗ Never in localStorage                                   │ │
│  │  ✗ Never in plaintext                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  Encryption complete ✓                                          │
│  Even if attacker opens DevTools:                               │
│  │ IndexedDB → encryptedData → "8aL2K9x4f/Op2+8kLx..."         │
│  │ (no plaintext visible)                                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Decryption Process

```
┌─ USER LOADS MARKS ──────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 1: Check Authentication                               │ │
│  │  if (!isAuthenticated()) throw "Not authenticated"          │ │
│  │  → Prevents access without valid session                    │ │
│  │  → Encrypts data even without explicit decryption           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 2: Get Encryption Key from Session                    │ │
│  │  key = getEncryptionKey()                                   │ │
│  │  → Retrieves from memory (in session object)                │ │
│  │  → Returns [0x4f, 0x2a, 0x89, ...] (32 bytes)              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 3: Load Encrypted Data from IndexedDB                 │ │
│  │  payload = await loadEncryptedData("subject_data", key)    │ │
│  │  {                                                           │ │
│  │    ciphertext: "8aL2K9x4f/Op2+8kLx...",                     │ │
│  │    nonce: "q9mL2K5p1m8s0v...",                              │ │
│  │    timestamp: "2026-01-30T10:45:23Z"                        │ │
│  │  }                                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 4: Decode from Base64                                 │ │
│  │  ciphertext_bytes = decodeBase64(payload.ciphertext)       │ │
│  │  → [0x8f, 0x2a, 0x91, ..., encrypted data, ...]           │ │
│  │                                                              │ │
│  │  nonce_bytes = decodeBase64(payload.nonce)                 │ │
│  │  → [0xf1, 0x3e, 0x77, ...] (24 bytes)                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 5: Decrypt with NaCl SecretBox                        │ │
│  │  plaintext_bytes = nacl.secretbox.open(                     │ │
│  │    ciphertext: [encrypted bytes],                           │ │
│  │    nonce: [nonce bytes],                                    │ │
│  │    key: [encryption key]                                    │ │
│  │  )                                                           │ │
│  │                                                              │ │
│  │  Process:                                                    │ │
│  │  1. Verify Poly1305 MAC (detects tampering)                │ │
│  │     ✗ If tampered → return null (fail silently)            │ │
│  │     ✓ If valid → continue                                  │ │
│  │  2. Decrypt with XSalsa20                                   │ │
│  │     → Original plaintext bytes recovered                     │ │
│  │  3. Time: <100ms                                            │ │
│  │                                                              │ │
│  │  Output: [123, 34, 67, 65, 84, 49, ...] (plaintext bytes)  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 6: Decode UTF-8 to String                             │ │
│  │  plaintext_str = UTF-8 decode(plaintext_bytes)             │ │
│  │  → '{"CAT1":45,"CAT2":38,...}'                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Step 7: Parse JSON                                         │ │
│  │  data = JSON.parse(plaintext_str)                           │ │
│  │  → { CAT1: 45, CAT2: 38, ... }                              │ │
│  │                                                              │ │
│  │  ✓ Plaintext data in memory (React state)                 │ │
│  │  ✓ Displayed to user                                       │ │
│  │  ✓ Only decrypted when needed                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│  Decryption complete ✓                                          │
│  User sees: { CAT1: 45, CAT2: 38, ... }                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Session Management Lifecycle

```
                    ┌────────────────────┐
                    │  App Starts        │
                    └─────────┬──────────┘
                              ↓
            ┌─────────────────────────────────────┐
            │ Check sessionStorage for token      │
            └──────────────┬──────────────────────┘
                           ↓
              ┌────────────────────────────────┐
              │ Token exists & not expired?    │
              └───────┬──────────────┬─────────┘
                      │              │
                 YES  │              │  NO
                      ↓              ↓
            ┌──────────────────┐   ┌──────────────┐
            │ Load plaintext   │   │ Show Unlock  │
            │ encrypted data   │   │ Screen       │
            └────────┬─────────┘   └────┬─────────┘
                     │                  │
                     │          User enters password
                     │                  │
                     │          ┌───────↓─────────┐
                     │          │ Verify password │
                     │          └────┬────────┬───┘
                     │               │        │
                     │          PASS │        │ FAIL
                     │               ↓        ↓
                     │          ┌─────────┐  "Invalid"
                     │          │ Derive  │  Retry
                     │          │ key     │
                     │          └────┬────┘
                     │               ↓
                     │          ┌────────────────┐
                     │          │ Create session │
                     │          │ token & key    │
                     │          └────┬───────────┘
                     │               ↓
                     └──→ ┌──────────────────────┐
                         │ Session Active       │
                         │ ├ key in memory      │
                         │ ├ token in session   │
                         │ ├ start idle timer   │
                         │ └ timeout = 30 min   │
                         └─────┬────────────────┘
                               ↓
                ┌──────────────────────────────┐
                │ User Activity?               │
                └───────┬──────────────┬───────┘
                        │              │
                   YES  │              │  NO
                        ↓              │
                ┌───────────────┐      │
                │ Reset timer   │      │
                │ Continue      │      │
                └───────────────┘      │
                        ↑              │
                        └──────────────┤
                                       ↓
                        ┌──────────────────────┐
                        │ 30 minutes idle      │
                        │ Timer fires          │
                        └──────────┬───────────┘
                                   ↓
                        ┌──────────────────────┐
                        │ Auto-Logout:         │
                        │ ├ Clear session key  │
                        │ ├ Clear session obj  │
                        │ ├ Clear sessionStor  │
                        │ └ Show UnlockScreen  │
                        └──────────────────────┘
```

---

## 6. Data Visibility Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA VISIBILITY MATRIX                         │
├──────────────────┬──────────┬──────────┬──────────┬──────────────┤
│ Data Type        │ Browser  │ DevTools │ IndexedB │ localStorage │
│                  │ Memory   │          │ DB       │              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Encryption Key   │ ✓ Plain  │ ✗ Hidden │ ✗ No    │ ✗ No         │
│                  │ (session)│ (memory) │         │              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Password         │ ✗ Never  │ ✗ Never  │ ✗ Never │ ✗ Never      │
│                  │ stored   │ (only in │ (hash)  │              │
│                  │          │ input)   │         │              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Password Hash    │ ✗ No     │ ✗ No     │ ✗ No    │ ✓ Hashed     │
│                  │          │          │         │ (verify only)│
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Salt             │ ✗ No     │ ✗ No     │ ✗ No    │ ✓ Plaintext  │
│                  │          │          │         │ (salt is ok) │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Session Token    │ ✓ Plain  │ ✗ Hidden │ ✗ No    │ ✓ Plaintext  │
│                  │ (session)│ (session)│         │ (sessionStor)│
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Marks (Plain)    │ ✓ Plain  │ ✓ Plain  │ ✗ Enc   │ ✗ Encrypted  │
│                  │ (loaded) │ (loaded) │         │              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Marks (Stored)   │ ✗ No     │ ✗ No     │ ✓ Enc   │ ✗ Encrypted  │
│                  │          │          │ (hidden)│              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ PDFs (Plain)     │ ✓ Blob   │ ✓ Blob   │ ✗ Enc   │ ✗ No         │
│                  │ (open)   │ (open)   │         │              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ PDFs (Stored)    │ ✗ No     │ ✗ No     │ ✓ Enc   │ ✗ No         │
│                  │          │          │ (hidden)│              │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Theme            │ ✓ Plain  │ ✓ Plain  │ ✗ No    │ ✓ Plaintext  │
│                  │ (state)  │ (state)  │         │ (not secret) │
├──────────────────┼──────────┼──────────┼──────────┼──────────────┤
│ Nonce            │ ✗ No     │ ✗ No     │ ✓ Enc   │ ✗ No         │
│                  │          │          │ (with   │              │
│                  │          │          │ data)   │              │
└──────────────────┴──────────┴──────────┴──────────┴──────────────┘

Legend:
✓ = Visible / Accessible
✗ = Hidden / Not stored / Encrypted
(note) = Additional details
```

---

## 7. Security Threat Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      THREAT ANALYSIS                              │
├──────────────────────────┬─────────────────────────────────────┤
│ THREAT                   │ MITIGATION                          │
├──────────────────────────┼─────────────────────────────────────┤
│ 1. Weak Password         │ • Require 6+ chars minimum          │
│                          │ • Show strength meter               │
│                          │ • Recommend 12+ chars              │
│                          │ • User education                    │
│                          │ • Not fixable by code               │
├──────────────────────────┼─────────────────────────────────────┤
│ 2. Brute Force Attack    │ • PBKDF2 100K iterations           │
│                          │   (~1 sec per attempt)              │
│                          │ • No rate limiting (local only)    │
│                          │ • No account lockout needed         │
├──────────────────────────┼─────────────────────────────────────┤
│ 3. Key/Nonce Reuse       │ • New nonce per encryption         │
│                          │ • Key only from password (unique)  │
│                          │ • Never reuse same combo           │
├──────────────────────────┼─────────────────────────────────────┤
│ 4. Password in Memory    │ • Not stored after use              │
│                          │ • Not logged/printed                │
│                          │ • Cleared from input fields         │
│                          │ • JS doesn't guarantee wipe         │
├──────────────────────────┼─────────────────────────────────────┤
│ 5. Session Hijacking     │ • Session token (not key) in SS     │
│                          │ • Auto-expires in 30 min            │
│                          │ • Cleared on browser close          │
│                          │ • HTTPOnly not available (SPA)      │
├──────────────────────────┼─────────────────────────────────────┤
│ 6. Man-in-the-Middle     │ • All encryption client-side        │
│                          │ • Use HTTPS in production           │
│                          │ • Server never sees plaintext       │
├──────────────────────────┼─────────────────────────────────────┤
│ 7. Malware on Device     │ • Malware can steal password        │
│                          │ • Malware can read memory           │
│                          │ • No protection possible            │
│                          │ • User must ensure clean device     │
├──────────────────────────┼─────────────────────────────────────┤
│ 8. Shoulder Surfing      │ • Show/hide password toggle         │
│                          │ • Require password re-entry         │
│                          │ • User awareness                    │
├──────────────────────────┼─────────────────────────────────────┤
│ 9. Browser Storage Clear │ • IndexedDB cleared = data lost     │
│                          │ • No recovery without backup        │
│                          │ • User responsibility               │
│                          │ • Warning on logout                 │
├──────────────────────────┼─────────────────────────────────────┤
│ 10. Phishing             │ • Requires password entry           │
│                          │ • User must verify domain           │
│                          │ • Not preventable by code           │
└──────────────────────────┴─────────────────────────────────────┘
```

---

## 8. Component Communication Diagram

```
                         ┌─────────────┐
                         │    App      │
                         └──────┬──────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ↓              ↓              ↓
         ┌─────────────┐  ┌────────────┐  ┌────────────┐
         │ Unlock      │  │ Main Tabs  │  │ Settings   │
         │ Screen      │  │ (Subjects, │  │ Dialog     │
         │             │  │  Timer,    │  │            │
         │ ├ Create    │  │  Charts)   │  │ ├ Logout   │
         │ ├ Login     │  │            │  │ ├ Password │
         │ └ Auth      │  └─────┬──────┘  │ ├ Export   │
         └──────┬──────┘        │         │ └ Delete   │
                │               │         └────┬───────┘
                │ onAuth...     │ onUpdate      │
                │               │               │
                └───────┬───────┴───────┬───────┘
                        │               │
                        ↓               ↓
              ┌────────────────────────────────┐
              │ authManager.js                 │
              │ • authenticate(pwd)            │
              │ • getSession()                 │
              │ • logout()                     │
              └──────────────┬─────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ↓            ↓            ↓
        ┌────────────┐  ┌──────────┐  ┌──────────┐
        │ crypto.js  │  │ encrypte │  │ secure   │
        │            │  │ dStorage │  │ Storage  │
        │ • Derive   │  │ .js      │  │ .js      │
        │ • Hash     │  │ • Save   │  │ • IDB    │
        │ • Encode   │  │ • Load   │  │ • Enc/  │
        │            │  │          │  │   Dec   │
        └────────────┘  └──────────┘  └──────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ IndexedDB       │
                    │ (Encrypted DB)  │
                    └─────────────────┘
```

---

## 9. File Size & Performance

```
┌──────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE METRICS                             │
├────────────────┬─────────────┬──────────┬────────────────────────┤
│ Operation      │ Time        │ Size     │ Notes                  │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ PBKDF2 Key     │ ~1000ms     │ N/A      │ Intentional slowness   │
│ Derivation     │             │          │ Deters brute force     │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ SHA-256 Hash   │ <1ms        │ 32 bytes │ Fast, for verification│
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Generate Nonce │ <1ms        │ 24 bytes │ Random entropy         │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Encrypt 1MB    │ ~50ms       │ +16 bytes│ Overhead: MAC tag      │
│ File           │             │          │ (Poly1305)             │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Decrypt 1MB    │ ~50ms       │ Original │ Verify MAC first       │
│ File           │             │ size     │                        │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ IndexedDB Save │ ~100-200ms  │ N/A      │ Async, non-blocking    │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ IndexedDB Load │ ~100-200ms  │ N/A      │ Async, non-blocking    │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Base64 Encode  │ <10ms       │ +33%     │ 3 bytes → 4 chars      │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Base64 Decode  │ <10ms       │ Original │ Reverse encoding       │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Total Login    │ ~1.5s       │ N/A      │ 1s PBKDF2 + IO         │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Total Data     │ <500ms      │ N/A      │ Multiple encrypt ops   │
│ Save (100 KB)  │             │          │                        │
├────────────────┼─────────────┼──────────┼────────────────────────┤
│ Total Data     │ <500ms      │ N/A      │ Multiple decrypt ops   │
│ Load (100 KB)  │             │          │                        │
└────────────────┴─────────────┴──────────┴────────────────────────┘
```

---

## 10. Error Handling Flow

```
┌─ User Action ──────────────────────────────────────────────────┐
│                                                                 │
│ try {                                                           │
│   // Perform encryption/decryption operation                   │
│ } catch (error) {                                               │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐   │
│   │ Error Type Classification                             │   │
│   ├─────────────────────────────────────────────────────┤   │
│   │ ✗ "not authenticated"                                │   │
│   │   → Session expired or invalid                        │   │
│   │   → Action: Redirect to UnlockScreen                 │   │
│   │   → Show: "Session expired. Please login again."     │   │
│   │                                                       │   │
│   │ ✗ "Decryption failed"                                │   │
│   │   → MAC verification failed (tampered data)          │   │
│   │   → Wrong encryption key                             │   │
│   │   → Wrong password                                   │   │
│   │   → Action: Prevent data access                      │   │
│   │   → Show: "Invalid password or corrupted data"       │   │
│   │                                                       │   │
│   │ ✗ "User not authenticated"                           │   │
│   │   → getEncryptionKey() called without session        │   │
│   │   → Action: Redirect to login                        │   │
│   │   → Show: "You must login first"                     │   │
│   │                                                       │   │
│   │ ✗ "Storage quota exceeded"                           │   │
│   │   → IndexedDB storage full (rare)                    │   │
│   │   → Action: Suggest clearing old data                │   │
│   │   → Show: "Storage full. Please delete old files."   │   │
│   │                                                       │   │
│   │ ✗ "QuotaExceededError"                               │   │
│   │   → localStorage/IndexedDB quota limit                │   │
│   │   → Action: Clear non-essential data                 │   │
│   │   → Show: "Storage full. Clean up old data."         │   │
│   │                                                       │   │
│   │ ✗ Other errors                                       │   │
│   │   → Unexpected failure                               │   │
│   │   → Action: Log to console, show generic message     │   │
│   │   → Show: "An error occurred. Please try again."     │   │
│   │                                                       │   │
│   └───────────────────────────────────────────────────────┘   │
│                                                                 │
│   // NO SENSITIVE INFO IN ERROR MESSAGES                       │
│   // ✗ Don't show: encryption keys, passwords, raw data       │
│   // ✓ Do show: user-friendly, actionable messages             │
│                                                                 │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

**All diagrams updated: January 2026**
