import MainPage from '../views/MainPage.vue'
import BusFarePage from '../views/BusFarePage.vue'

const mainPageRoutes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    meta: {
      layout: 'default',
      title: '대구 버스 정보 - 메인'
    }
  },
  {
    path: '/main',
    name: 'main',
    component: MainPage,
    meta: {
      layout: 'default',
      title: '대구 버스 정보 - 메인'
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

export default mainPageRoutes 