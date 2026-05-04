importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey:            typeof __FIREBASE_API_KEY__ !== 'undefined'
    ? __FIREBASE_API_KEY__ : '',
  authDomain:        typeof __FIREBASE_AUTH_DOMAIN__ !== 'undefined'
    ? __FIREBASE_AUTH_DOMAIN__ : '',
  projectId:         typeof __FIREBASE_PROJECT_ID__ !== 'undefined'
    ? __FIREBASE_PROJECT_ID__ : '',
  storageBucket:     typeof __FIREBASE_STORAGE_BUCKET__ !== 'undefined'
    ? __FIREBASE_STORAGE_BUCKET__ : '',
  messagingSenderId: typeof __FIREBASE_MESSAGING_SENDER_ID__ !== 'undefined'
    ? __FIREBASE_MESSAGING_SENDER_ID__ : '',
  appId:             typeof __FIREBASE_APP_ID__ !== 'undefined'
    ? __FIREBASE_APP_ID__ : '',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const {
    title = 'KOB Marketplace',
    body  = 'You have a new notification',
    icon,
  } = payload.notification || {}

  self.registration.showNotification(title, {
    body,
    icon: icon ||
      'https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png',
    badge:   '/badge.png',
    data:    payload.data || {},
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open',    title: 'Open KOB' },
      { action: 'dismiss', title: 'Dismiss'  },
    ],
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'dismiss') return
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({
      type:                'window',
      includeUncontrolled: true,
    }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

self.addEventListener('install',   () => self.skipWaiting())
self.addEventListener('activate',  (e) => e.waitUntil(clients.claim()))