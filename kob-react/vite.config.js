import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve at root in production (Vercel expects app at /)
  base: '/',
})