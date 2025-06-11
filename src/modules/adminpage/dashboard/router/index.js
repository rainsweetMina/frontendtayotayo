import { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import NoticeManagement from '../views/notice/NoticeManagement.vue'
import NoticeDetail from '../views/notice/NoticeDetail.vue'
import NoticeWrite from '../views/notice/NoticeWrite.vue'
import FoundAdminList from '@/modules/lostFound/views/admin/FoundAdminList.vue'


const routes = [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/notices',
    name: 'NoticeManagement',
    component: NoticeManagement,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/notices/new',
    name: 'NoticeWrite',
    component: NoticeWrite,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/notices/:id',
    name: 'NoticeDetail',
    component: NoticeDetail,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/notices/:id/edit',
    name: 'NoticeEdit',
    component: NoticeWrite,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/found',
    name: 'FoundAdminList',
    component: FoundAdminList,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  }
]

export default routes 