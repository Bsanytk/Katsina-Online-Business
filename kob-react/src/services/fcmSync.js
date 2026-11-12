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
import { collection, writeBatch, doc, serverTimestamp, setDoc } from "firebase/firestore";

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

  console.log(`[FCM Sync] Found ${pendingNotifications.length} pending notifications to sync.`);

  const batch = writeBatch(db);
  const userNotificationsRef = collection(db, `users/${userId}/notifications`);

  pendingNotifications.forEach(notif => {
    if (notif.messageId) {
        const docRef = doc(userNotificationsRef, notif.messageId);
        batch.set(docRef, {
            ...notif,
            createdAt: notif.createdAt ? new Date(notif.createdAt) : serverTimestamp(),
        }, { merge: true });
    }
  });

  try {
    await batch.commit();
    console.log("[FCM Sync] Successfully synced notifications to Firestore.");
    // Clear the store only after successful commit
    await clearStore(PENDING_NOTIFICATIONS_STORE);
    console.log("[FCM Sync] Cleared synced notifications from IndexedDB.");
  } catch (error) {
    console.error("[FCM Sync] Error syncing notifications:", error);
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