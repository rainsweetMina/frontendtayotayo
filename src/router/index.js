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
import {useUserInfo} from "@/modules/mypage/composables/useUserInfo.js";

// 중복되는 라우트 경로 제거 (adminRoutes에서 이미 정의된 경로)
// const filteredLostFoundRoutes = lostFoundRoutes.filter(route => !route.path.startsWith('/admin'));

const routes = [
    // { path: '/', component: HomeView }, // 메인 페이지로 교체
    ...mainPageRoutes, // 메인 페이지 라우트 추가
    adminRoutes,
    ...busSearchRoutes,
    ...busMapRoutes,
    ...myPageRoutes,
    ...lostFoundRoutes,      // 👈 여기로 바꿔주면 됨!
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

// ✅ 소셜 로그인 후 새로고침이나 직접 접근 시 자동 로그인 복원
router.beforeEach(async (to, from, next) => {
    const { isLoggedIn, fetchUserInfo } = useUserInfo()

    // ✅ 인증 필요 없는 경로는 무시
    if (to.path === '/oauth-success') {
        return next()
    }

    // ✅ 마이페이지 접근 시 자동 로그인 복원
    if (!isLoggedIn.value && to.path.startsWith('/mypage')) {
        const ok = await fetchUserInfo()

        if (!ok) {
            return next('/login')
        }
    }

    next()
})


export default router
