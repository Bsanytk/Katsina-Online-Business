import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore'
import { auth, db } from './firebase'

const AuthContext = createContext()

// ============================
// Context Provider
// ============================
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const ref = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(ref)

          if (snap.exists()) {
            const userData = snap.data() || {}

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role ?? 'buyer',
              displayName: userData.displayName ?? null,
              createdAt: userData.createdAt ?? null,
              isVerified: userData.isVerified ?? false,
              kobNumber: userData.kobNumber || null,
            })
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'buyer',
              displayName: null,
              createdAt: null,
              isVerified: false,
              kobNumber: null,
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

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error } },
    children
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// ============================
// Helper: Generate sequential KOB ID
// ============================
async function generateKobId() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);

    if (snap.empty) return "KOB-001";

    const lastUser = snap.docs[0].data();
    const lastKob = lastUser.kobNumber || "KOB-000";
    const num = parseInt(lastKob.split("-")[1], 10) + 1;
    return `KOB-${num.toString().padStart(3, "0")}`;
  } catch (err) {
    console.error("Failed to generate KOB ID:", err);
    return "KOB-001"; // fallback
  }
}

// ============================
// Auth API helpers
// ============================
export async function loginUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result
  } catch (error) {
    throw new Error(formatAuthError(error.code))
  }
}

export async function registerUser(email, password, role = 'buyer') {
  try {
    const validRoles = ['buyer', 'seller']
    const userRole = validRoles.includes(role) ? role : 'buyer'

    const result = await createUserWithEmailAndPassword(auth, email, password)
    const { user: firebaseUser } = result

    // ❗ Assign KOB ID ONLY if role is seller
    let kobNumber = null
    if (userRole === 'seller') {
      kobNumber = await generateKobId()
    }

    const ref = doc(db, 'users', firebaseUser.uid)

    await setDoc(ref, {
      email: firebaseUser.email,
      role: userRole,
      displayName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false,
      kobNumber: kobNumber, // null for buyers
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

// ============================
// Error formatter
// ============================
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
