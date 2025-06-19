import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminDashboard from '@/modules/adminpage/dashboard/views/AdminDashboard.vue'
import AdminNotice from '@/modules/adminpage/dashboard/views/notice/Notice.vue'
import AdminQna from '@/modules/adminpage/dashboard/views/Qna.vue'
import AdminAdvertisement from '@/modules/adminpage/dashboard/views/Advertisement.vue'
import AdminReportedLostItems from '@/modules/adminpage/dashboard/views/ReportedLostItems.vue'
import AdminRegisteredLostItems from '@/modules/adminpage/dashboard/views/RegisteredLostItems.vue'
import AdminOperationTime from '@/modules/adminpage/dashboard/views/OperationTime.vue'
import AdminSystemLogs from '@/modules/adminpage/dashboard/views/SystemLogs.vue'
import AdminRouteFinderSettings from '@/modules/adminpage/dashboard/views/RouteFinderSettings.vue'
import AdminBusRoutes from '@/modules/adminpage/dashboard/views/BusRoutes.vue'
import AdminBusRouteAdd from '@/modules/adminpage/dashboard/views/BusRouteAdd.vue'
import AdminBusRouteSearch from '@/modules/adminpage/dashboard/views/BusRouteSearch.vue'
import AdminBusRouteOrder from '@/modules/adminpage/dashboard/views/BusRouteOrder.vue'
import AdminBusRouteStops from '@/modules/adminpage/dashboard/views/BusRouteStops.vue'
import AdminBusStops from '@/modules/adminpage/dashboard/views/BusStops.vue'
import AdminBusStopAdd from '@/modules/adminpage/dashboard/views/BusStopAdd.vue'
import AdminBusStopSearch from '@/modules/adminpage/dashboard/views/BusStopSearch.vue'
import AdminBusStopDetail from '@/modules/adminpage/dashboard/views/BusStopDetail.vue'
import NoticeManagement from '@/modules/adminpage/dashboard/views/notice/NoticeManagement.vue'
import NoticeDetail from '@/modules/adminpage/dashboard/views/notice/NoticeDetail.vue'
import NoticeWrite from '@/modules/adminpage/dashboard/views/notice/NoticeWrite.vue'
import Dashboard from "@/modules/adminpage/dashboard/views/Dashboard.vue";
import FoundAdminList from "@/modules/lostFound/views/admin/FoundAdminList.vue";
import FoundAdminCreate from "@/modules/lostFound/views/admin/FoundAdminCreate.vue";
import FoundAdminDetail from "@/modules/lostFound/views/admin/FoundAdminDetail.vue";
import FoundAdminEdit from "@/modules/lostFound/views/admin/FoundAdminEdit.vue";
import LostAdminDetail from "@/modules/lostFound/views/admin/LostAdminDetail.vue";
import LostAdminList from "@/modules/lostFound/views/admin/LostAdminList.vue";
import LowFloorBusManagement from '@/modules/adminpage/dashboard/views/lowfloorbus/LowFloorBusManagement.vue'
import LowFloorBusDetail from '@/modules/adminpage/dashboard/views/lowfloorbus/LowFloorBusDetail.vue'
import LowFloorBusWrite from '@/modules/adminpage/dashboard/views/lowfloorbus/LowFloorBusWrite.vue'

export const adminRoutes = {
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
      component: NoticeManagement
    },
    {
      path: "notices",
      name: "NoticeManagement",
      component: NoticeManagement
    },
    {
      path: "notices/new",
      name: "NoticeWrite",
      component: NoticeWrite
    },
    {
      path: "notices/:id",
      name: "NoticeDetail",
      component: NoticeDetail
    },
    {
      path: "notices/:id/edit",
      name: "NoticeEdit",
      component: NoticeWrite
    },
    {
      path: "lowfloorbus",
      name: "LowFloorBusManagement",
      component: LowFloorBusManagement
    },
    {
      path: "lowfloorbus/new",
      name: "LowFloorBusWrite",
      component: LowFloorBusWrite
    },
    {
      path: "lowfloorbus/:id",
      name: "LowFloorBusDetail",
      component: LowFloorBusDetail
    },
    {
      path: "lowfloorbus/:id/edit",
      name: "LowFloorBusEdit",
      component: LowFloorBusWrite
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
    },
    {
      path: "bus-stops/:id",
      name: "AdminBusStopDetail",
      component: AdminBusStopDetail,
      props: true
    },
    {
      path: "bus-stops/:id/edit",
      name: "AdminBusStopEdit",
      component: () => import('@/modules/adminpage/dashboard/views/BusStopEdit.vue'),
      props: true
    },
    {
      path: "found",
      name : "FoundAdminList",
      component: FoundAdminList
    },
    {
      path: "found/create",
      name: "FoundAdminCreate",
      component: FoundAdminCreate
    },
    {
      path: "found/:id",
      name: "FoundAdminDetail",
      component: FoundAdminDetail,
      props: true
    },
    {
      path: "found/edit/:id",
      name: "FoundAdminEdit",
      component: FoundAdminEdit,
      props: true
    },
    {
      path: "lost",    // 🔥 /admin/lost
      name: "LostAdminList",
      component: LostAdminList
    },
    {
      path: "lost/:id", // 상세
      name: "LostAdminDetail",
      component: LostAdminDetail,
      props: true
    }
  ],
  meta: { requiresAuth: true }
} 