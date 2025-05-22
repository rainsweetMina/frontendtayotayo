import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// 다른 뷰 파일 필요 시 추가

const routes = [
    { path: '/', component: HomeView },
    // { path: '/schedule', component: ScheduleView },
    // { path: '/admin', component: AdminView },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
