export default [
    {
        path: '/schedule',
        name: 'BusSchedulePage',
        component: () => import('../views/BusSchedulePage.vue'),
        meta: { title: '버스 시간표 안내' }
    }
]