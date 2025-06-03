import { RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const routes = [
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