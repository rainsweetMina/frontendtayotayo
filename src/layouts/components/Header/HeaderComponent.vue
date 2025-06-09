<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <Logo/>

      <!-- ✅ 모바일용: 햄버거 왼쪽에 날씨 -->
      <div class="d-flex align-items-center gap-2 d-lg-none">
        <WeatherDisplay/>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- ✅ 접히는 내비게이션 메뉴 / 나중에 수정이 필요-->
      <div class="collapse navbar-collapse mt-2 mt-lg-0 text-nowrap ps-2" id="mainNavbar">
        <!-- 드롭다운 메뉴 중앙 정렬 -->
        <ul class="navbar-nav d-flex justify-content-start w-100 flex-row flex-wrap gap-3 align-items-center">
          <NavbarDropdown id="menu1" title="버스 이용 안내" :items="busMenu"/>
          <NavbarDropdown id="menu2" title="분실물 센터" :items="lostMenu"/>
          <NavbarDropdown id="menu3" title="알림 마당" :items="noticeMenu"/>
        </ul>

        <!-- ✅ 데스크탑용: 로그인 옆에 날씨 -->
        <div class="d-flex justify-content-start justify-content-lg-end align-items-center flex-nowrap gap-2 py-2">
        <div class="d-none d-lg-block">
            <WeatherDisplay />
          </div>
        </div>
      </div>
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


<style scoped lang="scss">
@use "@/assets/web-user";
/*헤드 레이아웃 색상*/
.navbar {
  background-color: #4889cd;
  color: white;
}

.right-box {
  margin-left: auto;
  width: fit-content; /* 또는 원하는 너비 */
}

</style>
