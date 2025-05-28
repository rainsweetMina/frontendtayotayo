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
                target: 'https://docs.yi.or.kr:8094',
                changeOrigin: true,
                secure: false,
            },
            '/login': {
                target: 'https://localhost:8081', // 스프링 서버 주소
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
                    rewrites: [
                        { from: /^\/api\/.*$/, to: (context) => context.parsedUrl.pathname },
                        { from: /^\/login$/, to: '/index.html' }
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
