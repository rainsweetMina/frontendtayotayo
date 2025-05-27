import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
