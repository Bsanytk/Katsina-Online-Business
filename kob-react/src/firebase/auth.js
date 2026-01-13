// Auth helpers and React context to track user + role
// Exports: loginUser, registerUser, logoutUser, getCurrentUser, AuthProvider, useAuth

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // fetch role from /users/{uid}
        const ref = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)
        const role = snap.exists() ? (snap.data().role || 'normal') : 'normal'
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Avoid JSX parsing issues - use createElement
  return React.createElement(AuthContext.Provider, { value: { user, loading } }, children)
}

export function useAuth() {
  return useContext(AuthContext)
}

// Auth API helpers
export async function loginUser(email, password) {
  // returns firebase auth userCredential
  return signInWithEmailAndPassword(auth, email, password)
}

export async function registerUser(email, password, extra = {}) {
  // registers user and creates a /users/{uid} doc with role default 'normal'
  const result = await createUserWithEmailAndPassword(auth, email, password)
  const { user } = result
  const ref = doc(db, 'users', user.uid)
  await setDoc(ref, { email: user.email, role: extra.role || 'normal', createdAt: new Date() })
  return result
}

export async function logoutUser() {
  return signOut(auth)
}

export function getCurrentUser() {
  return auth.currentUser
}
