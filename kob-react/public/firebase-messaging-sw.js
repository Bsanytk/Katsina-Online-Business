/**

* KOB Firebase Messaging Service Worker
* Handles background push notifications
  */

// Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

/**

* Firebase Config (Production-ready)
* Uses environment fallback OR injected values
  */
  const firebaseConfig = {
  apiKey: self.FIREBASE_API_KEY || "AIzaSyCrJDGQbbMxHkZU9fmO1jmT-1mnN3o6P6k",
  authDomain: self.FIREBASE_AUTH_DOMAIN || "kob-community.firebaseapp.com",
  projectId: self.FIREBASE_PROJECT_ID || "kob-community",
  storageBucket: self.FIREBASE_STORAGE_BUCKET || "kob-community.firebasestorage.app",
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || "245778888984",
  appId: self.FIREBASE_APP_ID || "1:245778888984:web:cc819e57545b7df338066d",
  measurementId: self.FIREBASE_MEASUREMENT_ID || "G-D7SGY77FPM"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Messaging instance
const messaging = firebase.messaging();

/**

* Background Notification Handler
  */
  messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};

const title = notification.title || "KOB Marketplace";
const body = notification.body || "You have a new notification";

self.registration.showNotification(title, {
body,
icon: notification.icon ||
"https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png",
badge: "/badge.png",
data: payload.data || {},
vibrate: [200, 100, 200],
actions: [
{ action: "open", title: "Open KOB" },
{ action: "dismiss", title: "Dismiss" }
]
});
});

/**

* Notification Click Handler
  */
  self.addEventListener("notificationclick", (event) => {
  event.notification.close();

if (event.action === "dismiss") return;

const url = event.notification.data?.url || "/";

event.waitUntil(
clients.matchAll({ type: "window", includeUncontrolled: true })
.then((clientList) => {
for (const client of clientList) {
if (client.url === url && "focus" in client) {
return client.focus();
}
}
if (clients.openWindow) return clients.openWindow(url);
})
);
});

/**

* Service Worker Lifecycle
  */
  self.addEventListener("install", () => {
  self.skipWaiting();
  });

self.addEventListener("activate", (event) => {
event.waitUntil(clients.claim());
});
