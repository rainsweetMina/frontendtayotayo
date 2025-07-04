import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import fs from 'fs'
import history from 'connect-history-api-fallback'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'

const keyPath = path.resolve(__dirname, 'cert', 'key.pem');
const certPath = path.resolve(__dirname, 'cert', 'cert.pem');

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        // basicSsl() // ✅ HTTPS 인증서 적용 (개발 환경에서 자체 서명 인증서 사용)
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            global: 'globalThis',
            buffer: 'buffer'
        }
    },
    define: {
        'process.env': {},
        global: 'globalThis'
    },
    optimizeDeps: {
        include: ['buffer']
    },
    build: {
        outDir: 'dist',  // 독립적인 Vue.js 프로젝트를 위한 dist 폴더
        emptyOutDir: true, // 기존 dist 폴더 지우고 새로 생성
        rollupOptions: {
            plugins: [nodePolyfills()],
            external: [],
            output: {
                globals: {
                    buffer: 'Buffer'
                }
            }
        }
    },
    server: {
        port: 5173,
        host: '0.0.0.0',
        open: false,
        https: true, // basicSsl 플러그인이 자체 서명 인증서를 생성함
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
        },
        proxy: {
            '/api': {
                target: process.env.VITE_BASE_URL || 'https://localhost:8094',
                changeOrigin: true,
                secure: false, // ⚠️ 개발 중이므로 false (SSL 인증서 검증 비활성화)
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // ✅ 인증 쿠키를 프록시 요청에 포함
                        proxyReq.setHeader('origin', process.env.VITE_BASE_URL || 'https://localhost:8094');
                    });
                }
            },
            '/auth': {
                target: process.env.VITE_BASE_URL || 'https://localhost:8094',
                changeOrigin: true,
                secure: false
            },
        },
        cors: true,
        fs: {
            strict: false
        },
        // ✅ 여기서 Vue Router fallback 적용!
        configureServer: ({ middlewares }) => {
            middlewares.use(
                history({
                    disableDotRule: true,
                    htmlAcceptHeaders: ['text/html','application/xhtml+xml'],
                    // ❌ rewrites 제거: /api 요청을 HTML로 넘기지 않도록!
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
