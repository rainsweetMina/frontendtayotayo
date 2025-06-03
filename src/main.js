import './assets/main.css'
import './main.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import EmptyLayout from "@/layouts/components/EmptyLayout.vue";
import DashboardLayout from "@/layouts/components/DashboardLayout.vue";

// ✅ Pinia 생성 및 persist 적용
const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(router)
app.use(pinia) // ✅ 중복 제거됨
app.component("default-layout", DashboardLayout);
app.component("empty-layout", EmptyLayout);
app.mount('#app')
