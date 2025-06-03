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
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
    },

    {
        path: '/mypage/notifications',
        component: () => import('@/modules/mypage/views/NotificationListView.vue')
    }
]
