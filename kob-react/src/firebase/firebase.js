/**
 * firebase.js — KOB Marketplace
 * Firebase initialization — backbone of the entire app
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
  getFirestore, // AN ƘARA: Don kare sake initialize din Firestore
} from 'firebase/firestore' 
import { getMessaging, isSupported } from 'firebase/messaging'

// ================================
// 1. Normalize storage bucket
// ================================
const rawBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
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
    if (!val) console.warn(`[KOB Firebase] ⚠️ Missing env var: ${key}`)
  })
}

// ================================
// 4. Initialize Firebase App
// ================================
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// ================================
// 5. Firebase Auth
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
// 6. Firestore — AN GYARA KARIYA DA SAKE INITIALIZE
// ================================
let db;
if (getApps().length === 0) {
  // Idan app din sabo ne, muna initialize dinsa da Multi-Tab cache
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  })
} else {
  try {
    // Idan kuma an riga an yi, muna dauko tsohon ne kawai don gudun kawo dogon loading
    db = getFirestore(app)
  } catch (e) {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    })
  }
}

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
      console.warn('[KOB Firebase] FCM not available:', err.message)
    }
    return null
  }
}

// Exports
export {
  app,
  auth,
  db,
  getMessagingInstance,
  firebaseConfig,
}
