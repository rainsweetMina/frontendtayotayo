// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import { adminRoutes } from "@/modules/adminpage/router"
import lostFoundRoutes from '@/modules/lostFound/router'
import adRoutes from '@/modules/ad/router'
import boardRoutes from '@/modules/board/router'
import mainPageRoutes from '@/modules/mainpage/router'
import noticeRoutes from '@/modules/board/notice/router'
import lowFloorBusRoutes from '@/modules/board/lowfloorbus/router'
import { publicQnaRoutes } from '@/modules/qna/public/router'

import { useAuthStore } from '@/stores/auth'
import { useUserInfo } from "@/modules/mypage/composables/useUserInfo.js"

const routes = [
    ...mainPageRoutes,
    adminRoutes,
    ...busSearchRoutes,
    ...busMapRoutes,
    ...myPageRoutes,
    ...lostFoundRoutes,
    ...adRoutes,
    ...noticeRoutes,
    ...lowFloorBusRoutes,
    ...boardRoutes,
    ...publicQnaRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// ✅ 전역 가드 설정
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()
    const {
        isLoggedIn,
        fetchUserInfo,
        isUserInfoFetched
    } = useUserInfo()

    const publicPaths = ['/login', '/register', '/oauth-success', '/find-password']
    const requiresAuth = !publicPaths.includes(to.path)

    // ✅ 토큰 있는 경우 → 사용자 정보 복원 시도
    if (requiresAuth && !auth.userId && localStorage.getItem('accessToken') && !isUserInfoFetched.value) {
        const ok = await fetchUserInfo(true)
        if (!ok) {
            console.warn('⛔ 사용자 정보 복원 실패 → 로그인 페이지로')
            return next('/login')
        }
    }

    // ✅ /admin 접근 로직
    if (to.path.startsWith('/admin')) {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('accessToken')
        const refreshToken = urlParams.get('refreshToken')

        if (accessToken && accessToken !== 'null') {
            localStorage.setItem('accessToken', accessToken)
        }
        if (refreshToken && refreshToken !== 'null') {
            localStorage.setItem('refreshToken', refreshToken)
        }

        // 쿼리 정리
        if (accessToken || refreshToken) {
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('accessToken')
            newUrl.searchParams.delete('refreshToken')
            window.history.replaceState({}, document.title, newUrl.toString())
        }

        // ❌ accessToken 없으면 로그인 페이지로
        if (!localStorage.getItem('accessToken')) {
            return next('/login')
        }

        // ✅ 사용자 정보 복원 완료 후 권한 체크
        if (!auth.role) {
            const ok = await fetchUserInfo(true)
            if (!ok) return next('/login')
        }

        // ✅ BUS 권한 체크
        if (auth.role === 'BUS') {
            const allowedPaths = ['/admin/found', '/admin/lost', '/admin/dashboard']
            const isAllowed = allowedPaths.some(path => to.path.startsWith(path))
            if (!isAllowed) {
                alert('🚫 BUS 권한으로는 해당 페이지에 접근할 수 없습니다.')
                return next('/admin/dashboard')
            }
        }

        // ✅ 일반 사용자 접근 제한
        if (auth.role === 'USER') {
            alert('🚫 일반 사용자에게는 관리자 페이지 접근 권한이 없습니다.')
            return next('/')
        }
    }

    // ✅ 마이페이지 접근 시 로그인 복원 실패하면 로그인 페이지로
    if (to.path.startsWith('/mypage') && !auth.userId) {
        const ok = await fetchUserInfo(true)
        if (!ok) return next('/login')
    }

    // ✅ 기본 이동 허용
    next()
})

export default router
