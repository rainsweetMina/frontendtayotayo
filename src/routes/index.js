import { createRouter, createWebHistory } from 'vue-router'
import BusRoutes from '../pages/BusRoutes.vue'

const routes = [
    { path: '/', component: BusRoutes },
    // 추후 노선 추가, 관리자 페이지 등 확장 가능
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
