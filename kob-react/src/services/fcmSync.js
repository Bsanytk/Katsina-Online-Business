/**
 * fcmSync.js — KOB Firebase Cloud Messaging Sync
 *
 * This module handles syncing data cached by the service worker (in IndexedDB)
 * with Firestore.
 *
 * It syncs:
 * 1. Pending notifications received while the app was in the background.
 * 2. Pending "Mark as Read" actions triggered from a notification.
 */

import { db } from "../firebase/firebase";
import { collection, writeBatch, doc, serverTimestamp, runTransaction } from "firebase/firestore";

// =====================================
// IndexedDB Configuration
// =====================================
const DB_NAME = "fcm-cache";
const PENDING_NOTIFICATIONS_STORE = "pending_notifications";
const PENDING_ACTIONS_STORE = "pending_actions";
const DB_VERSION = 2;

// =====================================
// Internal: IndexedDB Access Functions
// =====================================
const getDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // onupgradeneeded is handled by the service worker
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const getAllFromStore = async (storeName) => {
  const db = await getDb();
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]); // Return empty on error
  });
};

const deleteFromStore = async (storeName, id) => {
    const db = await getDb();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.delete(id);
};

const clearStore = async (storeName) => {
    const db = await getDb();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
};

// =====================================
// MAIN: Sync Logic
// =====================================

/**
 * Syncs pending background notifications from IndexedDB to Firestore.
 */
const syncPendingNotifications = async (userId) => {
  const pendingNotifications = await getAllFromStore(PENDING_NOTIFICATIONS_STORE);
  if (pendingNotifications.length === 0) return;

  console.log(`[FCM Sync] Found ${pendingNotifications.length} pending notifications to process.`);

  for (const notif of pendingNotifications) {
      if (!notif.messageId) {
          console.error("[FCM Sync] Found a pending notification with no messageId. Skipping, but not deleting.", notif);
          continue;
      }

      const docRef = doc(db, `users/${userId}/notifications`, notif.messageId);
      try {
          await runTransaction(db, async (transaction) => {
              const docSnap = await transaction.get(docRef);
              if (!docSnap.exists()) {
                  // Document doesn't exist, create it. This is checked against 'allow create'.
                  const newNotifData = {
                      ...notif,
                      createdAt: notif.createdAt ? new Date(notif.createdAt) : serverTimestamp(),
                  };
                  transaction.set(docRef, newNotifData);
              }
              // If docSnap exists, do nothing. The notification is already synced.
          });

          // If transaction succeeds (or did nothing), remove from IndexedDB.
          await deleteFromStore(PENDING_NOTIFICATIONS_STORE, notif.messageId);

      } catch (error) {
          // If transaction fails (e.g. network offline), log it.
          // The notification will remain in IndexedDB for the next sync attempt.
          console.error(`[FCM Sync] Failed to sync notification ${notif.messageId}. It will be retried later.`, error);
      }
  }
};


/**
 * Syncs pending 'mark-as-read' actions from IndexedDB to Firestore.
 */
const syncPendingActions = async (userId) => {
    const pendingActions = await getAllFromStore(PENDING_ACTIONS_STORE);
    if (pendingActions.length === 0) return;

    console.log(`[FCM Sync] Found ${pendingActions.length} pending actions to sync.`);

    const batch = writeBatch(db);

    pendingActions.forEach(action => {
        if (action.type === 'mark-as-read' && action.messageId) {
            const docRef = doc(db, `users/${userId}/notifications/${action.messageId}`);
            batch.update(docRef, { read: true, readAt: serverTimestamp() });
        }
    });

    try {
        await batch.commit();
        console.log("[FCM Sync] Successfully synced pending actions to Firestore.");
        await clearStore(PENDING_ACTIONS_STORE);
        console.log("[FCM Sync] Cleared synced actions from IndexedDB.");
    } catch (error) {
        console.error("[FCM Sync] Error syncing pending actions:", error);
    }
}

/**
 * The main entry point to run all sync processes.
 */
export const runSync = async (userId) => {
    if (!userId) return;
    console.log("[FCM Sync] Running sync process for user:", userId);
    await syncPendingNotifications(userId);
    await syncPendingActions(userId);
};
