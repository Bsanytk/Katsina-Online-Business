/**
 * vite.config.js — KOB Marketplace
 *
 * FIXED v3:
 * ✅ JSX in .js files — react plugin include pattern (fixes auth.js crash)
 * ✅ All /public assets confirmed present — screenshots restored
 * ✅ badge.png + apple-touch-icon.png added to includeAssets
 * ✅ All existing chunks, define, server config preserved
 */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // ✅ CRITICAL FIX — JSX in .js files
      // auth.js uses <AuthContext.Provider> JSX syntax.
      // Vite only processes JSX in .jsx by default — this caused
      // the build crash at auth.js:126:27 on Vercel.
      react({
        include: ["**/*.jsx", "**/*.js", "**/*.tsx", "**/*.ts"],
      }),

      VitePWA({
        registerType: "autoUpdate",

        // ✅ All confirmed present in /public — restored + badge + apple icon
        includeAssets: [
          "favicon.ico",
          "logo192.png",
          "logo512.png",
          "apple-touch-icon.png",
          "badge.png",
          "mobile-screenshot.png",
          "desktop-screenshot.png",
        ],

        manifest: {
          name: "Katsina Online Business",
          short_name: "KOB Marketplace",
          description:
            "KOB Marketplace - Buy and Sell Online in Katsina and beyond",
          start_url: "/",
          display: "standalone",
          orientation: "portrait",
          theme_color: "#2C1F0E",
          background_color: "#FFFFFF",

          icons: [
            {
              src: "logo192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "logo512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "any",
            },
          ],

          // ✅ Screenshots restored — files confirmed in /public
          screenshots: [
            {
              src: "mobile-screenshot.png",
              sizes: "1080x1920",
              type: "image/png",
              form_factor: "narrow",
              label: "KOB Marketplace on Mobile",
            },
            {
              src: "desktop-screenshot.png",
              sizes: "1920x1080",
              type: "image/png",
              form_factor: "wide",
              label: "KOB Marketplace on Desktop",
            },
          ],
        },
      }),
    ],

    base: "/",

    // ✅ Firebase env vars injected at build time (used by service worker)
    define: {
      __FIREBASE_API_KEY__: JSON.stringify(env.VITE_FIREBASE_API_KEY || ""),
      __FIREBASE_AUTH_DOMAIN__: JSON.stringify(
        env.VITE_FIREBASE_AUTH_DOMAIN || ""
      ),
      __FIREBASE_PROJECT_ID__: JSON.stringify(
        env.VITE_FIREBASE_PROJECT_ID || ""
      ),
      __FIREBASE_STORAGE_BUCKET__: JSON.stringify(
        env.VITE_FIREBASE_STORAGE_BUCKET || ""
      ),
      __FIREBASE_MESSAGING_SENDER_ID__: JSON.stringify(
        env.VITE_FIREBASE_MESSAGING_SENDER_ID || ""
      ),
      __FIREBASE_APP_ID__: JSON.stringify(env.VITE_FIREBASE_APP_ID || ""),
      __FIREBASE_VAPID_KEY__: JSON.stringify(
        env.VITE_FIREBASE_VAPID_KEY || ""
      ),
    },

    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-firebase": [
              "firebase/app",
              "firebase/auth",
              "firebase/firestore",
              "firebase/messaging",
            ],
            "vendor-ui": ["framer-motion", "lucide-react"],
            "vendor-charts": ["recharts"],
          },
        },
      },
    },

    server: {
      port: 5173,
    },
  };
});
