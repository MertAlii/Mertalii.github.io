import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages için base path (repo adı)
// Mertalii.github.io için base path boş (root domain)
// Diğer repo'lar için: '/repo-adi/'
const basePath = process.env.BASE_PATH || ''

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
