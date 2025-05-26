import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '../views/NoticeList.vue';
import NoticeDetail from '../views/NoticeDetail.vue';
import NoticeForm from '../views/NoticeForm.vue';

const routes = [
    { path: '/', redirect: '/notices' },
    { path: '/notices', component: NoticeList },
    { path: '/notices/:id', component: NoticeDetail },
    { path: '/admin/notices/new', component: NoticeForm },
    { path: '/admin/notices/:id/edit', component: NoticeForm },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
