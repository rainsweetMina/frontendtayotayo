import PublicNotice from '../views/PublicNotice.vue'

const noticeRoutes = [
  {
    path: '/notice',
    name: 'notice-list',
    component: PublicNotice,
    meta: {
      layout: 'default',
      title: '공지사항'
    }
  },
  {
    path: '/notice/:id',
    name: 'notice-detail',
    component: PublicNotice,
    meta: {
      layout: 'default',
      title: '공지사항 상세'
    }
  }
]

export default noticeRoutes 