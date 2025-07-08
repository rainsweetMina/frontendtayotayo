// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* ── Pinia & Persist ─────────────────────────────── */
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

/* ── 글로벌 스타일 ───────────────────────────────── */
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'leaflet/dist/leaflet.css'
import './assets/css/tailwind.css'
import './assets/main.css'

/* ── 전역 컴포넌트 & 플러그인 ───────────────────── */
import EmptyLayout   from '@/layouts/components/EmptyLayout.vue'
import VueApexCharts from 'vue3-apexcharts'

/* ── AuthStore (세션 동기화용) ───────────────────── */
import { useAuthStore } from '@/stores/auth'

/* ───────────────────────────────────────────────── */

async function bootstrap() {
    /* 1️⃣ Pinia 인스턴스 + persist 플러그인 */
    const pinia = createPinia()
    pinia.use(piniaPersistedState)

    /* 2️⃣ 앱 생성 및 플러그인/컴포넌트 등록 */
    const app = createApp(App)
    app.use(pinia)
    app.use(router)
    app.use(VueApexCharts)
    app.component('empty-layout', EmptyLayout)

    /* 3️⃣ 세션 동기화 (토큰 → 서버 확인) */
    const auth = useAuthStore()
    
    // URL 파라미터에서 토큰 확인 (백엔드 로그인 후 프론트엔드로 리다이렉트 시)
    const urlParams = new URLSearchParams(window.location.search)
    const urlAccessToken = urlParams.get('accessToken')
    const urlRefreshToken = urlParams.get('refreshToken')
    
    if (urlAccessToken && urlAccessToken !== 'null') {
        console.log('[main.js] URL에서 토큰 발견, 저장 중...')
        auth.setTokens(urlAccessToken, urlRefreshToken, 3600)
        
        // URL에서 토큰 파라미터 제거
        const cleanUrl = new URL(window.location.href)
        cleanUrl.searchParams.delete('accessToken')
        cleanUrl.searchParams.delete('refreshToken')
        window.history.replaceState({}, document.title, cleanUrl.toString())
        
        console.log('[main.js] 토큰 파라미터 제거 완료')
    }
    
    await auth.syncSession()          // ← 여기서 로그인 상태/토큰 검증

    /* 4️⃣ 라우터 준비 후 마운트 */
    await router.isReady()
    app.mount('#app')
}

bootstrap()   // 부트스트랩 실행
