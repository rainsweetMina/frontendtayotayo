import PublicLowFloorBus from '../views/PublicLowFloorBus.vue'

const lowFloorBusRoutes = [
  {
    path: '/lowfloorbus',
    name: 'lowfloorbus-list',
    component: PublicLowFloorBus,
    meta: {
      layout: 'default',
      title: '저상버스 대체 안내'
    }
  },
  {
    path: '/lowfloorbus/:id',
    name: 'lowfloorbus-detail',
    component: PublicLowFloorBus,
    meta: {
      layout: 'default',
      title: '저상버스 대체 안내 상세'
    }
  }
]

export default lowFloorBusRoutes 