import BusMapPage from '../views/BusMapPage.vue'
import BusFarePage from '../views/BusFarePage.vue'

export default [
    {
        path: '/bus-map',
        name: 'BusMap',
        component: BusMapPage,
        meta: {
            title: '버스 노선도'
        }
    },
    {
        path: '/bus/map',
        name: 'BusMapAlternative',
        component: BusMapPage,
        meta: {
            title: '버스 노선도'
        }
    },
    {
        path: '/fare',
        name: 'BusFare',
        component: BusFarePage,
        meta: {
            title: '버스 요금'
        }
    }
]
