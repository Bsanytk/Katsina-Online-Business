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
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore' // GYARA: Mun cire tsofaffin imports mun kawo na zamani
import { getMessaging, isSupported } from 'firebase/messaging'

// ================================
// 1. Normalize storage bucket
// ================================
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
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()

// ================================
// 5. Firebase Auth
// ================================
const auth = getAuth(app)

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
// 6. Firestore — GYARA: Sabon tsarin Multi-Tab Cache
// ================================
// Wannan sabon tsarin zai magance error din Firestore akai-akai a console
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(), // Yana bawa kowane tab damar aiki tare lokaci guda
  }),
})

// ================================
// 7. Firebase Cloud Messaging
// ================================
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
  const initializedApp = getApps()[0]
  if (initializedApp) {
    console.log(
      '[KOB Firebase] ✅ App initialized:',
      initializedApp.name
    )
  }

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
  getMessagingInstance,
  firebaseConfig,
}
