// src/modules/mypage/router/index.js
export default [
    {
        path: '/mypage',
        name: 'MyPageHome',
        component: () => import('../views/MyPageHome.vue')
    },

    {
        path: '/mypage/favorites',
        component: () => import('@/modules/mypage/views/FavoriteView.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/mypage/modify',
        component: () => import('@/modules/mypage/views/UserEditView.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/mypage/withdraw',
        component: () => import('@/modules/mypage/views/WithdrawView.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/mypage/apikey-request',
        name: 'ApiKey',
        component: () => import('@/modules/mypage/views/ApiKeyView.vue')
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { layout: 'none' }
    },

    {
        path: '/logout',
        name: 'Logout',
        component: {
            async setup() {
                try {
                    await axios.post('/auth/logout', null, { withCredentials: true })
                } catch (e) {
                    console.error('자동 로그아웃 실패:', e)
                } finally {
                    window.location.href = '/login'
                }
                return () => null // 아무 것도 렌더링하지 않음
            }
        },
        meta: { layout: 'none' }
    },

    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
    },

    {
        path: '/mypage/notifications',
        component: () => import('@/modules/mypage/views/NotificationListView.vue')
    },

    {
        path: '/mypage/qna',
        name: 'QnaList',
        component: () => import('@/modules/mypage/views/QnaView.vue'),
        meta: { requiresAuth: true }
    }
]
