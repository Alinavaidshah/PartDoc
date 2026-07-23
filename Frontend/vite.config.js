// Frontend/vite.config.js mein ye ho:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Tumhara backend ka port
        changeOrigin: true,
      }
    }
  }
})