// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import { adminRoutes } from "@/modules/adminpage/router"
import lostFoundRoutes from '@/modules/lostFound/router'
import adRoutes from '@/modules/ad/router'
import userManagementRoutes from '@/modules/usermanagement/router'
import boardRoutes from '@/modules/board/router'
import mainPageRoutes from '@/modules/mainpage/router'
import noticeRoutes from '@/modules/board/notice/router'
import lowFloorBusRoutes from '@/modules/board/lowfloorbus/router'

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
    ...lostFoundRoutes,
    ...adRoutes,
    ...noticeRoutes, // 공지사항 라우트 추가
    ...lowFloorBusRoutes, // 저상버스 대체 안내 라우트 추가
    ...userManagementRoutes,
    ...boardRoutes,
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

    // 전역 가드: /admin 하위 라우트에서 accessToken 체크 및 저장
    if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('accessToken')
        const refreshToken = urlParams.get('refreshToken')

        // accessToken/refreshToken이 쿼리로 오면 localStorage에 저장
        if (accessToken && accessToken !== 'null') {
            localStorage.setItem('accessToken', accessToken)
        }
        if (refreshToken && refreshToken !== 'null') {
            localStorage.setItem('refreshToken', refreshToken)
        }

        // URL에서 토큰 파라미터 제거
        if (accessToken || refreshToken) {
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('accessToken')
            newUrl.searchParams.delete('refreshToken')
            window.history.replaceState({}, document.title, newUrl.toString())
        }

        // localStorage에 accessToken이 없으면 로그인 페이지로 이동
        if (!localStorage.getItem('accessToken')) {
            return next('/admin/login')
        }
    }

    next()
})


export default router
