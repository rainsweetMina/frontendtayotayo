// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import { adminRoutes } from "@/modules/adminpage/router"
import lostFoundRoutes from '@/modules/lostFound/router'
import userManagementRoutes from '@/modules/usermanagement/router'

import mainPageRoutes from '@/modules/mainpage/router'
import noticeRoutes from '@/modules/board/notice/router'

// 📌 Pinia에서 인증 상태 가져오기
import { useAuthStore } from '@/stores/auth'

// 중복되는 라우트 경로 제거 (adminRoutes에서 이미 정의된 경로)
const filteredLostFoundRoutes = lostFoundRoutes.filter(route => !route.path.startsWith('/admin'));

const routes = [
    // { path: '/', component: HomeView }, // 메인 페이지로 교체
    ...mainPageRoutes, // 메인 페이지 라우트 추가
    adminRoutes,
    ...busSearchRoutes,
    ...busMapRoutes,
    ...myPageRoutes,
    ...filteredLostFoundRoutes, // 필터링된 경로만 사용
    ...noticeRoutes, // 공지사항 라우트 추가
    ...userManagementRoutes,
    // Headless UI 데모 페이지 라우트
    {
        path: '/headless-ui-demo',
        name: 'HeadlessUiDemo',
        component: () => import('@/views/HeadlessUiDemo.vue'),
        meta: {
            title: 'Headless UI 데모'
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// ✅ 전역 가드 설정 (최소한으로만 추가)
router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const isLoggedIn = auth.isAuthenticated // ✅ getter로 로그인 상태 확인

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            return next({ path: '/login', query: { redirect: to.fullPath } })
        }
    }

    next()
})

export default router
