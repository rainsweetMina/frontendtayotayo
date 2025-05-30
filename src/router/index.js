import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/AppLogin.vue";
import NotFound from "../views/NotFound.vue";
import { adminRoutes } from "@/modules/adminpage/router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  adminRoutes,
  { 
    path: "/:pathMatch(.*)*", 
    name: "NotFound",
    component: NotFound 
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 여기에 인증 체크 로직 추가
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router; 