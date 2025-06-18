export default [
    {
        path: '/stop-info',
        name: 'BusStopInfoPage',
        component: () => import('@/modules/board/busStopInfo/views/BusStopInfoPage.vue'),
        meta: {
            title: '정류소 정보 조회'
        }
    }
]
