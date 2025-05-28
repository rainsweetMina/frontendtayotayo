// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 라우트 모듈 병합
import mainRoutes from './routes/mainRoutes'
import authRoutes from './routes/authRoutes'
import mypageRoutes from './routes/mypageRoutes'

const routes = [
    ...mainRoutes,
    ...authRoutes,
    ...mypageRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
