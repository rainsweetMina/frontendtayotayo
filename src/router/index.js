import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import Notice from "../views/Notice.vue";
import NoticeWrite from "../views/NoticeWrite.vue";

// Admin pages
import AdminDashboard from "../views/admin/Dashboard.vue";
import AdminNotice from "../views/admin/Notice.vue";
import AdminQna from "../views/admin/Qna.vue";
import AdminAdvertisement from "../views/admin/Advertisement.vue";
import AdminBusRoutes from "../views/admin/BusRoutes.vue";
import AdminBusRouteAdd from "../views/admin/BusRouteAdd.vue";
import AdminBusRouteSearch from "../views/admin/BusRouteSearch.vue";
import AdminBusRouteOrder from "../views/admin/BusRouteOrder.vue";
import AdminBusRouteStops from "../views/admin/BusRouteStops.vue";
import AdminBusStops from "../views/admin/BusStops.vue";
import AdminBusStopAdd from "../views/admin/BusStopAdd.vue";
import AdminBusStopSearch from "../views/admin/BusStopSearch.vue";
import AdminOperationTime from "../views/admin/OperationTime.vue";
import AdminSystemLogs from "../views/admin/SystemLogs.vue";
import AdminRouteFinderSettings from "../views/admin/RouteFinderSettings.vue";
import AdminReportedLostItems from "../views/admin/ReportedLostItems.vue";
import AdminRegisteredLostItems from "../views/admin/RegisteredLostItems.vue";
import Login from "../views/AppLogin.vue";
import NotFound from "../views/NotFound.vue";

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
  {
    path: "/notice",
    name: "Notice",
    component: Notice
  },
  {
    path: "/notice/write",
    name: "NoticeWrite",
    component: NoticeWrite,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        redirect: "dashboard"
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminDashboard
      },
      {
        path: "notice",
        name: "AdminNotice",
        component: AdminNotice
      },
      {
        path: "qna",
        name: "AdminQna",
        component: AdminQna
      },
      {
        path: "advertisement",
        name: "AdminAdvertisement",
        component: AdminAdvertisement
      },
      {
        path: "reported-lost-items",
        name: "AdminReportedLostItems",
        component: AdminReportedLostItems
      },
      {
        path: "registered-lost-items",
        name: "AdminRegisteredLostItems",
        component: AdminRegisteredLostItems
      },
      {
        path: "operation-time",
        name: "AdminOperationTime",
        component: AdminOperationTime
      },
      {
        path: "system-logs",
        name: "AdminSystemLogs",
        component: AdminSystemLogs
      },
      {
        path: "route-finder-settings",
        name: "AdminRouteFinderSettings",
        component: AdminRouteFinderSettings
      },
      {
        path: "bus-routes",
        name: "AdminBusRoutes",
        component: AdminBusRoutes
      },
      {
        path: "bus-routes/add",
        name: "AdminBusRouteAdd",
        component: AdminBusRouteAdd
      },
      {
        path: "bus-routes/search",
        name: "AdminBusRouteSearch",
        component: AdminBusRouteSearch
      },
      {
        path: "bus-routes/order",
        name: "AdminBusRouteOrder",
        component: AdminBusRouteOrder
      },
      {
        path: "bus-routes/stops",
        name: "AdminBusRouteStops",
        component: AdminBusRouteStops
      },
      {
        path: "bus-stops",
        name: "AdminBusStops",
        component: AdminBusStops
      },
      {
        path: "bus-stops/add",
        name: "AdminBusStopAdd",
        component: AdminBusStopAdd
      },
      {
        path: "bus-stops/search",
        name: "AdminBusStopSearch",
        component: AdminBusStopSearch
      }
    ],
    meta: { requiresAuth: true }
  },
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