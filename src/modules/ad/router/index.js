// src/modules/ad/router/index.js
export default [
    // 광고
    { path: '/admin/ad',          name: 'AdList',   component: () => import('@/modules/ad/views/ad/adList.vue') },
    { path: '/admin/ad/create',   name: 'AdCreate', component: () => import('@/modules/ad/views/ad/adCreate.vue') },
    // { path: '/admin/ad/edit/:id',     component: () => import('@/modules/ad/views/ad/adEdit.vue'), props: true },
    // { path: '/admin/ad/extend/:id',   component: () => import('@/modules/ad/views/ad/adExtend.vue'), props: true },
    // // 광고회사
    // { path: '/admin/ad-company',              component: () => import('@/modules/ad/views/adCompany/adCompanyList.vue') },
    // { path: '/admin/ad-company/create',       component: () => import('@/modules/ad/views/adCompany/adCompanyCreate.vue') },
    // { path: '/admin/ad-company/edit/:id',     component: () => import('@/modules/ad/views/adCompany/adCompanyEdit.vue'), props: true },
]
