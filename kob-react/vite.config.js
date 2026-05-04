import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    base: '/',

    define: {
      __FIREBASE_API_KEY__:
        JSON.stringify(env.VITE_FIREBASE_API_KEY || ''),
      __FIREBASE_AUTH_DOMAIN__:
        JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || ''),
      __FIREBASE_PROJECT_ID__:
        JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || ''),
      __FIREBASE_STORAGE_BUCKET__:
        JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || ''),
      __FIREBASE_MESSAGING_SENDER_ID__:
        JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
      __FIREBASE_APP_ID__:
        JSON.stringify(env.VITE_FIREBASE_APP_ID || ''),
      __FIREBASE_VAPID_KEY__:
        JSON.stringify(env.VITE_FIREBASE_VAPID_KEY || ''),
    },

    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/messaging'],
            'vendor-ui':       ['framer-motion', 'lucide-react'],
            'vendor-charts':   ['recharts'],
          },
        },
      },
    },

    server: {
      port: 5173,
    },
  }
})