import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import history from 'connect-history-api-fallback'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'


export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        // basicSsl() // ✅ HTTPS 인증서 적용 (개발 환경에서 자체 서명 인증서 사용)
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            global: 'globalThis'
        }
    },
    define: {
        'process.env': {},
        global: 'globalThis'
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            plugins: [nodePolyfills()],
            output: {
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router'],
                    'board-modules': [
                        '@/modules/board/busSchedule/views/BusSchedulePage.vue',
                        '@/modules/board/busSchedule/views/LowBusSchedulePage.vue'
                    ]
                }
            }
        }
    },
    server: {
        port: 5173,
        host: '0.0.0.0',
        open: false,
        https: {
            key: fs.readFileSync('./localhost+2-key.pem'),
            cert: fs.readFileSync('./localhost+2.pem')
        },
        cors: true,
        fs: {
            strict: false,
            allow: ['..']
        },
        hmr: {
            port: 5173
        },
        proxy: {
            // /api로 시작하는 모든 요청을 백엔드로 프록시
            '/api': {
                target: 'https://docs.yi.or.kr:8096',
                changeOrigin: true,
                secure: false, // 자체 서명 인증서 허용(개발용)
                ws: false
            },
            '/auth': {
                target: 'https://docs.yi.or.kr:8096',
                changeOrigin: true,
                secure: false,
                ws: false
            }
        },
        // ✅ 여기서 Vue Router fallback 적용!
        configureServer: ({ middlewares }) => {
            middlewares.use(
                history({
                    disableDotRule: true,
                    htmlAcceptHeaders: ['text/html','application/xhtml+xml'],
                    rewrites: [
                        { from: /^\/login$/, to: '/index.html' },
                        { from: /^\/mypage.*$/, to: '/index.html' },
                        { from: /^\/api\/.*$/, to: ctx => ctx.parsedUrl.pathname },
                        { from: /^\/auth\/.*$/, to: ctx => ctx.parsedUrl.pathname },
                        { from: /./, to: '/index.html' }
                    ]
                })
            );
        }
    }

});
