export default [
  {
    path: '/admin/user',
    name: 'AdminUserList',
    component: () => import('../views/UserListView.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/apikey',
    name: 'AdminApiKeyManagement',
    component: () => import('../views/ApiKeyManagementView.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  }
];
