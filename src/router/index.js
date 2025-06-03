// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// 각 모듈별 라우트 가져오기
import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'
import myPageRoutes from '@/modules/mypage/router'


import lostFoundRoutes from '@/modules/lostFound/router'


const routes = [
    { path: '/', component: HomeView },

    // 도메인 모듈별 라우트 병합np
    ...busSearchRoutes,
    ...busMapRoutes,
    ...myPageRoutes,
    ...lostFoundRoutes ,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
