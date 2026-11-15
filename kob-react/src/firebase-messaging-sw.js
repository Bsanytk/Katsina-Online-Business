
/**
 * KOB Firebase Messaging Service Worker
 *
 * Firebase SDK: 10.14.1
 *
 * Features:
 * - Firebase background notification handling
 * - Best-effort replacement of Firebase automatic notification
 * - KOB custom notification with Open and Mark as Read actions
 * - IndexedDB offline notification caching
 * - IndexedDB pending action queue
 */


// =====================================
// KOB Custom Notification Click Handler
// Register BEFORE Firebase Messaging SDK
// =====================================

self.addEventListener("notificationclick", (event) => {
  const notificationData = event.notification.data || {};

  // Handle only notifications created by KOB.
  if (notificationData.source !== "kob-fcm") {
    return;
  }

  event.stopImmediatePropagation();
  event.notification.close();

  const messageId = notificationData.messageId;
  const rawTargetUrl = notificationData.url || "/alerts";

  // Only allow URLs belonging to this KOB website.
  let targetUrl;

  try {
    targetUrl = new URL(rawTargetUrl, self.location.origin);

    if (targetUrl.origin !== self.location.origin) {
      targetUrl = new URL("/alerts", self.location.origin);
    }
  } catch (error) {
    targetUrl = new URL("/alerts", self.location.origin);
  }

  // -----------------------------------
  // MARK AS READ ACTION
  // -----------------------------------

  if (event.action === "mark-as-read") {
    event.waitUntil(
      (async () => {
        const clientList = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        // Select an existing KOB tab only.
        const kobClients = clientList.filter((client) => {
          try {
            return new URL(client.url).origin === self.location.origin;
          } catch {
            return false;
          }
        });

        const targetClient =
          kobClients.find((client) => client.focused) ||
          kobClients[0];

        const message = {
          type: "MARK_AS_READ",
          messageId,
        };

        if (targetClient) {
          await targetClient.focus();
          targetClient.postMessage(message);
        } else {
          await saveActionToDB({
            type: "mark-as-read",
            messageId,
          });
        }
      })()
    );

    return;
  }

  // -----------------------------------
  // OPEN NOTIFICATION ACTION
  // -----------------------------------

  event.waitUntil(
    (async () => {
      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      const kobClients = clientList.filter((client) => {
        try {
          return new URL(client.url).origin === self.location.origin;
        } catch {
          return false;
        }
      });

      const targetClient =
        kobClients.find((client) => client.focused) ||
        kobClients[0];

      if (targetClient) {
        await targetClient.focus();

        const currentUrl = new URL(targetClient.url);

        if (currentUrl.href !== targetUrl.href) {
          await targetClient.navigate(targetUrl.href);
        }

        return;
      }

      await clients.openWindow(targetUrl.href);
    })()
  );
});


// =====================================
// Firebase SDKs (Compat Version)
// =====================================

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);


// =====================================
// IndexedDB Logic
// =====================================

const DB_NAME = "fcm-cache";

const PENDING_NOTIFICATIONS_STORE = "pending_notifications";

const PENDING_ACTIONS_STORE = "pending_actions";

const DB_VERSION = 3;

let dbPromise = null;


const getDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(PENDING_NOTIFICATIONS_STORE)) {
          db.createObjectStore(
            PENDING_NOTIFICATIONS_STORE,
            { keyPath: "messageId" }
          );
        }

        if (!db.objectStoreNames.contains(PENDING_ACTIONS_STORE)) {
          db.createObjectStore(
            PENDING_ACTIONS_STORE,
            { autoIncrement: true }
          );
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        db.onversionchange = () => {
          db.close();
          dbPromise = null;
        };

        resolve(db);
      };

      request.onerror = (event) => {
        dbPromise = null;
        reject(event.target.error);
      };

      request.onblocked = () => {
        console.warn(
          "[KOB FCM] IndexedDB upgrade is blocked by another connection."
        );
      };
    });
  }

  return dbPromise;
};


// =====================================
// Save Background Notification
// =====================================

const saveNotificationToDB = async (notification) => {
  try {
    const db = await getDb();

    await new Promise((resolve, reject) => {
      const tx = db.transaction(
        PENDING_NOTIFICATIONS_STORE,
        "readwrite"
      );

      const store = tx.objectStore(PENDING_NOTIFICATIONS_STORE);

      store.put(notification);

      tx.oncomplete = () => resolve();

      tx.onerror = () => {
        reject(tx.error || new Error("Notification transaction failed"));
      };

      tx.onabort = () => {
        reject(tx.error || new Error("Notification transaction aborted"));
      };
    });

    console.log(
      "[KOB FCM] Background notification saved to IndexedDB."
    );

  } catch (error) {
    console.error(
      "[KOB FCM] Failed to save notification to IndexedDB:",
      error
    );
  }
};


// =====================================
// Save Pending Notification Action
// =====================================

const saveActionToDB = async (action) => {
  try {
    const db = await getDb();

    await new Promise((resolve, reject) => {
      const tx = db.transaction(
        PENDING_ACTIONS_STORE,
        "readwrite"
      );

      const store = tx.objectStore(PENDING_ACTIONS_STORE);

      store.put(action);

      tx.oncomplete = () => resolve();

      tx.onerror = () => {
        reject(tx.error || new Error("Action transaction failed"));
      };

      tx.onabort = () => {
        reject(tx.error || new Error("Action transaction aborted"));
      };
    });

    console.log("[KOB FCM] Pending action saved to IndexedDB.");

  } catch (error) {
    console.error(
      "[KOB FCM] Failed to save pending action:",
      error
    );
  }
};


// =====================================
// Firebase Configuration
// Injected by Vite
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
  console.log(
    "[KOB FCM] Background message received:",
    payload
  );

  const notificationData = {
    title:
      payload.notification?.title ||
      payload.data?.title ||
      "KOB Marketplace",

    body:
      payload.notification?.body ||
      payload.data?.body ||
      "",

    url: payload.data?.url || "/alerts",

    type: payload.data?.type || "direct",

    source: "fcm-background",

    read: false,

    createdAt: new Date().toISOString(),

    messageId:
      payload.messageId ||
      `offline-${Date.now()}`,
  };


  // -----------------------------------
  // STEP 1: Save notification locally
  // -----------------------------------

  await saveNotificationToDB(notificationData);


  // -----------------------------------
  // STEP 2: Replace Firebase notification
  // -----------------------------------

  if (payload.notification) {
    const messageId = payload.messageId;

    try {
      const existingNotifications =
        await self.registration.getNotifications();

      const firebaseNotification = existingNotifications.find(
        (notification) =>
          notification.data?.FCM_MSG?.messageId === messageId
      );

      if (firebaseNotification) {
        firebaseNotification.close();

        console.log(
          "[KOB FCM] Firebase automatic notification closed."
        );

      } else {
        console.warn(
          "[KOB FCM] Firebase automatic notification was not found. Continuing with KOB notification to avoid losing the message.",
          messageId
        );
      }

    } catch (error) {
      console.error(
        "[KOB FCM] Could not inspect Firebase notifications. Continuing with KOB notification:",
        error
      );
    }
  }


  // -----------------------------------
  // STEP 3: Display KOB custom notification
  // -----------------------------------

  const notificationTitle = notificationData.title;

  const notificationOptions = {
    body: notificationData.body,

    icon:
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png",

    badge:
      "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1794749673/file_00000000b6bc81f486d15d7b097f9202_l3ypg9.png",

    data: {
      source: "kob-fcm",

      url: notificationData.url,

      messageId: notificationData.messageId,
    },

    vibrate: [200, 100, 200],

    tag: `kob-notification-${notificationData.messageId}`,

    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "mark-as-read",
        title: "Mark as Read",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});


// =====================================
// Service Worker Lifecycles
// =====================================

self.addEventListener("install", () => {
  console.log("[KOB FCM] Service Worker Installed.");
});

self.addEventListener("activate", (event) => {
  console.log("[KOB FCM] Service Worker Activated.");

  event.waitUntil(clients.claim());
});
                              
