export default [
    {
        path: '/companies',
        name: 'BusCompanyPage',
        component: () => import('@/modules/board/busCompany/views/BusCompanyPage.vue'),
        meta: { title: '버스 회사 정보' }
    }
]
