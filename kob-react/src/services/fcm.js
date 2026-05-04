/**
 * fcm.js — KOB Firebase Cloud Messaging
 * Handles push notification token + foreground messages
 */

import { getToken, onMessage }       from 'firebase/messaging'
import { doc, updateDoc }            from 'firebase/firestore'
import { db, getMessagingInstance }  from '../firebase/firebase'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

// ================================
// Init FCM — request permission + get token
// ================================
export async function initFCM(userId) {
  try {
    // Check browser support
    if (!('Notification' in window)) return null

    // Request notification permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.log('[FCM] Permission denied')
      return null
    }

    // Get messaging instance
    const messaging = await getMessagingInstance()
    if (!messaging) return null

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    )

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey:                  VAPID_KEY,
      serviceWorkerRegistration: registration,
    })

    // Save token to Firestore
    if (token && userId) {
      await updateDoc(doc(db, 'users', userId), {
        fcmToken:     token,
        fcmUpdatedAt: new Date().toISOString(),
      })
      if (import.meta.env.DEV) {
        console.log('[FCM] Token saved:', token.slice(0, 20) + '...')
      }
    }

    return token

  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[FCM] Init error:', err)
    }
    return null
  }
}

// ================================
// Listen for foreground messages
// ================================
export async function onForegroundMessage(callback) {
  try {
    const messaging = await getMessagingInstance()
    if (!messaging) return () => {}
    return onMessage(messaging, (payload) => {
      if (import.meta.env.DEV) {
        console.log('[FCM] Foreground:', payload)
      }
      callback(payload)
    })
  } catch {
    return () => {}
  }
}