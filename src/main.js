// main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Pinia 및 Persist 플러그인
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

// ✅ 스타일 및 CSS
import 'leaflet/dist/leaflet.css'
import './assets/main.css'


// ✅ 레이아웃 컴포넌트
import EmptyLayout from "@/layouts/components/EmptyLayout.vue"

// ✅ Axios 전역 설정 적용
import './config/axios'

// ✅ Pinia 생성 및 persist 적용
const pinia = createPinia()
pinia.use(piniaPersistedState)

// ✅ 앱 생성 및 구성 요소 등록
const app = createApp(App)
app.use(pinia)
app.use(router)
app.component("empty-layout", EmptyLayout)

app.mount('#app')
