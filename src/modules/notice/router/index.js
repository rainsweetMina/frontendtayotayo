import { createRouter, createWebHistory } from 'vue-router'
import BusRoutes from '../pages/BusRoutes.vue'
import NoticeList from "@/views/board/NoticeList.vue";
import NoticeDetail from "@/views/board/NoticeDetail.vue";
import NoticeForm from "@/views/board/NoticeForm.vue";




const routes = [
    { path: '/', component: BusRoutes },
    { path: '/notices', component: NoticeList },
    { path: '/notices/:id', component: NoticeDetail},
    { path: '/admin/notices/new', component: NoticeForm },
    { path: '/admin/notices/:id/edit', component: NoticeForm },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
