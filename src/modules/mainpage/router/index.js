import MainPage from '../views/MainPage.vue'

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
  }
]

export default mainPageRoutes 