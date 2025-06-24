// src/modules/ad/router/index.js
export default [
    // 광고
    { path: '/admin/ad',          name: 'AdList',   component: () => import('@/modules/ad/views/ad/adList.vue') },
    { path: '/admin/ad/create',   name: 'AdCreate', component: () => import('@/modules/ad/views/ad/adCreate.vue') },
    {
        path: '/admin/ad/edit/:id',
        name: 'AdEdit',
        component: () => import('@/modules/ad/views/ad/adCreate.vue'),
        props: true
    },
    {
        path: '/admin/ad/extend/:id',
        name: 'AdExtend',
        component: () => import('@/modules/ad/views/ad/AdExtendPage.vue'),
        props: true
    }
]