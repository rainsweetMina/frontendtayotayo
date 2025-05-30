import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// ✅ Pinia 생성 및 persist 적용
const pinia = createPinia()
pinia.use(piniaPersist) // ✅ persist 플러그인 연결

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
