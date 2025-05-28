import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import history from 'connect-history-api-fallback'

export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://docs.yi.or.kr:8094',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      strict: false
    },
    configureServer: ({ middlewares }) => {
      middlewares.use(
          history({
            rewrites: [
              { from: /^\/api\/.*$/, to: (context) => context.parsedUrl.pathname },
              { from: /^\/login$/, to: '/index.html' } // ✅ fallback 방지 (선택)
            ]
          })
      )
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
