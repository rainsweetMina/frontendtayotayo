import { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import NoticeManagement from '../views/notice/NoticeManagement.vue'
import NoticeDetail from '../views/notice/NoticeDetail.vue'
import NoticeWrite from '../views/notice/NoticeWrite.vue'
import FoundAdminList from '@/modules/lostFound/views/admin/FoundAdminList.vue'
import FoundAdminCreate from '@/modules/lostFound/views/admin/FoundAdminCreate.vue'
import FoundAdminDetail from '@/modules/lostFound/views/admin/FoundAdminDetail.vue'
import FoundAdminEdit from '@/modules/lostFound/views/admin/FoundAdminEdit.vue'


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
  },
  {
    path: '/admin/found/create',
    name: 'FoundAdminCreate',
    component: FoundAdminCreate,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/found/:id',
    name: 'FoundAdminDetail',
    component: FoundAdminDetail,
    props: true,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  },
  {
    path: '/admin/found/edit/:id',
    name: 'FoundAdminEdit',
    component: FoundAdminEdit,
    props: true,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  }
]

export default routes 