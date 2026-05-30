/**
 * firebase/auth.js — KOB Auth Provider
 *
 * FIXED v3:
 * ✅ loginUser bug fixed — auth.email removed (was always undefined)
 * ✅ FCM init fully deferred — never blocks auth state transitions
 * ✅ All functions exported correctly (named exports)
 * ✅ AuthContext.Provider value includes all needed functions
 * ✅ role .trim() on every read — prevents "seller " space bug
 * ✅ registerUser — atomic KOB ID via runTransaction
 * ✅ No circular dependencies
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ─────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // ✅ FCM deferred — import only, never awaited here
          // This prevents FCM from blocking onAuthStateChanged
          import("../services/fcm")
            .then(({ initFCM }) => initFCM(firebaseUser.uid))
            .catch((e) =>
              console.warn("[KOB Auth] FCM deferred init:", e.message)
            );

          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data() || {};
            // ✅ .trim() on role — prevents "seller " space bug
            const role = (data.role || "buyer").trim();

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              role,
              displayName: data.displayName ?? null,
              businessName: data.businessName ?? null,
              createdAt: data.createdAt ?? null,
              isVerified: data.isVerified ?? false,
              kobNumber: data.kobNumber ?? null,
              photoURL: data.photoURL ?? null,
              location: data.location ?? null,
              whatsappNumber: data.whatsappNumber ?? null,
            });
          } else {
            // New user — document not yet created
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              role: "buyer",
              displayName: null,
              businessName: null,
              createdAt: null,
              isVerified: false,
              kobNumber: null,
              photoURL: null,
              location: null,
              whatsappNumber: null,
            });
          }
        } else {
          setUser(null);
        }
        setError(null);
      } catch (err) {
        console.error("[KOB Auth] State error:", err);
        setError(err.message);
      } finally {
        // ✅ Always release loading — even on error
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ All auth functions in context value
  // Using React.createElement instead of JSX — auth.js is a .js file,
  // not .jsx. JSX in .js files crashes Rollup/Vite build on Vercel.
  // React.createElement is 100% equivalent — no JSX transform needed.
  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        resetPassword,
        getCurrentUser,
      },
    },
    children
  );
}

// ─────────────────────────────────────────────
// useAuth Hook
// ─────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

// ─────────────────────────────────────────────
// Atomic KOB ID Generator
// ─────────────────────────────────────────────
async function generateKobIdAtomic() {
  const counterRef = doc(db, "system", "kobCounter");
  try {
    const newId = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      const nextNum = snap.exists()
        ? (snap.data().lastNumber || 0) + 1
        : 1;
      tx.set(counterRef, {
        lastNumber: nextNum,
        updatedAt: serverTimestamp(),
      });
      return `KOB-${nextNum.toString().padStart(3, "0")}`;
    });
    return newId;
  } catch (err) {
    console.error("[KOB] KOB ID generation failed:", err);
    // Fallback — timestamp-based ID
    return `KOB-T${Date.now().toString().slice(-4)}`;
  }
}

// ─────────────────────────────────────────────
// Register User
// ─────────────────────────────────────────────
export async function registerUser(email, password, role = "buyer") {
  const validRoles = ["buyer", "seller"];
  const userRole = validRoles.includes(role?.trim()) ? role.trim() : "buyer";

  try {
    // Step 1: Create Firebase Auth user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = result;

    // Step 2: Email verification (non-blocking)
    try {
      await sendEmailVerification(firebaseUser);
    } catch (verifyErr) {
      console.warn("[KOB Auth] Email verification failed:", verifyErr.message);
    }

    // Step 3: KOB ID for sellers only
    let kobNumber = null;
    if (userRole === "seller") {
      kobNumber = await generateKobIdAtomic();
    }

    // Step 4: Save Firestore profile
    const ref = doc(db, "users", firebaseUser.uid);
    await setDoc(ref, {
      email: firebaseUser.email,
      role: userRole,
      displayName: null,
      businessName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false,
      kobNumber,
      photoURL: null,
      location: null,
      whatsappNumber: null,
    });

    return result;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ─────────────────────────────────────────────
// Login User
//
// BUG FIX: Original had `auth.email || email`
// auth.email is ALWAYS undefined — auth is the
// Firebase Auth instance, not a user object.
// Fixed to pass `email` directly.
// ─────────────────────────────────────────────
export async function loginUser(email, password) {
  try {
    // ✅ FIXED: was `auth.email || email` — auth.email is always undefined
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ─────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────
export async function resetPassword(email) {
  if (!email?.trim()) {
    throw new Error("Please enter your email address.");
  }
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return true;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ─────────────────────────────────────────────
// Logout User
// ─────────────────────────────────────────────
export async function logoutUser() {
  try {
    return await signOut(auth);
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ─────────────────────────────────────────────
// Get Current User (sync)
// ─────────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}

// ─────────────────────────────────────────────
// Error Formatter
// ─────────────────────────────────────────────
function formatAuthError(code) {
  const messages = {
    "auth/email-already-in-use":
      "This email is already registered. Try logging in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential":
      "Invalid email or password. Please try again.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/operation-not-allowed":
      "This operation is not allowed. Contact support.",
  };
  return messages[code] || "Authentication error. Please try again.";
}
