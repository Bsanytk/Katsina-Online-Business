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
  const [error, setError] = useState(null)

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // fetch role from /users/{uid}
          const ref = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(ref)
          
          if (snap.exists()) {
            const userData = snap.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || 'buyer', // buyer, seller, or admin
              displayName: userData.displayName || null,
              createdAt: userData.createdAt || null,
            })
          } else {
            // Fallback if no user doc exists
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'buyer',
              displayName: null,
              createdAt: null,
            })
          }
        } else {
          setUser(null)
        }
        setError(null)
      } catch (err) {
        console.error('Auth state error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Avoid JSX parsing issues - use createElement
  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error } },
    children
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// Auth API helpers
export async function loginUser(email, password) {
  // returns firebase auth userCredential
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result
  } catch (error) {
    throw new Error(formatAuthError(error.code))
  }
}

export async function registerUser(email, password, role = 'buyer') {
  // registers user and creates a /users/{uid} doc with specified role
  // Valid roles: 'buyer', 'seller', 'admin'
  try {
    const validRoles = ['buyer', 'seller', 'admin']
    const userRole = validRoles.includes(role) ? role : 'buyer'

    const result = await createUserWithEmailAndPassword(auth, email, password)
    const { user: firebaseUser } = result

    const ref = doc(db, 'users', firebaseUser.uid)
    await setDoc(ref, {
      email: firebaseUser.email,
      role: userRole,
      displayName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return result
  } catch (error) {
    throw new Error(formatAuthError(error.code))
  }
}

export async function logoutUser() {
  try {
    return await signOut(auth)
  } catch (error) {
    throw new Error(formatAuthError(error.code))
  }
}

export function getCurrentUser() {
  return auth.currentUser
}

/**
 * Format Firebase auth error codes into user-friendly messages
 */
function formatAuthError(code) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/operation-not-allowed': 'This operation is not allowed. Contact support.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  }

  return errorMessages[code] || 'Authentication error. Please try again.'
}
