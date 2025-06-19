export default [
    {
        path: '/fare',
        name: 'BusFarePage',
        component: () => import('@/modules/board/busFare/views/BusFarePage.vue'),
        meta: { title: '버스 요금 안내' }
    }
]
