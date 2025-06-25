<template>
  <aside class="w-64 bg-white shadow-md min-w-64 flex-shrink-0">
    <div class="flex items-center justify-center h-16 px-4 bg-gray-800">
      <h1 class="text-xl font-semibold text-white">관리자 대시보드</h1>
    </div>

    <nav class="mt-5 px-2">
      <!-- 관리자 전용 메뉴 -->
      <template v-if="auth.isAdmin">
        <!-- 대시보드 -->
        <div class="mb-4">
          <router-link to="/admin/dashboard"
                       class="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
            <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            관리자 홈
          </router-link>
        </div>

        <!-- 게시글 관리 섹션 -->
        <div class="mb-4">
          <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
            <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
            </svg>
            게시글 관리
          </div>
          <div class="space-y-1">
            <router-link
                to="/admin/notice"
                class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              공지사항 관리
            </router-link>
            <router-link
                to="/admin/lowfloorbus"
                class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              저상버스 안내 관리
            </router-link>
            <router-link
                to="/admin/qna"
                class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              Q&A 관리
            </router-link>

          </div>
        </div>
        <div class="mb-4">
          <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
            <svg class="mr-3 h-5 w-5 text-gray-500" viewBox="0 0 576 512" fill="currentColor">
              <path
                  d="M576 240c0-16.1-13-31.1-32-31.1H512V80c0-26.5-21.5-48-48-48-6.6 0-13.1 1.3-19.1 3.9L96 192H48c-26.5 0-48 21.5-48 48s21.5 48 48 48h48l348.9 156.1c6 2.6 12.5 3.9 19.1 3.9 26.5 0 48-21.5 48-48V303.1h32c19 0 32-15 32-31.1zM464 432c0 8.8-7.2 16-16 16-2.1 0-4.2-.4-6.1-1.2L96 304V208l345.9-142.8c1.9-.8 4-.2 6.1-.2 8.8 0 16 7.2 16 16v352z"/>
            </svg>
            광고
          </div>
          <div class="space-y-1">
            <router-link
                to="/admin/ad"
                class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              광고 관리
            </router-link>
            <router-link
                to="/admin/adcompany"
                class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              광고 회사 관리
            </router-link>
          </div>
        </div>
        </template>

        <!-- ✅ BUS + ADMIN 공통: 분실/습득물 관리 -->
        <template v-if="auth.isAdmin || auth.role === 'BUS'">
          <div class="mb-4">
            <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
              <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
              </svg>
              분실/습득물 관리
            </div>
            <div class="space-y-1">
              <router-link to="/admin/lost"
                           class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                분실물 관리
              </router-link>
              <router-link to="/admin/found"
                           class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                습득물 관리
              </router-link>
            </div>
          </div>
        </template>

        <!-- 버스 노선 관리 섹션 -->
        <template v-if="auth.isAdmin">
          <div class="mb-4">
            <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
              <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
              </svg>
              버스 노선 관리
            </div>
            <div class="space-y-1">
              <router-link
                  to="/bus/route/all"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                전체 노선 리스트
              </router-link>
              <router-link
                  to="/bus/route/add"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                노선 추가
              </router-link>

              <router-link
                  to="/bus/route/info"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                노선 조회
              </router-link>
            </div>
          </div>


          <!-- 정류장 관리 섹션 -->
          <div class="mb-4">
            <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
              <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              정류장 관리
            </div>
            <div class="space-y-1">
              <router-link
                  to="/admin/bus-stops"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                전체 정류장 리스트
              </router-link>
              <router-link
                  to="/admin/bus-stops/add"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                정류장 추가
              </router-link>
              <router-link
                  to="/admin/bus-stops/search"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                정류장 조회
              </router-link>
            </div>
          </div>

          <!-- 시스템 관리 섹션 -->
          <div class="mb-4">
            <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
              <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              시스템 관리
            </div>
            <div class="space-y-1">
              <router-link
                  to="/admin/operation-time"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                운행시간 관리
              </router-link>
              <router-link
                  to="/admin/system-logs"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                시스템 로그 관리
              </router-link>
              <router-link
                  to="/admin/route-finder-settings"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                길찾기 설정 관리
              </router-link>
            </div>
          </div>

          <!-- 사용자 관리 섹션 -->
          <div class="mb-4">
            <div class="px-3 py-2 text-sm font-medium text-gray-900 flex items-center">
              <svg class="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              사용자 관리
            </div>
            <div class="space-y-1">
              <router-link
                  to="/admin/user"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                유저 정보 관리
              </router-link>
              <router-link
                  to="/admin/apikey"
                  class="group flex items-center px-8 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              >
                API 키 관리
              </router-link>
            </div>
          </div>
        </template>
    </nav>
  </aside>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-50 text-gray-900;
}

a {
  text-decoration: none;
}
</style> 