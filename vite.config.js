import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import basicSsl from '@vitejs/plugin-basic-ssl';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        basicSsl()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            global: 'globalThis'
        }
    },
    define: {
        'process.env': {}, // process.env 참조 방지
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
        open: true,
        https: {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem'),
        },
        proxy: {
            '/api': {
                target: 'https://localhost:8081',
                changeOrigin: true,
                secure: false
            }
        },
        fs: {
            strict: false
        },
        configureServer: ({ middlewares }) => {
            middlewares.use(
                history({
                    rewrites: [
                        { from: /^\/api\/.*$/, to: context => context.parsedUrl.pathname },
                        { from: /^\/login$/, to: '/index.html' },
                        { from: /^\/mypage.*$/, to: '/index.html' },
                        { from: /./, to: '/index.html' }
                    ]
                })
            );
        }
    }
});
