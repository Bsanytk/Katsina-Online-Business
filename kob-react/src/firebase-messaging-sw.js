/**
 * KOB Firebase Messaging Service Worker
 * Production Ready — Zero Error Version
 *
 * CHANGE: Added IndexedDB caching for background messages.
 * Background messages cannot be written to Firestore directly due to security
 * rules. This worker now saves them to a local IndexedDB. The main app
 * will sync them to Firestore upon startup.
 */

// =====================================
// Firebase SDKs (Compat Version)
// ==================================
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

// =====================================
// IndexedDB Logic for Offline Caching
// =====================================
const DB_NAME = "fcm-pending-notifications";
const STORE_NAME = "pending_notifications";
const DB_VERSION = 1;

let dbPromise = null;
const getDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "messageId" });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
  return dbPromise;
};

const saveNotificationToDB = async (notification) => {
  try {
    const db = await getDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(notification);
    await new Promise(resolve => tx.oncomplete = resolve);
    console.log("[KOB FCM] Background notification saved to IndexedDB.");
  } catch (error) {
    console.error("[KOB FCM] Failed to save notification to IndexedDB:", error);
  }
};


// =====================================
// Firebase Config (Injected by Vite)
// =====================================
const firebaseConfig = {
  apiKey: __FIREBASE_API_KEY__,
  authDomain: __FIREBASE_AUTH_DOMAIN__,
  projectId: __FIREBASE_PROJECT_ID__,
  storageBucket: __FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
  appId: __FIREBASE_APP_ID__,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// =====================================
// Background Notifications Handler
// =====================================
messaging.onBackgroundMessage(async (payload) => {
  console.log("[KOB FCM] Background message received:", payload);

  const notificationData = {
    title: payload.notification?.title || payload.data?.title || "KOB Marketplace",
    body: payload.notification?.body || payload.data?.body || "",
    url: payload.data?.url || "/alerts",
    type: payload.data?.type || "direct",
    source: "fcm-background",
    read: false,
    createdAt: new Date().toISOString(), // Use ISO string for IndexedDB
    messageId: payload.messageId || `offline-${Date.now()}`,
  };

  // Persist to IndexedDB for the app to sync later
  await saveNotificationToDB(notificationData);

  // Define the notification to be shown
  const notificationTitle = notificationData.title;
  const notificationOptions = {
    body: notificationData.body,
    icon:
      payload.notification?.icon ||
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png",
    badge:
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780056061/badge192_hlibzw.png",
    image: payload.data?.image || undefined,
    data: {
      url: notificationData.url,
    },
    vibrate: [200, 100, 200],
    tag: "kob-notification",
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// =====================================
// Notification Click Handler
// =====================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// =====================================
// Service Worker Lifecycles
// =====================================
self.addEventListener("install", () => {
  console.log("[KOB FCM] Service Worker Installed");
});

self.addEventListener("activate", (event) => {
  console.log("[KOB FCM] Service Worker Activated");
});