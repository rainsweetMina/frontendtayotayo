<template>
  <nav class="bg-white py-3 shadow-md relative border-b border-gray-100">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- 로고 -->
      <Logo class="mr-3" />

      <!-- 드롭다운 메뉴들 - 항상 표시 -->
      <div class="flex flex-row mx-3 flex-grow">
        <NavbarDropdown id="menu1" title="버스 이용 안내" :items="busMenu" />
        <NavbarDropdown id="menu2" title="분실물 센터" :items="lostMenu" />
        <NavbarDropdown id="menu3" title="알림 마당" :items="noticeMenu" />
      </div>

      <!-- 날씨 표시 -->
      <div class="flex items-center mr-4">
        <WeatherDisplay />
      </div>

      <!-- 사용자 메뉴 -->
      <UserMenu :role="auth.role" />
    </div>
  </nav>
</template>

<script setup>
import Logo from './Logo.vue'
import NavbarDropdown from './NavbarDropdown.vue'
import WeatherDisplay from './WeatherDisplay.vue'
import UserMenu from './UserMenu.vue'

import { useAuthStore } from '@/stores/auth.js'
import { computed } from 'vue'

const auth = useAuthStore()
const role = computed(() => auth.role)

// ✅ computed로 역할 체크
const isUser = computed(() => auth.role === 'USER')
const isAdmin = computed(() => auth.role === 'ADMIN')
const isAuthenticated = computed(() => !!auth.role)

const logout = () => {
  auth.logout()
}

// 드롭다운 메뉴들
const busMenu = [
  {label: '버스 요금', to: '/fare'},
  {label: '버스 운행 시간표', to: '/schedule'},
  {label: '저상버스 시간표', to: '/low-schedule'},
  {label: '정류장 조회', to: '/bus-info'},
  {label: '버스 회사 조회', to: '/bus-company'}
]

const lostMenu = [
  {label: '분실물 조회', to: '/lost'}
]

const noticeMenu = [
  {label: '공지사항', to: '/notice'},
  {label: 'Q&A', to: '/qna/list'}
]
</script>

<style scoped>
/* 모바일 화면에서 메뉴 조정 */
@media (max-width: 768px) {
  nav > div {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 0 0.75rem;
  }
}

nav {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
