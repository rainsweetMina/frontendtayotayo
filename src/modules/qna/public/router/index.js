import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/qna',
    name: 'PublicQnaList',
    component: () => import('../PublicQnaList.vue'),
  },
  {
    path: '/qna/new',
    name: 'PublicQnaForm',
    component: () => import('../PublicQnaForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/qna/edit/:id',
    name: 'PublicQnaEdit',
    component: () => import('../PublicQnaForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/qna/:id',
    name: 'PublicQnaDetail',
    component: () => import('../PublicQnaDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
export { routes as publicQnaRoutes }; 