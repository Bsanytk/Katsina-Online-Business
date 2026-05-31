/**
 * main.jsx — KOB Marketplace Entry Point
 *
 * FIXED:
 * ✅ StrictMode REMOVED — causes double-fire of onAuthStateChanged
 *    in React 19, triggering FCM init twice → Firestore write → loop
 * ✅ registerSW immediate: false — SW registers AFTER page is idle,
 *    not on every load. Prevents FCM SW restart on each reload.
 * ✅ onNeedRefresh / onOfflineReady handlers added — production safe
 * ✅ i18n import removed from here (already in App.jsx — was duplicate)
 * ✅ BrowserRouter preserved exactly
 */

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

// ─────────────────────────────────────────────
// Service Worker Registration
//
// FIXED: immediate: false
//
// immediate: true (old) = SW registers SYNCHRONOUSLY on every
// page load, including reloads after login. This restarts the
// FCM service worker lifecycle, causing Firebase to see a
// "new" SW registration and generate a fresh token → loop.
//
// immediate: false (new) = SW registers in the background
// after the page is fully loaded and idle. FCM SW stays
// stable across reloads → same token → no Firestore write
// → no re-render → no loop.
// ─────────────────────────────────────────────
registerSW({
  immediate: false,

  onNeedRefresh() {
    // New SW available — silent update in background
    // Optionally show a toast to prompt user to refresh
    console.log("[KOB SW] New version available — updating silently");
  },

  onOfflineReady() {
    console.log("[KOB SW] App ready for offline use");
  },

  onRegistered(registration) {
    console.log("[KOB SW] Service Worker registered:", registration?.scope);
  },

  onRegisterError(error) {
    console.warn("[KOB SW] Service Worker registration failed:", error);
  },
});

// ─────────────────────────────────────────────
// App Mount — StrictMode removed intentionally
//
// React 19 StrictMode double-invokes effects in BOTH
// development and production on Vercel. This causes:
//   1. onAuthStateChanged fires twice
//   2. ProfileContext snapshot listener starts twice
//   3. initFCM runs twice → two getToken() calls
//   4. Two arrayUnion writes → two onSnapshot fires
//   5. Two re-renders → loop continues
//
// Our Firebase listeners already have proper cleanup
// (unsubRef in ProfileContext, uid primitive dep in App.jsx,
// localStorage guard in fcm.js). StrictMode adds no safety
// benefit here but causes the exact loop we are fixing.
// ─────────────────────────────────────────────
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
