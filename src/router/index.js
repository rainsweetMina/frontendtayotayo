import { createRouter, createWebHistory } from 'vue-router'
import BusRoutes from '../pages/BusRoutes.vue'
import NoticeList from "@/views/board/notice/NoticeList.vue";
import NoticeDetail from "@/views/board/notice/NoticeDetail.vue";
import NoticeForm from "@/views/board/notice/NoticeForm.vue";




const routes = [
    { path: '/', component: BusRoutes },
    { path: '/notice', component: NoticeList },
    { path: '/notice/:id', component: NoticeDetail},
    { path: '/admin/notice/new', component: NoticeForm },
    { path: '/admin/notice/:id/edit', component: NoticeForm },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
