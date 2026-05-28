/**
 * KOB Firebase Messaging Service Worker
 * Production Ready — Zero Error Version
 * File: /public/firebase-messaging-sw.js
 */

// ======================================
// Firebase SDKs
// ======================================
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// ======================================
// Firebase Config
// IMPORTANT:
// Frontend Firebase config is NOT secret.
// Safe to expose in service worker.
// ======================================
firebase.initializeApp({
  apiKey: "AIzaSyCrJDGQbbMxHkZU9fmO1jmT-1mnN3o6P6k",
  authDomain: "kob-community.firebaseapp.com",
  projectId: "kob-community",
  storageBucket: "kob-community.appspot.com",
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
  console.log(
    "[KOB FCM] Background message received:",
    payload
  );

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title =
    notification.title || "KOB Marketplace";

  const options = {
    body:
      notification.body ||
      "You have a new notification",

    icon:
      notification.icon ||
      'https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1779908958/logo512_e9kaph.png',

    badge:
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1779962074/badge_wc8kk5.png",

    image: notification.image || undefined,

    data: {
      url: data.url || "/",
    },

    vibrate: [200, 100, 200],

    requireInteraction: false,

    renotify: true,

    tag: "kob-notification",

    actions: [
      {
        action: "open",
        title: "Open KOB",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  self.registration.showNotification(
    title,
    options
  );
});

// ======================================
// Notification Click
// ======================================
self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    // Dismiss button
    if (event.action === "dismiss") {
      return;
    }

    const targetUrl =
      event.notification.data?.url || "/";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          // Focus existing tab
          for (const client of clientList) {
            if ("focus" in client) {
              client.navigate(targetUrl);
              return client.focus();
            }
          }

          // Open new tab
          if (clients.openWindow) {
            return clients.openWindow(targetUrl);
          }
        })
    );
  }
);

// ======================================
// Service Worker Install
// ======================================
self.addEventListener("install", () => {
  console.log("[KOB FCM] Service Worker Installed");
  self.skipWaiting();
});

// ======================================
// Service Worker Activate
// ======================================
self.addEventListener("activate", (event) => {
  console.log("[KOB FCM] Service Worker Activated");

  event.waitUntil(clients.claim());
});

