import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/firestore', 'chart.js']
  },
  server: {
    fs: {
      strict: false
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  }
})
