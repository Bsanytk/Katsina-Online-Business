/**
 * KOB Firebase Messaging Service Worker
 * Production Ready — Zero Error Version
 * File: /public/firebase-messaging-sw.js
 */

// ======================================
// Firebase SDKs (Compat Version)
// ======================================
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// ======================================
// Firebase Config — AN GYARA WANNAN SASHE
// Dole ne ya yi daidai daram da bayanan da ke cikin .env na dandalinka
// ======================================
firebase.initializeApp({
  apiKey: "AIzaSyCrJDGQbbMxHkZU9fmO1jmT-1mnN3o6P6k", // Tabbatar wannan shi ne na KOB Marketplace
  authDomain: "kob-marketplace.firebaseapp.com",     // Idan ka canza domain, sanya madaidacin a nan
  projectId: "kob-marketplace",                     // Sunan sabon project dinka
  storageBucket: "kob-marketplace.appspot.com",
  messagingSenderId: "245778888984",
  appId: "1:245778888984:web:cc819e57545b7df338066d",
});

// ======================================
// Messaging Instance
// ======================================
const messaging = firebase.messaging();

// ======================================
// Background Notifications
// ======================================
messaging.onBackgroundMessage((payload) => {
  console.log("[KOB FCM] Background message received:", payload);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || "KOB Marketplace";

  const options = {
    body: notification.body || "Notificatin from KOB Marketplace.",
    icon: notification.icon || 'https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png',
    badge: "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780056061/badge192_hlibzw.png",
    image: notification.image || undefined,
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

  self.registration.showNotification(title, options);
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