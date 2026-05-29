/**
 * fcm.js — KOB Firebase Cloud Messaging
 * Handles push notification token + foreground messages
 */

import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db, getMessagingInstance } from "../firebase/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// ================================
// INIT FCM
// ================================
export async function initFCM(userId) {
  try {
    if (!userId) {
      console.warn("[FCM] No userId provided");
      return null;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.warn("[FCM] Notifications or Service Workers not supported by this browser");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("[FCM] Permission not granted");
      return null;
    }

    const messaging = await getMessagingInstance();

    if (!messaging) {
      console.warn("[FCM] Messaging not available");
      return null;
    }

    // Register the Service Worker safely
    console.log("[FCM] Registering KOB messaging service worker...");
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    
    // Explicitly wait until the registration is fully active to avoid infinite pending states
    const registration = await navigator.serviceWorker.ready;

    if (!registration) {
      console.warn("[FCM] Active Service Worker registration could not be verified");
      return null;
    }

    // Retrieve token safely from Firebase Messaging backend
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("[FCM] Token generation failed or returned empty");
      return null;
    }

    // Save token locally to preserve state across re-renders
    localStorage.setItem("fcmToken", token);

    // Persist token structure inside Firestore users collection
    await setDoc(
      doc(db, "users", userId),
      {
        fcmToken: arrayUnion(token),
        fcmUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("[FCM] Token saved successfully to Firestore & localStorage");

    return token;
  } catch (err) {
    console.error("[FCM INIT ERROR]", err);
    return null;
  }
}

// ================================
// FOREGROUND MESSAGES
// ================================
export async function onForegroundMessage(callback) {
  try {
    const messaging = await getMessagingInstance();

    if (!messaging) {
      console.warn("[FCM] Messaging not available");
      return () => {};
    }

    return onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message:", payload);
      if (callback) callback(payload);
    });
  } catch (err) {
    console.error("[FCM FOREGROUND ERROR]", err);
    return () => {};
  }
}
