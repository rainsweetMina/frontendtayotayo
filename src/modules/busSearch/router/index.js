export default [
    {
        path: '/bus/search',
        name: 'BusSearch',
        component: () => import('../views/BusSearchPage.vue')
    },
    {
        path: '/bus/arrival',
        name: 'BusArrival',
        component: () => import('../views/BusArrivalPage.vue') // ✅ 추가
    }
]
