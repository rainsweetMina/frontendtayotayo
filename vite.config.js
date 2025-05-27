import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'

export default defineConfig({
  server: {
    port: 5173,          // 기본: 5173 → 변경 가능
    host: '0.0.0.0',      // 외부 기기 접속 허용
    proxy: {
      '/api': {
        target: 'https://localhost:8081',  // 백엔드 주소
        changeOrigin: true,
        secure: false,
      }
    },
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }


})
