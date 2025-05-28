// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// 각 모듈별 라우트 가져오기
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'
import LoginView from "@/modules/mypage/views/LoginView.vue";


const routes = [
    { path: '/', component: HomeView },
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
