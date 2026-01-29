import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build'
  },
  define: {
    // Shim Node-style process/env so browser bundle doesn't crash
    'process.env': {},
    'process': { env: {} }
  }
})
