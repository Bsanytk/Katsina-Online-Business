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
import { auth, db, getMessagingInstance } from "./firebase";
import { getToken } from "firebase/messaging";

// ================================
// VAPID Key
// ================================
const VAPID_KEY =
  "BCcBEKvO7CFus97TuRLNwxf-xHN_fdShOb_FHAz3c5PXJhy4_ap9UJBqrMjjjolgHvsv99t0OhMSNNRVciArP9c";

// ================================
// Auth Context
// ================================
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data() || {};
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
        console.error("Auth state error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

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

export function useAuth() {
  return useContext(AuthContext);
}

// ================================
// Atomic KOB ID Generator
// ================================
async function generateKobIdAtomic() {
  const counterRef = doc(db, "system", "kobCounter");
  try {
    const newId = await runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      const nextNum = snap.exists() ? (snap.data().lastNumber || 0) + 1 : 1;
      tx.set(counterRef, {
        lastNumber: nextNum,
        updatedAt: serverTimestamp(),
      });
      return `KOB-${nextNum.toString().padStart(3, "0")}`;
    });
    return newId;
  } catch (err) {
    console.error("KOB ID generation failed:", err);
    return `KOB-T${Date.now().toString().slice(-4)}`;
  }
}

// ================================
// Save FCM Token
// ================================
async function saveFCMToken(uid) {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token && uid) {
      const ref = doc(db, "users", uid);
      await setDoc(
        ref,
        {
          fcmToken: token,
          fcmUpdatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (import.meta.env.DEV) {
        console.log("[FCM] Token saved:", token.slice(0, 20) + "...");
      }
    }
  } catch (err) {
    // FCM is optional — never block auth flow
    if (import.meta.env.DEV) {
      console.warn("[FCM] Token save failed:", err.message);
    }
  }
}

// ================================
// Register User
// ================================
export async function registerUser(email, password, role = "buyer") {
  const validRoles = ["buyer", "seller"];
  const userRole = validRoles.includes(role.trim()) ? role.trim() : "buyer";

  try {
    // Step 1: Create Firebase Auth user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = result;

    // Step 2: Send email verification
    try {
      await sendEmailVerification(firebaseUser);
    } catch (verifyErr) {
      // Non-blocking — log but continue
      console.warn("Email verification send failed:", verifyErr.message);
    }

    // Step 3: Generate KOB ID for sellers
    let kobNumber = null;
    if (userRole === "seller") {
      kobNumber = await generateKobIdAtomic();
    }

    // Step 4: Save user profile to Firestore
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

    // Step 5: Request FCM token (non-blocking)
    saveFCMToken(firebaseUser.uid);

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
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Request FCM token on login (non-blocking)
    saveFCMToken(result.user.uid);
    return result;
  } catch (err) {
    throw new Error(formatAuthError(err.code));
  }
}

// ================================
// Reset Password
// ================================
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
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/operation-not-allowed":
      "This operation is not allowed. Contact support.",
  };
  return messages[code] || "Authentication error. Please try again.";
}
