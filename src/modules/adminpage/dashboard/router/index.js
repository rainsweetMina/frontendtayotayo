import { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      layout: 'admin'
    }
  }
]

export default routes 