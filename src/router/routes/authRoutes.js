// authRoutes.js
import LoginView from '@/modules/mypage/views/LoginView.vue'

export default [
    {
        path: '/login',
        component: LoginView,
        meta: { layout: 'none' }  // 헤더/메뉴 없는 레이아웃
    }
]
