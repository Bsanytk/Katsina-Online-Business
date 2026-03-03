// Firebase configuration and initialization
// Copy your Firebase config into environment variables (VITE_FIREBASE_*)
// Example .env:
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_PROJECT_ID=...

import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Normalize and validate Firebase config from environment
const rawStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
// Some deploy snippets may use `.firebasestorage.app` — convert to `.appspot.com` when detected
const storageBucket = rawStorageBucket.includes('.firebasestorage.app')
  ? rawStorageBucket.replace('.firebasestorage.app', '.appspot.com')
  : rawStorageBucket

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Helpful runtime warnings when env is incomplete
if (import.meta.env.DEV) {
  if (!firebaseConfig.apiKey) {
    console.warn('Missing VITE_FIREBASE_API_KEY in environment. Firebase auth may fail.')
  }
  if (firebaseConfig.storageBucket && !firebaseConfig.storageBucket.endsWith('.appspot.com')) {
    console.warn('Unrecognized storageBucket format:', firebaseConfig.storageBucket)
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Ensure auth persistence so users stay logged in across refreshes
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    if (import.meta.env.DEV) console.warn('Failed to set auth persistence:', err)
  })
}

// Development-only debug info
if (import.meta.env.DEV) {
  console.log('Firebase API Key loaded:', !!firebaseConfig.apiKey)
  console.log('Firebase projectId:', firebaseConfig.projectId)
}

export { app, auth, db }
