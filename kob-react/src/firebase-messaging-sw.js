/**
 * KOB Firebase Messaging Service Worker
 * Production Ready — Zero Error Version
 *
 * CHANGE: Added IndexedDB caching for background messages.
 * Background messages cannot be written to Firestore directly due to security
 * rules. This worker now saves them to a local IndexedDB. The main app
 * will sync them to Firestore upon startup.
 *
 * CHANGE v2: Added Notification Actions and Pending Action Queue.
 * - Displays "Open" and "Mark as Read" buttons on notifications.
 * - Handles "Mark as Read" by posting a message to an active client.
 * - If no client is active, queues the action in IndexedDB for later sync.
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
const DB_NAME = "fcm-cache";
const PENDING_NOTIFICATIONS_STORE = "pending_notifications";
const PENDING_ACTIONS_STORE = "pending_actions";
const DB_VERSION = 2; // Incremented to add new store

let dbPromise = null;
const getDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(PENDING_NOTIFICATIONS_STORE)) {
          db.createObjectStore(PENDING_NOTIFICATIONS_STORE, { keyPath: "messageId" });
        }
        if (!db.objectStoreNames.contains(PENDING_ACTIONS_STORE)) {
           db.createObjectStore(PENDING_ACTIONS_STORE, { autoIncrement: true });
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
    const tx = db.transaction(PENDING_NOTIFICATIONS_STORE, "readwrite");
    const store = tx.objectStore(PENDING_NOTIFICATIONS_STORE);
    await store.put(notification);
    console.log("[KOB FCM] Background notification saved to IndexedDB.");
  } catch (error) {
    console.error("[KOB FCM] Failed to save notification to IndexedDB:", error);
  }
};

const saveActionToDB = async (action) => {
    try {
        const db = await getDb();
        const tx = db.transaction(PENDING_ACTIONS_STORE, "readwrite");
        const store = tx.objectStore(PENDING_ACTIONS_STORE);
        await store.put(action);
        console.log("[KOB FCM] Pending action saved to IndexedDB.");
    } catch (error) {
        console.error("[KOB FCM] Failed to save pending action:", error);
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
    createdAt: new Date().toISOString(),
    messageId: payload.messageId || `offline-${Date.now()}`,
  };

  // Persist to IndexedDB for the app to sync later
  await saveNotificationToDB(notificationData);

  const notificationTitle = notificationData.title;
  const notificationOptions = {
    body: notificationData.body,
    icon: "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png",
    badge: "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780056061/badge192_hlibzw.png",
    image: payload.data?.image || undefined,
    data: {
      url: notificationData.url,
      messageId: notificationData.messageId,
    },
    vibrate: [200, 100, 200],
    tag: "kob-notification",
    actions: [
        { action: "open", title: "Open" },
        { action: "mark-as-read", title: "Mark as Read" }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// =====================================
// Notification Click Handler
// =====================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const messageId = event.notification.data?.messageId;
  const targetUrl = event.notification.data?.url || "/alerts";

  if (event.action === 'mark-as-read') {
    console.log('[KOB FCM] "Mark as Read" action clicked for:', messageId);
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            const message = { type: 'MARK_AS_READ', messageId };
            if (clientList.length > 0) {
                // If a client is open, post message to it
                clientList[0].postMessage(message);
            } else {
                // Otherwise, queue the action in IndexedDB
                return saveActionToDB({ type: 'mark-as-read', messageId: messageId });
            }
        })
    );
  } else {
    // Default action is to "open"
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (new URL(client.url).pathname === targetUrl && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
  }
});

// =====================================
// Service Worker Lifecycles
// =====================================
self.addEventListener("install", () => {
  console.log("[KOB FCM] Service Worker Installed (v2)");
});

self.addEventListener("activate", (event) => {
  console.log("[KOB FCM] Service Worker Activated (v2)");
  // Take control of any open pages immediately
  event.waitUntil(clients.claim());
});