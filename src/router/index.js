import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'

const routes = [
    { path: '/', component: HomeView },
    ...busSearchRoutes,
    ...busMapRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

// // src/router/index.js
// import { createRouter, createWebHistory } from 'vue-router'
//
// // 라우트 모듈 병합
// import mainRoutes from './routes/mainRoutes'
// import authRoutes from './routes/authRoutes'
// import mypageRoutes from './routes/mypageRoutes'
//
// const routes = [
//     ...mainRoutes,
//     ...authRoutes,
//     ...mypageRoutes
// ]
//
// const router = createRouter({
//     history: createWebHistory(),
//     routes
// })
//
// export default router
