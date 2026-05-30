/**
 * firebase.js — KOB Marketplace
 * Firebase initialization — backbone of the entire app
 *
 * FIXED v2:
 * ✅ Firestore init bug fixed — logic was inverted (getApps().length === 0
 *    is true BEFORE app init, but app is already initialized above it,
 *    so condition was ALWAYS going to the else branch — persistent cache
 *    was NEVER being applied)
 * ✅ HMR-safe singleton — initializeApp guard preserved
 * ✅ Auth persistence non-blocking — .catch() preserved
 * ✅ Messaging lazy singleton — getMessagingInstance() preserved
 * ✅ Storage bucket normalization preserved
 * ✅ Dev env validation preserved
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore,
} from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

// ================================
// 1. Normalize storage bucket
// Fixes: .firebasestorage.app → .appspot.com
// ================================
const rawBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
const storageBucket = rawBucket.includes('.firebasestorage.app')
  ? rawBucket.replace('.firebasestorage.app', '.appspot.com')
  : rawBucket

// ================================
// 2. Firebase Config
// ================================
const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      storageBucket,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
}

// ================================
// 3. Validate config in DEV
// ================================
if (import.meta.env.DEV) {
  const required = [
    ['VITE_FIREBASE_API_KEY',             firebaseConfig.apiKey],
    ['VITE_FIREBASE_AUTH_DOMAIN',         firebaseConfig.authDomain],
    ['VITE_FIREBASE_PROJECT_ID',          firebaseConfig.projectId],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
    ['VITE_FIREBASE_APP_ID',              firebaseConfig.appId],
  ]
  required.forEach(([key, val]) => {
    if (!val) console.warn(`[KOB Firebase] ⚠️ Missing env var: ${key}`)
  })
}

// ================================
// 4. Initialize Firebase App — HMR-safe singleton
// ================================
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()

// ================================
// 5. Firebase Auth — non-blocking persistence
// ================================
const auth = getAuth(app)

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    if (import.meta.env.DEV) {
      console.warn('[KOB Firebase] Auth persistence failed:', err.message)
    }
  })
}

// ================================
// 6. Firestore — FIXED singleton init
//
// BUG IN ORIGINAL:
// By the time the Firestore block runs, `app` is ALREADY initialized
// above (line: const app = getApps()...). So getApps().length is
// ALWAYS >= 1 here. The `if (getApps().length === 0)` branch —
// which applies persistentLocalCache — was DEAD CODE and NEVER ran.
// Firestore was always initialized WITHOUT offline persistence.
//
// FIX:
// Use a module-level flag `firestoreInitialized` to track whether
// initializeFirestore() has been called. On first run: initialize
// with persistent cache. On HMR reload: getFirestore() safely.
// ================================
let db

try {
  // ✅ First call in this module lifetime — apply persistent offline cache
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  })
} catch (err) {
  // ✅ Already initialized (HMR reload / module re-import) — reuse existing
  // Firebase throws "Firestore has already been started" on double init.
  // getFirestore() safely returns the existing instance.
  if (import.meta.env.DEV) {
    console.warn('[KOB Firebase] Firestore already initialized, reusing:', err.message)
  }
  db = getFirestore(app)
}

// ================================
// 7. Firebase Cloud Messaging — lazy singleton
// Only initialized when needed (not on every import)
// ================================
let _messaging = null

async function getMessagingInstance() {
  try {
    // Guard: only in browser context
    if (typeof window === 'undefined') return null

    // Guard: check FCM browser support first
    const supported = await isSupported()
    if (!supported) return null

    // Singleton — reuse existing instance
    if (!_messaging) {
      _messaging = getMessaging(app)
    }

    return _messaging
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[KOB Firebase] FCM not available:', err.message)
    }
    return null
  }
}

// ================================
// Exports
// ================================
export {
  app,
  auth,
  db,
  getMessagingInstance,
  firebaseConfig,
}
