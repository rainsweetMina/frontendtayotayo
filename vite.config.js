import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import fs from 'fs'
import history from 'connect-history-api-fallback'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        // basicSsl() // ✅ HTTPS 인증서 적용 (필요 시 사용)
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
        rollupOptions: {
            plugins: [nodePolyfills()]
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
        proxy: {
            '/api': {
                target: 'https://localhost:8081',
                changeOrigin: true,
                secure: false, // ⚠️ 개발 중이므로 false
                configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        // ✅ 인증 쿠키를 프록시 요청에 포함
                        proxyReq.setHeader('origin', 'https://localhost:5173');
                    });
                }
            },
            '/auth': {
                target: 'https://localhost:8081',
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
