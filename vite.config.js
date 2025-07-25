import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import history from 'connect-history-api-fallback'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'


export default defineConfig({
    base: './',
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
                    'vue-vendor': ['vue', 'vue-router']
                }
            }
        }
    },
    server: {
        port: 5173,
        host: '0.0.0.0',
        origin: 'https://docs.yi.or.kr:15173',
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
                ws: true // WebSocket 프록시 활성화
            },
            '/auth': {
                target: 'https://docs.yi.or.kr:8096',
                changeOrigin: true,
                secure: false,
                ws: true // WebSocket 프록시 활성화
            },
            // 이미지 파일 프록시 추가
            '/uploads': {
                target: 'https://docs.yi.or.kr:8096',
                changeOrigin: true,
                secure: false
            },
            // WebSocket 엔드포인트 프록시 추가
            '/ws': {
                target: 'https://docs.yi.or.kr:8096',
                changeOrigin: true,
                secure: false,
                ws: true // WebSocket 프록시 활성화
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
                        { from: /^\/uploads\/.*$/, to: ctx => ctx.parsedUrl.pathname }, // 이미지 파일은 프록시로 처리
                        { from: /^\/ws.*$/, to: ctx => ctx.parsedUrl.pathname }, // WebSocket 경로는 프록시로 처리
                        { from: /./, to: '/index.html' }
                    ]
                })
            );
        }
    }

});
