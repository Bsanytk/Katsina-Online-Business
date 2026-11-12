/**
 * fcm.js — KOB Firebase Cloud Messaging
 *
 * SURGICAL FIX v2 — FCM Initialization Regression
 * ✅ Restored permission and preference guards to the main initFCM function.
 * ✅ Automatic initialization (in App.jsx) will now correctly do nothing if permission isn't granted or if the user has opted out.
 * ✅ User-initiated registration (in NotificationSettings) remains the explicit path to request permission.
 * ✅ All other hardened features from Phase 1 are preserved.
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
// MAIN: initFCM (Automatic Initialization)
// Called on app load. Initializes FCM and saves token only if:
// 1. Browser permission is ALREADY granted.
// 2. User has NOT explicitly disabled notifications in their profile.
// Does NOT request permission.
// ─────────────────────────────────────────────
export async function initFCM(userId) {
  try {
    if (!userId) return null;

    // 1. PRE-CONDITION: Check user's notification preference in Firestore first.
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists() && userDoc.data().notificationsEnabled === false) {
      console.log("[FCM] Notifications are disabled by user preference. Aborting auto-init.");
      return null;
    }

    // 2. PRE-CONDITION: Check browser permission without prompting.
    if (Notification.permission !== "granted") {
      console.log("[FCM] Notification permission not yet granted. Aborting auto-init.");
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

    // Permission has been granted. Now, get and save the token.
    // We create a "clean" instance of the registration logic here,
    // bypassing the preference checks in the main initFCM.
    const messaging = await getMessagingInstance();
    if (!messaging) throw new Error("Messaging instance unavailable.");

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
      const saveSuccess = await saveTokenToFirestore(userId, token);
      if (saveSuccess) {
        console.log("[FCM] User-initiated registration and persistence successful.");
        return { success: true };
      } else {
        throw new Error("Firestore save failed after getting token.");
      }
    } else {
      throw new Error("FCM token registration failed. Empty token received.");
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
