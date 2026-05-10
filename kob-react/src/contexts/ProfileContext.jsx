/**
 * ProfileContext.jsx — KOB Global Profile Brain
 *
 * MISSION: Single source of truth for all profile data.
 * - Fetch ONCE from Firestore
 * - Cache globally
 * - Eliminate duplicate reads across components
 * - Reduce Firebase quota usage
 * - Support real-time sync safely
 *
 * BACKWARD COMPATIBLE: Works with all existing user docs
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";

// ================================
// Context
// ================================
const ProfileContext = createContext(null);

// ================================
// Safe defaults — handles old users
// who may not have all fields
// ================================
function buildProfile(uid, email, data = {}) {
  return {
    uid: uid || "",
    email: email || "",

    // Identity
    displayName: data.displayName || "",
    businessName: data.businessName || "",
    bio: data.bio || "",
    photoURL: data.photoURL || "",

    // Contact
    phone: data.phone || data.phoneNumber || "",
    phoneNumber: data.phoneNumber || data.phone || "",
    whatsappNumber: data.whatsappNumber || "",

    // Location
    location: data.location || "",
    fullAddress: data.fullAddress || "",

    // KOB Identity
    role: (data.role || "buyer").trim(),
    kobNumber: data.kobNumber || "",
    isVerified: data.isVerified ?? false,
    isAdmin: data.isAdmin ?? false,
    kobExpress: data.kobExpress ?? false,

    // Social
    socialLinks: data.socialLinks || {},

    // Meta
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
    fcmToken: data.fcmToken || null,

    // Raw — preserve all original fields
    _raw: data,
  };
}

// ================================
// Provider
// ================================
export function ProfileProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track listener to prevent memory leaks
  const unsubRef = useRef(null);

  // ================================
  // Real-time profile listener
  // Only fires when uid changes
  // ================================
  useEffect(() => {
    // Clean up previous listener
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    // Wait for auth to resolve
    if (authLoading) return;

    // No user — clear profile
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    const ref = doc(db, "users", user.uid);

    // onSnapshot = real-time + handles offline
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setProfile(buildProfile(user.uid, user.email, snap.data()));
        } else {
          // New user — no Firestore doc yet
          setProfile(
            buildProfile(user.uid, user.email, {
              role: user.role || "buyer",
            })
          );
        }
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("[ProfileContext] Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    unsubRef.current = unsub;

    // Cleanup on unmount or uid change
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [user?.uid, authLoading]);

  // ================================
  // Optimistic local update
  // Call after saving to Firestore
  // UI updates instantly — no waiting
  // ================================
  const updateLocalProfile = useCallback((patch) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...patch };
      merged._raw = { ...prev._raw, ...patch };
      return merged;
    });
  }, []);

  const value = {
    profile,
    loading: loading || authLoading,
    error,
    updateLocalProfile,

    // Convenience booleans
    isSeller: profile?.role === "seller",
    isBuyer: profile?.role === "buyer",
    isAdmin: profile?.role === "admin" || profile?.isAdmin === true,
    isVerified: profile?.isVerified === true,
    // ✅ NEW — helps useSellerShop detect own shop
    uid: profile?.uid || null,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside <ProfileProvider>");
  }
  return ctx;
}
