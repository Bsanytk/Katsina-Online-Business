/**
 * fcmSync.js — KOB Firebase Cloud Messaging Sync
 *
 * This module is responsible for syncing notifications that were received
 * while the app was in the background and cached in IndexedDB by the
 * service worker.
 *
 * It is called once upon application startup.
 */

import { db } from "../firebase/firebase";
import { collection, writeBatch, doc, serverTimestamp } from "firebase/firestore";

// =====================================
// IndexedDB Configuration
// =====================================
const DB_NAME = "fcm-pending-notifications";
const STORE_NAME = "pending_notifications";
const DB_VERSION = 1;

// =====================================
// Internal: IndexedDB Access Functions
// =====================================
const getDb = () => {
  return new Promise((resolve, reject) => {
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
};

const getAllNotificationsFromDB = async () => {
  const db = await getDb();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]); // Return empty on error
  });
};

const clearNotificationsFromDB = async (messageIds) => {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  messageIds.forEach(id => store.delete(id));
  return new Promise(resolve => tx.oncomplete = resolve);
};

// =====================================
// MAIN: Sync with Firestore
// =====================================
export const syncPendingNotifications = async (userId) => {
  if (!userId) return;

  const pendingNotifications = await getAllNotificationsFromDB();
  if (pendingNotifications.length === 0) {
    return; // Nothing to sync
  }

  console.log(`[FCM Sync] Found ${pendingNotifications.length} pending notifications to sync.`);

  const batch = writeBatch(db);
  const userNotificationsRef = collection(db, `users/${userId}/notifications`);
  const syncedMessageIds = [];

  pendingNotifications.forEach(notif => {
    const docRef = doc(userNotificationsRef, notif.messageId);
    batch.set(docRef, {
        ...notif,
        createdAt: serverTimestamp(), // Use server time when syncing
    }, { merge: true }); // Use merge to avoid duplicates
    syncedMessageIds.push(notif.messageId);
  });

  try {
    await batch.commit();
    console.log("[FCM Sync] Successfully synced notifications to Firestore.");
    await clearNotificationsFromDB(syncedMessageIds);
    console.log("[FCM Sync] Cleared synced notifications from IndexedDB.");
  } catch (error) {
    console.error("[FCM Sync] Error syncing notifications:", error);
  }
};
