/**
 * fcm.js — KOB Firebase Cloud Messaging
 *
 * HARDENED v3:
 * ✅ Non-blocking — never freezes login/dashboard routing
 * ✅ Mobile PWA safe — defers permission prompt correctly
 * ✅ Race condition fixed — awaits navigator.serviceWorker.ready
 * ✅ Firestore write is fire-and-forget — never blocks UI
 * ✅ Permission state check BEFORE requesting (no mobile freeze)
 * ✅ Timeout guard — getToken() won't hang indefinitely
 * ✅ Idempotent — safe to call multiple times
 * ✅ Silent fail — all errors caught, never crashes app
 */

import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db, getMessagingInstance } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// ─────────────────────────────────────────────
// Internal: Token timeout guard (10 seconds max)
// Prevents getToken() from hanging on bad networks
// ─────────────────────────────────────────────
function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("FCM getToken timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// ─────────────────────────────────────────────
// Internal: Save token to Firestore (fire-and-forget)
// Never awaited — cannot block routing
// ─────────────────────────────────────────────
function saveTokenToFirestore(userId, token) {
  setDoc(
    doc(db, "users", userId),
    {
      fcmToken: arrayUnion(token),
      fcmUpdatedAt: serverTimestamp(),
    },
    { merge: true }
  )
    .then(() => console.log("[FCM] Token saved to Firestore"))
    .catch((err) => console.warn("[FCM] Firestore token save failed:", err.message));
}

// ─────────────────────────────────────────────
// MAIN: initFCM
//
// Call this AFTER routing is complete.
// Never await this in login/auth flow.
// Always call as: initFCM(uid).catch(() => {})
// ─────────────────────────────────────────────
export async function initFCM(userId) {
  try {
    if (!userId) return null;

    // Guard: Browser support check
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.warn("[FCM] Browser does not support notifications or SW");
      return null;
    }

    // ✅ CRITICAL FIX — Mobile freeze prevention:
    // Never call requestPermission() if state is already known.
    // Only prompt if "default" (user hasn't decided yet).
    // "denied" → silent exit, never prompt again.
    const currentPermission = Notification.permission;

    if (currentPermission === "denied") {
      console.warn("[FCM] Notification permission denied by user");
      return null;
    }

    // ✅ Only request if not already granted
    if (currentPermission !== "granted") {
      // Defer permission prompt — this must be triggered by
      // a user gesture in mobile PWA (button click, etc.)
      // If called during boot without gesture, it may freeze mobile.
      // We schedule it to run after current call stack clears.
      const permission = await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const result = await Notification.requestPermission();
            resolve(result);
          } catch {
            resolve("denied");
          }
        }, 500); // small delay ensures call stack is clear
      });

      if (permission !== "granted") {
        console.warn("[FCM] Permission not granted:", permission);
        return null;
      }
    }

    // Get messaging instance
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("[FCM] Messaging instance unavailable");
      return null;
    }

    // ✅ CRITICAL FIX — Race condition prevention:
    // navigator.serviceWorker.ready waits until SW is fully active.
    // This is the correct fix for "SW in installing/waiting state" hang.
    let registration;
    try {
      // Register SW first (safe to call even if already registered)
      await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
      });
      // Wait until fully active — this resolves the race condition
      registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("SW ready timeout")), 8000)
        ),
      ]);
    } catch (swErr) {
      console.warn("[FCM] Service Worker setup failed:", swErr.message);
      return null;
    }

    if (!registration) {
      console.warn("[FCM] No active SW registration found");
      return null;
    }

    // ✅ CRITICAL FIX — getToken() timeout guard:
    // On weak networks getToken() can hang for 30+ seconds.
    // We enforce a 10-second maximum.
    let token;
    try {
      token = await withTimeout(
        getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        }),
        10000
      );
    } catch (tokenErr) {
      console.warn("[FCM] Token retrieval failed:", tokenErr.message);
      return null;
    }

    if (!token) {
      console.warn("[FCM] Empty token received");
      return null;
    }

    // Cache token locally
    try {
      localStorage.setItem("fcmToken", token);
    } catch {
      // localStorage may be unavailable in some mobile contexts
    }

    // ✅ Fire-and-forget — Firestore write NEVER blocks routing
    saveTokenToFirestore(userId, token);

    console.log("[FCM] Initialized successfully");
    return token;
  } catch (err) {
    // Silent fail — FCM failure must never crash the app
    console.error("[FCM INIT ERROR]", err.message);
    return null;
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
