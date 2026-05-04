// Firebase Cloud Messaging Service Worker
// Handles background push notifications

importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const { title, body, icon } = payload.notification || {};

  self.registration.showNotification(title || "KOB Marketplace", {
    body: body || "You have a new notification",
    icon:
      icon ||
      "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png",
    badge: "/badge.png",
    data: payload.data,
  });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
