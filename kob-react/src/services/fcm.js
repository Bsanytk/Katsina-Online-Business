/**
 * fcm.js — KOB Firebase Cloud Messaging
 *
 * FIXED v6 — Phase 1: Permission & Persistence Fix
 * ✅ saveTokenToFirestore now also sets `notificationsEnabled: true`.
 * ✅ initFCM now checks the return value of saveTokenToFirestore and returns null on failure.
 * ✅ requestPermissionAndRegister no longer prematurely sets `notificationsEnabled`.
 * ✅ The entire flow is now more robust and atomic.
 */

import { getToken, onMessage } from "firebase/messaging";
import { doc, getDoc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db, getMessagingInstance } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// ─────────────────────────────────────────────
// Internal: Token timeout guard (10 seconds max)
// ─────────────────────────────────────────────
function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("FCM getToken timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// ─────────────────────────────────────────────
// Internal: Save token to Firestore
// Atomically saves token and enables notifications preference.
// Returns boolean success status.
// ─────────────────────────────────────────────
async function saveTokenToFirestore(userId, token) {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        fcmTokens: arrayUnion(token),
        fcmUpdatedAt: serverTimestamp(),
        notificationsEnabled: true, // Set preference to true ONLY on success
      },
      { merge: true }
    );
    console.log("[FCM] Token saved and notifications enabled in Firestore");
    return true;
  } catch (err) {
    console.error("[FCM] Firestore token save failed:", err.code, err.message);
    return false;
  }
}

// ─────────────────────────────────────────────
// MAIN: initFCM
// Initializes FCM and saves token if permission is already granted.
// Does NOT request permission.
// Returns token on success, null on failure.
// ─────────────────────────────────────────────
export async function initFCM(userId) {
  try {
    if (!userId) return null;

    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("[FCM] Messaging instance unavailable");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/fcm/firebase-messaging-sw.js",
      { scope: "/fcm/" }
    );

    const token = await withTimeout(
      getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      })
    );

    if (token) {
      // CRITICAL: Check if save was successful
      const saveSuccess = await saveTokenToFirestore(userId, token);
      return saveSuccess ? token : null;
    } else {
      console.warn("[FCM] Empty token received");
      return null;
    }
  } catch (err) {
    console.error("[FCM Init Error]", err.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// USER-INITIATED PERMISSION & TOKEN REGISTRATION
// Call this from a user click event.
// Returns { success: true } or { success: false, error: ... }
// ─────────────────────────────────────────────
export async function requestPermissionAndRegister(userId) {
  try {
    if (!userId) throw new Error("User ID is required.");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission was not granted.");
    }

    // Permission granted, now get and save the token.
    // initFCM now handles the entire registration and save process.
    const token = await initFCM(userId);

    if (token) {
      console.log("[FCM] Registration and persistence successful.");
      return { success: true };
    } else {
      // This indicates a failure during getToken or Firestore save
      throw new Error("FCM token registration failed. Could not get or save the token.");
    }

  } catch (err) {
    console.error("[FCM Registration Error]", err.message);
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────
// FOREGROUND MESSAGES
// ─────────────────────────────────────────────
export async function onForegroundMessage(callback) {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return () => {};

    return onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message:", payload);
      if (typeof callback === "function") callback(payload);
    });
  } catch (err) {
    console.error("[FCM FOREGROUND ERROR]", err.message);
    return () => {};
  }
}
