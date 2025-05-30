import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import busSearchRoutes from '@/modules/busSearch/router'
import busMapRoutes from '@/modules/busMap/router'

import lostFoundRoutes from '@/modules/lostFound/router'


const routes = [
    { path: '/', component: HomeView },
    ...busSearchRoutes,
    ...busMapRoutes,
    ...lostFoundRoutes ,
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
