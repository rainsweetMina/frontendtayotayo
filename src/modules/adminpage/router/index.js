import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminDashboard from '@/modules/adminpage/dashboard/views/AdminDashboard.vue'
import AdminNotice from '@/modules/adminpage/dashboard/views/notice/Notice.vue'
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
import AdminAdList from '@/modules/ad/views/ad/adList.vue'
import AdminAdCreate from '@/modules/ad/views/ad/adCreate.vue'
import BusRouteAllView from "@/modules/busRoute/views/BusRouteAllView.vue";
import BusRouteAddView from "@/modules/busRoute/views/BusRouteAddView.vue";
import BusRouteInfoView from "@/modules/busRoute/views/BusRouteInfoView.vue";
import BusRouteEditView from "@/modules/busRoute/views/BusRouteEditView.vue";
import UserListView from "@/modules/adminpage/dashboard/views/UserListView.vue";
import UserApiKeyManagementView from "@/modules/adminpage/dashboard/views/UserApiKeyManagementView.vue";

// 광고 회사 관리 컴포넌트들
import AdCompanyList from '@/modules/ad/views/adcompany/adCompanyList.vue'
import AdCompanyCreate from '@/modules/ad/views/adcompany/adCompanyCreate.vue'
import AdCompanyEdit from '@/modules/ad/views/adcompany/adCompanyEdit.vue'
import AdCompanyDetail from '@/modules/ad/views/adcompany/adCompanyDetail.vue'

// 광고 관리 컴포넌트들
import AdDetail from '@/modules/ad/views/ad/adDetail.vue'

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
      path: "ad",
      name: "AdminAdList",
      component: AdminAdList
    },
    {
      path: "ad/create",
      name: "AdminAdCreate",
      component: AdminAdCreate
    },
    {
      path: "ad/:id",
      name: "AdminAdDetail",
      component: AdDetail,
      props: true
    },
    {
      path: "ad/edit/:id",          // ✅ /admin/ad/edit/:id
      name: "AdminAdEdit",
      component: AdminAdCreate,
      props: true
    },
    {
      path: "ad/extend/:id",
      name: "AdminAdExtend",
      component: () => import('@/modules/ad/views/ad/AdExtendPage.vue'),
      props: true
    },
    // 광고 회사 관리 라우터 추가
    {
      path: "adcompany",
      name: "AdCompanyList",
      component: AdCompanyList
    },
    {
      path: "adcompany/create",
      name: "AdCompanyCreate",
      component: AdCompanyCreate
    },
    {
      path: "adcompany/:id",
      name: "AdCompanyDetail",
      component: AdCompanyDetail,
      props: true
    },
    {
      path: "adcompany/edit/:id",
      name: "AdCompanyEdit",
      component: AdCompanyEdit,
      props: true
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
    },
    {
      path: '/bus/route/all',
      name: 'BusRouteAllView',
      // component: () => import('../views/BusRouteAllView.vue'),
      component: BusRouteAllView,
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/bus/route/add',
      name: 'BusRouteAddView',
      component: BusRouteAddView,
      meta: { requiresAuth: true, role: 'ADMIN' },
    },
    {
      path: '/bus/route/info',
      name: 'BusRouteInfoView',
      component: BusRouteInfoView,
      meta: { requiresAuth: true, role: 'ADMIN' },
      props: true
    },
    {
      path: '/bus/route/info/:routeId',
      name: 'RouteEdit',
      component: BusRouteEditView,
      meta: { requiresAuth: true, role: 'ADMIN' },
      props: true
    },
    {
      path: '/admin/user',
      name: 'AdminUserList',
      component: UserListView,
      meta: { requiresAuth: true, adminOnly: true }
    },
    {
      path: '/admin/apikey',
      name: 'AdminApiKeyManagement',
      component: UserApiKeyManagementView,
      meta: { requiresAuth: true, adminOnly: true }
    },
    // QnA 관리
    {
      path: 'qna',
      name: 'AdminQnaList',
      component: () => import('@/modules/qna/admin/QnaList.vue')
    },
    {
      path: 'qna/:id/answer',
      name: 'AdminQnaAnswerWrite',
      component: () => import('@/modules/qna/admin/QnaAnswerWrite.vue')
    },
    {
      path: 'qna/:id/edit',
      name: 'AdminQnaAnswerEdit',
      component: () => import('@/modules/qna/admin/QnaAnswerEdit.vue')
    },
    {
      path: 'qna/:id',
      name: 'AdminQnaDetail',
      component: () => import('@/modules/qna/admin/QnaDetail.vue')
    },
  ],
  meta: { requiresAuth: true }
}
