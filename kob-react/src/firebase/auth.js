import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext();

// ================================
// Auth Context Provider
// ================================
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const ref  = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
              const data = snap.data() || {};

              // ✅ FIX: .trim() prevents space bugs
              // Never reset to "buyer" if role exists
              const role = (data.role || "buyer").trim();

              setUser({
                uid:         firebaseUser.uid,
                email:       firebaseUser.email,
                role,
                displayName: data.displayName  ?? null,
                businessName:data.businessName ?? null,
                createdAt:   data.createdAt    ?? null,
                isVerified:  data.isVerified   ?? false,
                kobNumber:   data.kobNumber    ?? null,
                photoURL:    data.photoURL     ?? null,
                location:    data.location     ?? null,
                whatsappNumber: data.whatsappNumber ?? null,
              });
            } else {
              // ✅ New user — no Firestore doc yet
              // Only happens briefly after registration
              // DO NOT default to buyer — wait for setDoc
              setUser({
                uid:         firebaseUser.uid,
                email:       firebaseUser.email,
                role:        "buyer",
                displayName: null,
                businessName:null,
                createdAt:   null,
                isVerified:  false,
                kobNumber:   null,
                photoURL:    null,
                location:    null,
                whatsappNumber: null,
              });
            }
          } else {
            setUser(null);
          }
          setError(null);
        } catch (err) {
          console.error("Auth state error:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, error } },
    children
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ================================
// ✅ FIX: Atomic KOB ID Generator
// Uses Firestore Transaction — no race condition!
// ================================
async function generateKobIdAtomic() {
  const counterRef = doc(db, "system", "kobCounter");

  try {
    const newId = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);

      let nextNum = 1;

      if (counterSnap.exists()) {
        nextNum = (counterSnap.data().lastNumber || 0) + 1;
      }

      // Update counter atomically
      transaction.set(counterRef, {
        lastNumber: nextNum,
        updatedAt:  serverTimestamp(),
      });

      return `KOB-${nextNum.toString().padStart(3, "0")}`;
    });

    return newId;
  } catch (err) {
    console.error("KOB ID generation failed:", err);
    // Fallback — use timestamp to ensure uniqueness
    const ts = Date.now().toString().slice(-4);
    return `KOB-T${ts}`;
  }
}

// ================================
// Register User
// ================================
export async function registerUser(
  email, password, role = "buyer"
) {
  // Validate role
  const validRoles = ["buyer", "seller"];
  const userRole   = validRoles.includes(role.trim())
    ? role.trim()
    : "buyer";

  try {
    // Step 1: Create Firebase Auth user
    const result = await createUserWithEmailAndPassword(
      auth, email, password
    );
    const { user: firebaseUser } = result;

    // Step 2: Generate KOB ID for sellers (atomic)
    let kobNumber = null;
    if (userRole === "seller") {
      kobNumber = await generateKobIdAtomic();
    }

    // Step 3: Save user profile to Firestore
    const ref = doc(db, "users", firebaseUser.uid);
    await setDoc(ref, {
      email:        firebaseUser.email,
      role:         userRole,        // ✅ Exact role — no trim needed here
      displayName:  null,
      businessName: null,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
      isVerified:   false,
      kobNumber:    kobNumber,       // null for buyers
      photoURL:     null,
      location:     null,
      whatsappNumber: null,
    });

    return result;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ================================
// Login User
// ================================
export async function loginUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(
      auth, email, password
    );
    return result;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ================================
// Logout User
// ================================
export async function logoutUser() {
  try {
    return await signOut(auth);
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ================================
// Error Formatter
// ================================
function formatAuthError(code) {
  const messages = {
    "auth/email-already-in-use":
      "This email is already registered. Try logging in.",
    "auth/weak-password":
      "Password is too weak. Use at least 6 characters.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/user-not-found":
      "No account found with this email.",
    "auth/wrong-password":
      "Incorrect password. Please try again.",
    "auth/invalid-credential":
      "Invalid email or password. Please try again.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/operation-not-allowed":
      "This operation is not allowed. Contact support.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
  };
  return messages[code] || "Authentication error. Please try again.";
}
