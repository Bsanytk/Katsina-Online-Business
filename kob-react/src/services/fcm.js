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

    // AN GYARA: Muna duba idan akwai service worker da aka riga aka yi rajista, don gudun sake yin ta akai-akai
    let registration;
    const regs = await navigator.serviceWorker.getRegistrations();
    const existingReg = regs.find((r) => r.active && r.active.scriptURL.includes("firebase-messaging-sw.js"));

    if (existingReg) {
      registration = existingReg;
    } else {
      registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    }

    // Dauko token daga Firebase
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("[FCM] Token generation failed");
      return null;
    }

    // AN GYARA (Babban Amfani): Adana token din a localStorage domin ka daina samun null a Console
    localStorage.setItem("fcmToken", token);

    // Adana token din a Firestore
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
