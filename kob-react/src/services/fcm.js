/**
 * fcm.js — KOB Firebase Cloud Messaging
 *
 * HARDENED v4:
 * ✅ Permission request is user-initiated (not automatic)
 * ✅ Firestore write is awaited and returns success/failure
 * ✅ All other hardened features from v3 preserved
 */

import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
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
// Returns boolean success status.
// ─────────────────────────────────────────────
async function saveTokenToFirestore(userId, token) {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        fcmToken: arrayUnion(token),
        fcmUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("[FCM] Token saved to Firestore");
    return true;
  } catch (err) {
    console.error("[FCM] Firestore token save failed:", err.message);
    return false;
  }
}

// ─────────────────────────────────────────────
// MAIN: initFCM
// Initializes FCM and saves token if permission is already granted.
// Does NOT request permission.
// ─────────────────────────────────────────────
export async function initFCM(userId) {
  try {
    if (!userId || Notification.permission !== "granted") {
      return null;
    }

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
      await saveTokenToFirestore(userId, token);
      return token;
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
// ─────────────────────────────────────────────
export async function requestPermissionAndRegister(userId) {
  try {
    if (!userId) throw new Error("User ID is required.");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission was not granted.");
    }

    const token = await initFCM(userId);
    if (!token) {
      throw new Error("FCM token registration failed.");
    }

    const success = await saveTokenToFirestore(userId, token);
    if (!success) {
      throw new Error("Failed to save FCM token to Firestore.");
    }

    return { success: true, token };
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
