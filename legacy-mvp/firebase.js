// firebase.js
// Firebase CDN setup (GitHub Pages safe)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

// 🔐 Firebase config na KOB
const firebaseConfig = {
  apiKey: "AIzaSyCrJDGQbbMxHkZU9fmO1jmT-1mnN3o6P6k",
    authDomain: "kob-community.firebaseapp.com",
      projectId: "kob-community",
        storageBucket: "kob-community.firebasestorage.app",
          messagingSenderId: "245778888984",
            appId: "1:245778888984:web:cc819e57545b7df338066d",
              measurementId: "G-D7SGY77FPM"
              };

              // 🚀 Initialize Firebase
              const app = initializeApp(firebaseConfig);

              // 🔑 Services
              const auth = getAuth(app);
              const db = getFirestore(app);
              const analytics = getAnalytics(app);

              // 🌍 Expose globally
              window.firebaseApp = app;
              window.auth = auth;
              window.db = db;
              const storage = getStorage(app);
              window.storage = storage

              console.log("✅ KOB Firebase connected successfully");