<template>
  <nav class="bg-white py-3 shadow-md relative border-b border-gray-100">
    <div class="container mx-auto px-4 md:px-8 lg:px-12 max-w-screen-2xl flex items-center justify-between">
      <!-- 로고 - flex-shrink-0 추가하여 크기 유지 -->
      <Logo class="mr-1 sm:mr-2 flex-shrink-0" />

      <!-- 드롭다운 메뉴들 - 데스크탑에서만 표시 -->
      <div class="hidden md:flex flex-row mx-1 sm:mx-2 flex-grow">
        <NavbarDropdown id="menu1" title="버스 이용 안내" :items="busMenu" />
        <NavbarDropdown id="menu2" title="분실물 센터" :items="lostMenu" />
        <NavbarDropdown id="menu3" title="알림 마당" :items="noticeMenu" />
      </div>

      <!-- 날씨 표시 - 데스크탑에서만 표시 -->
      <div class="hidden md:flex items-center mr-1 sm:mr-2">
        <WeatherDisplay />
      </div>

      <!-- 사용자 메뉴 -->
      <div class="flex items-center">
        <!-- 모바일 메뉴 버튼 - 오른쪽으로 이동 -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden flex items-center p-1 sm:p-2 rounded-md hover:bg-gray-100 mr-1 sm:mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <UserMenu :role="auth.role" />
      </div>
    </div>

    <!-- 모바일 메뉴 -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden bg-white absolute top-full left-0 w-full shadow-md z-50 border-t border-gray-100"
    >
      <div class="container mx-auto px-4 md:px-8 lg:px-12 max-w-screen-2xl py-2">
        <!-- 모바일 메뉴 아코디언 -->
        <div v-for="(menu, index) in mobileMenus" :key="`mobile-menu-${index}`" class="border-b border-gray-100">
          <button 
            @click="toggleMobileSubmenu(index)"
            class="w-full px-4 py-3 text-left flex justify-between items-center"
          >
            <span>{{ menu.title }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="{'transform rotate-180': openMobileSubmenu === index}" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div v-show="openMobileSubmenu === index" class="bg-gray-50">
            <router-link 
              v-for="item in menu.items" 
              :key="item.label" 
              :to="item.to"
              class="block px-6 py-2 hover:bg-gray-100"
              @click="mobileMenuOpen = false"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>
        
        <!-- 모바일 날씨 표시 -->
        <div class="px-4 py-3 border-b border-gray-100">
          <WeatherDisplay />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Logo from './Logo.vue'
import NavbarDropdown from './NavbarDropdown.vue'
import WeatherDisplay from './WeatherDisplay.vue'
import UserMenu from './UserMenu.vue'

import { useAuthStore } from '@/stores/auth.js'
import { computed, ref } from 'vue'

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
  {label: '분실물 신고', to: '/lost'},
  {label: '습득물 조회', to: '/found'}
]

const noticeMenu = [
  {label: '공지사항', to: '/notice'},
  {label: '저상버스 대체안내', to: '/lowfloorbus'},
  {label: 'Q&A', to: '/qna/list'}
]

// 모바일 메뉴 상태 관리
const mobileMenuOpen = ref(false)
const openMobileSubmenu = ref(null)

// 모바일 메뉴 토글
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  openMobileSubmenu.value = null // 서브메뉴 초기화
}

// 모바일 서브메뉴 토글
const toggleMobileSubmenu = (index) => {
  openMobileSubmenu.value = openMobileSubmenu.value === index ? null : index
}

// 모바일 메뉴 데이터
const mobileMenus = [
  { title: '버스 이용 안내', items: busMenu },
  { title: '분실물 센터', items: lostMenu },
  { title: '알림 마당', items: noticeMenu }
]
</script>

<style scoped>
nav {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 모바일 메뉴 애니메이션 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모바일 메뉴 스타일 */
.md\:hidden {
  animation: slideDown 0.2s ease-out;
}
</style>
