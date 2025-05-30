import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import history from 'connect-history-api-fallback'

export default defineConfig({
    server: {
        port: 5173, // 기본: 5173 → 변경 가능
        host: '0.0.0.0', // 외부 기기 접속 허용
        proxy: {
            '/api': {
                target: 'https://localhost:8081',
                changeOrigin: true,
                secure: false
            }
        },
        https: {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem'),
        },
        fs: {
            strict: false
        },
        configureServer: ({ middlewares }) => {
            middlewares.use(
                history({
                    // ✅ Vue 라우터가 처리할 경로를 index.html로 리다이렉트
                    rewrites: [
                        { from: /^\/api\/.*$/, to: context => context.parsedUrl.pathname },
                        { from: /^\/login$/, to: '/index.html' },
                        { from: /^\/mypage.*$/, to: '/index.html' },
                        { from: /./, to: '/index.html' }                  // ✅ 기본 fallback
                    ]
                })
            )
        }
    },
    plugins: [
        vue(),
        vueDevTools()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
