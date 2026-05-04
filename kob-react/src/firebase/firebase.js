/**
 * firebase.js — KOB Marketplace
 * Firebase initialization — backbone of the entire app
 *
 * Services initialized:
 * - Firebase Auth    (authentication)
 * - Firestore DB     (database)
 * - Firebase Messaging (FCM push notifications)
 *
 * Environment variables required (.env):
 * VITE_FIREBASE_API_KEY
 * VITE_FIREBASE_AUTH_DOMAIN
 * VITE_FIREBASE_PROJECT_ID
 * VITE_FIREBASE_STORAGE_BUCKET
 * VITE_FIREBASE_MESSAGING_SENDER_ID
 * VITE_FIREBASE_APP_ID
 * VITE_FIREBASE_VAPID_KEY  (FCM only)
 */

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
} from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

// ================================
// 1. Normalize storage bucket
// ================================
// Some Firebase console snippets use `.firebasestorage.app`
// We normalize to `.appspot.com` for consistency
const rawBucket =
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''

const storageBucket = rawBucket.includes('.firebasestorage.app')
  ? rawBucket.replace('.firebasestorage.app', '.appspot.com')
  : rawBucket

// ================================
// 2. Firebase Config
// ================================
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// ================================
// 3. Validate config in DEV
// ================================
if (import.meta.env.DEV) {
  const required = [
    ['VITE_FIREBASE_API_KEY',            firebaseConfig.apiKey],
    ['VITE_FIREBASE_AUTH_DOMAIN',        firebaseConfig.authDomain],
    ['VITE_FIREBASE_PROJECT_ID',         firebaseConfig.projectId],
    ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId],
    ['VITE_FIREBASE_APP_ID',             firebaseConfig.appId],
  ]

  required.forEach(([key, val]) => {
    if (!val) {
      console.warn(
        `[KOB Firebase] ⚠️ Missing env var: ${key}`
      )
    }
  })

  if (
    firebaseConfig.storageBucket &&
    !firebaseConfig.storageBucket.endsWith('.appspot.com')
  ) {
    console.warn(
      '[KOB Firebase] ⚠️ Unrecognized storageBucket format:',
      firebaseConfig.storageBucket
    )
  }

  console.log('[KOB Firebase] ✅ Config loaded:', {
    projectId: firebaseConfig.projectId,
    apiKey:    firebaseConfig.apiKey
      ? '✓ present'
      : '✗ missing',
    authDomain: firebaseConfig.authDomain,
  })
}

// ================================
// 4. Initialize Firebase App
// ================================
// Prevent re-initialization on hot reload (Vite HMR)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()

// ================================
// 5. Firebase Auth
// ================================
const auth = getAuth(app)

// Keep user logged in across browser refreshes
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    if (import.meta.env.DEV) {
      console.warn(
        '[KOB Firebase] Auth persistence failed:',
        err.message
      )
    }
  })
}

// ================================
// 6. Firestore — with offline cache
// ================================
// initializeFirestore gives us more control than getFirestore
const db = initializeFirestore(app, {
  // Unlimited cache — good for marketplace with many products
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
})

// Enable offline persistence — users see data without internet
// Silently fails on multiple tabs (expected behavior)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open — only one tab can use persistence
      if (import.meta.env.DEV) {
        console.warn(
          '[KOB Firebase] Firestore persistence unavailable: ' +
          'Multiple tabs open.'
        )
      }
    } else if (err.code === 'unimplemented') {
      // Browser does not support persistence
      if (import.meta.env.DEV) {
        console.warn(
          '[KOB Firebase] Firestore persistence not supported ' +
          'in this browser.'
        )
      }
    }
  })
}

// ================================
// 7. Firebase Cloud Messaging
// ================================
// FCM only works in browsers that support service workers
// isSupported() is async — we initialize lazily
let messaging = null

async function getMessagingInstance() {
  try {
    const supported = await isSupported()
    if (supported && typeof window !== 'undefined') {
      if (!messaging) {
        messaging = getMessaging(app)
      }
      return messaging
    }
    return null
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(
        '[KOB Firebase] FCM not available:',
        err.message
      )
    }
    return null
  }
}

// ================================
// 8. Health check (DEV only)
// ================================
if (import.meta.env.DEV) {
  // Verify app initialized correctly
  const initializedApp = getApps()[0]
  if (initializedApp) {
    console.log(
      '[KOB Firebase] ✅ App initialized:',
      initializedApp.name
    )
  }

  // Check FCM support asynchronously
  isSupported().then((supported) => {
    console.log(
      '[KOB Firebase] FCM supported:',
      supported ? '✅ Yes' : '❌ No'
    )
  })
}

// ===============================
// Exports
// ===============================
export {
  app,
  auth,
  db,
  getMessagingInstance, // Use this to get messaging instance
  firebaseConfig,       // Used by firebase-messaging-sw.js generator
}