// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import { adminRoutes } from '@/modules/adminpage/router'
import lostFoundRoutes from '@/modules/lostFound/router'
import adRoutes from '@/modules/ad/router'
import boardRoutes from '@/modules/board/router'
import mainPageRoutes from '@/modules/mainpage/router'
import noticeRoutes from '@/modules/board/notice/router'
import lowFloorBusRoutes from '@/modules/board/lowfloorbus/router'
import { publicQnaRoutes } from '@/modules/qna/public/router'
import TermsOfService from '@/modules/board/terms/views/TermsOfService.vue'
import PrivacyPolicy from '@/modules/board/privacy/views/PrivacyPolicy.vue'

import { useAuthStore } from '@/stores/auth'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo.js'

// 이용약관 라우트를 직접 추가
const termsRoute = {
    path: '/terms',
    name: 'terms',
    component: TermsOfService,
    meta: {
        title: '이용약관',
        layout: 'default'
    }
}

// 개인정보처리방침 라우트를 직접 추가
const privacyRoute = {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicy,
    meta: {
        title: '개인정보처리방침',
        layout: 'default'
    }
}

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
    termsRoute, // 이용약관 라우트 직접 추가
    privacyRoute, // 개인정보처리방침 라우트 직접 추가
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()
    const { fetchUserInfo, isUserInfoFetched } = useUserInfo()

    // 🔑 /schedule로 시작하는 경로는 토큰 체크 건너뛰기
    if (to.path.startsWith('/schedule')) {
        console.log('[Router] /schedule 경로 - 토큰 체크 건너뛰기');
        return next();
    }

    // 🔑 로그인 진입 시 redirect 없으면 직전 페이지 부여
    if (to.path === '/login' && !to.query.redirect) {
        const prev = from.fullPath && from.fullPath !== '/login' ? from.fullPath : null
        if (prev) {
            return next({ path: '/login', query: { redirect: encodeURIComponent(prev) } })
        }
    }

    // 1. 보호 경로 판단
    const isProtected =
        to.meta.requiresAuth === true ||
        to.path.startsWith('/admin') ||
        to.path.startsWith('/mypage')

    // 2. 토큰만 있을 때 사용자 정보 복원
    const accessToken = localStorage.getItem('accessToken')
    if (!auth.isLoggedIn && accessToken && !isUserInfoFetched.value) {
        const ok = await fetchUserInfo(true)
        if (!ok && isProtected) {
            return next({ path: '/login', query: { redirect: encodeURIComponent(to.fullPath) } })
        }
    }

    // 3. 보호 경로인데 로그인 안 되어있으면
    if (isProtected && !auth.isLoggedIn) {
        return next({ path: '/login', query: { redirect: encodeURIComponent(to.fullPath) } })
    }

    // 4. 로그인된 상태에서 /login 접근 → redirectQuery 있으면 무조건 우선
    if (to.path === '/login' && auth.isLoggedIn) {
        const role = auth.role
        const redirectQuery = to.query.redirect
            ? decodeURIComponent(to.query.redirect)
            : null

        /* 👉 USER만 redirectQuery 우선 */
        if (role === 'USER' && redirectQuery) {
            return next(redirectQuery)
        }

        /* 👉 ADMIN·BUS (또는 USER에 redirectQuery가 없을 때) */
        const mapByRole = {
            ADMIN: '/admin/dashboard',
            BUS:   '/admin/lost',
            USER:  '/mypage',
        }
        return next(mapByRole[role] || '/')
    }

    // 5. /admin 권한 제어
    if (to.path.startsWith('/admin')) {
        const params = new URLSearchParams(window.location.search)
        const qAccess = params.get('accessToken')
        const qRefresh = params.get('refreshToken')

        if (qAccess && qAccess !== 'null') localStorage.setItem('accessToken', qAccess)
        if (qRefresh && qRefresh !== 'null') localStorage.setItem('refreshToken', qRefresh)
        if (qAccess || qRefresh) {
            const cleanUrl = new URL(window.location.href)
            cleanUrl.searchParams.delete('accessToken')
            cleanUrl.searchParams.delete('refreshToken')
            window.history.replaceState({}, document.title, cleanUrl.toString())
        }

        if (!auth.role) {
            const ok = await fetchUserInfo(true)
            if (!ok) return next('/login')
        }

        if (auth.role === 'USER') {
            alert('🚫 일반 사용자에게는 관리자 페이지 접근 권한이 없습니다.')
            return next('/')
        }

        if (auth.role === 'BUS') {
            const allowed = ['/admin/found', '/admin/lost']
            const ok = allowed.some(p => to.path.startsWith(p))
            if (!ok) {
                alert('🚫 BUS 권한으로는 해당 페이지에 접근할 수 없습니다.')
                return next('/admin/dashboard')
            }
        }
    }

    // 6. /mypage 권한 제어
    if (to.path.startsWith('/mypage')) {
        if (!auth.userId) {
            const ok = await fetchUserInfo(true)
            if (!ok) return next('/login')
        }
        if (auth.role !== 'USER') {
            alert('🚫 마이페이지는 일반 사용자만 접근 가능합니다.')
            return next('/')
        }
    }

    next()
})

export default router
