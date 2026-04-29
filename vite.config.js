import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/algerietelecom/',   // ⬅️ أضفت هذا السطر (مهم جداً لـ GitHub Pages)
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'pang-contusion-zoologist.ngrok-free.dev',
      '.ngrok-free.dev',
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/images': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})