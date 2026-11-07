/**
 * KOB Firebase Messaging Service Worker
 * Production Ready — Zero Error Version
 * File: /public/firebase-messaging-sw.js
 */

// ======================================
// Firebase SDKs (Compat Version)
// ==================================
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

// ======================================
// Firebase Config — AN GYARA WANNAN SASHE
// Waɗannan masu canji suna zuwa daga tsarin ginin Vite
// ======================================
const firebaseConfig = {
  apiKey: __FIREBASE_API_KEY__,
  authDomain: __FIREBASE_AUTH_DOMAIN__,
  projectId: __FIREBASE_PROJECT_ID__,
  storageBucket: __FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
  appId: __FIREBASE_APP_ID__,
};

firebase.initializeApp(firebaseConfig);

// ======================================
// Messaging Instance
// ======================================
const messaging = firebase.messaging();

// ======================================
// Background Notifications
// ======================================
messaging.onBackgroundMessage((payload) => {
  console.log("[KOB FCM] Background message received:", payload);

  // DUPLICATE NOTIFICATION FIX:
  // If the incoming payload has a 'notification' property, we assume
  // Firebase will show a notification automatically. We return early
  // to prevent the service worker from showing a second, duplicate notification.
  if (payload.notification) {
    return;
  }

  // The rest of this function handles DATA-ONLY messages, which require
  // the service worker to create the notification manually.
  const data = payload.data || {};

  const title = data.title || "KOB Marketplace";

  const options = {
    body: data.body || "Notification from KOB Marketplace.",
    icon:
      data.icon ||
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png",
    badge:
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780056061/badge192_hlibzw.png",
    image: data.image || undefined,
    data: {
      url: data.url || "/",
    },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    renotify: true,
    tag: "kob-notification",
    actions: [
      { action: "open", title: "Buɗe KOB" },
      { action: "dismiss", title: "Kore shi" },
    ],
  };

  return self.registration.showNotification(title, options);
});

// ======================================
// Notification Click
// ======================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// ======================================
// Service Worker Lifecycles (SAFE VERSION)
// ======================================
self.addEventListener("install", () => {
  console.log("[KOB FCM] Service Worker Installed (Safe Mode)");
  // self.skipWaiting(); // REMOVED: This forces immediate activation, causing reload loops.
});

self.addEventListener("activate", (event) => {
  console.log("[KOB FCM] Service Worker Activated (Safe Mode)");
  // event.waitUntil(clients.claim()); // REMOVED: This forces control, causing reload loops.
});
