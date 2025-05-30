// src/modules/mypage/router/index.js
export default [
    {
        path: '/mypage',
        name: 'MyPageHome',
        component: () => import('../views/MyPageHome.vue')
    },
    {
        path: '/mypage/favorites',
        name: 'MyPageFavorites',
        component: () => import('../views/MyPageFavorites.vue')
    },
    {
        path: '/mypage/password',
        name: 'ChangePassword',
        component: () => import('../views/ChangePassword.vue')
    },
    // 필요 시 추가:
    // {
    //   path: '/mypage/login',
    //   name: 'MyPageLogin',
    //   component: () => import('../views/LoginView.vue')
    // }
]
