// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 메인 홈 페이지 (BusRoutes가 메인 페이지 역할을 한다면)
import BusRoutes from '@/pages/BusRoutes.vue'

// 각 모듈별 라우트 가져오기
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import LoginView from "@/modules/mypage/views/LoginView.vue";


const routes = [
    { path: '/', component: BusRoutes }, // 메인 홈 화면 지정
    { path: '/auth/login', name: 'Login', component: LoginView }, // 로그인 화면

    // 도메인 모듈별 라우트 병합
    ...busSearchRoutes,
    ...busMapRoutes,
    ...myPageRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
