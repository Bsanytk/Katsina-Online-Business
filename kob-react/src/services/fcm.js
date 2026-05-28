/**
 * fcm.js — KOB Firebase Cloud Messaging
 * Handles push notification token + foreground messages
 */

import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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

    if (!("Notification" in window)) {
      console.warn("[FCM] Notifications not supported");
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

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("[FCM] Token generation failed");
      return null;
    }

    await setDoc(
      doc(db, "users", userId),
      {
        fcmToken: arrayUnion(token),
        fcmUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("[FCM] Token saved successfully");

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
