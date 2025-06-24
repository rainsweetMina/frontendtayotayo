// main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ Pinia 및 Persist 플러그인
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

// ✅ 스타일 및 CSS - Bootstrap과 Tailwind 충돌 방지를 위한 로딩 순서 조정
// Bootstrap JS는 필요한 경우에만 로드
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Leaflet CSS
import 'leaflet/dist/leaflet.css'
// Tailwind CSS를 마지막에 로드하여 우선 적용
import './assets/css/tailwind.css'

// ✅ 레이아웃 컴포넌트
import EmptyLayout from "@/layouts/components/EmptyLayout.vue"

// ✅ Axios 전역 설정 적용
import './api/axiosInstance'

// ✅ Pinia 생성 및 persist 적용
const pinia = createPinia()
pinia.use(piniaPersistedState)

// ✅ 앱 생성 및 구성 요소 등록
const app = createApp(App)
app.use(pinia)
app.use(router)
app.component("empty-layout", EmptyLayout)

app.mount('#app')
