export default [
    {
        path: '/schedule',
        name: 'BusSchedulePage',
        component: () => import('../views/BusSchedulePage.vue'),
        meta: { title: '버스 시간표 안내' }
    },
    {
        path: '/low-schedule',
        name: 'LowBusSchedulePage',
        component: () => import('../views/LowBusSchedulePage.vue'),
        meta: { title: '저상버스 시간표 안내' }
    }
]