import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';
import nodePolyfills from 'rollup-plugin-node-polyfills';


export default defineConfig({
  plugins: [
    vue(),
    basicSsl()
  ],
  resolve: {
    alias: {
      '@': '/src',
      global: 'globalThis',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills()
      ]
    }
  },
  define: {
    'process.env': {}, // 일부 패키지가 process.env 참조 시 대응
    global: 'globalThis',
  },
  server: {
    open: true,
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:8081',
        changeOrigin: true,
        secure: false
      }
    }
  },
}); 