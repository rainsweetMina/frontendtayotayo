// 버스 이용 안내 관련 라우트
import FareView from '../views/FareView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import LowScheduleView from '../views/LowScheduleView.vue'
import BusInfoView from '../views/BusInfoView.vue'
import BusCompanyView from '../views/BusCompanyView.vue'

const busInfoRoutes = [
  {
    path: '/fare',
    name: 'fare',
    component: FareView,
    meta: {
      layout: 'default',
      title: '버스 요금 안내'
    }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: ScheduleView,
    meta: {
      layout: 'default',
      title: '버스 운행 시간표'
    }
  },
  {
    path: '/low-schedule',
    name: 'low-schedule',
    component: LowScheduleView,
    meta: {
      layout: 'default',
      title: '저상버스 시간표'
    }
  },
  {
    path: '/bus-info',
    name: 'bus-info',
    component: BusInfoView,
    meta: {
      layout: 'default',
      title: '정류장 조회'
    }
  },
  {
    path: '/bus-company',
    name: 'bus-company',
    component: BusCompanyView,
    meta: {
      layout: 'default',
      title: '버스 회사 조회'
    }
  }
]

export default busInfoRoutes 