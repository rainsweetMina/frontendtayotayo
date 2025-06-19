<template>
  <div class="container-fluid p-0">
    <!-- /bus/map 경로가 아닐 때만 헤더 보이기 -->
    <HeaderComponent v-if="route.path !== '/bus/map'"/>

    <!-- /bus/map 경로일 때만 사이드바, 토글 버튼 보이기 -->
    <div v-if="route.path === '/bus/map'">
      <div
          class="sidebar-wrapper d-flex flex-column border-end searchBox"
          :class="{ 'sidebar-hidden': !store.sidebarOpen }"
      >
        <BusSearchPage/>
      </div>

      <button
          class="sidebar-toggle-btn"
          :class="{ 'with-sidebar': store.sidebarOpen }"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
      >
        {{ store.sidebarOpen ? '<' : '>' }}
      </button>
    </div>

    <!-- 본문 -->
    <div class="main-content p-0">
      <main>
        <slot/>
      </main>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {useSearchStore} from '@/stores/searchStore'
import HeaderComponent from '/src/modules/adminpage/dashboard/components/Header/HeaderComponent.vue'
import BusSearchPage from '/src/modules/busSearch/views/BusSearchPage.vue'

const route = useRoute()
const store = useSearchStore()

// 사이드바 토글 함수
const toggleSidebar = () => {
  store.toggleSidebar(!store.sidebarOpen)
}
</script>

<style scoped>
.searchBox {
  position: fixed;
  z-index: 1000;
}

/* 사이드바 */
.sidebar-wrapper {
  width: 400px;
  background-color: #ffffff;
  color: black;
  overflow-y: auto;
  height: 100vh;
  scrollbar-width: none;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  top: 0;
  left: 0;
}

/* 상단 여백 */
.sidebar-top-spacer {
  height: 80px; /* 상단 검색창 높이만큼 여백 추가 */
}

.sidebar-wrapper::-webkit-scrollbar {
  display: none;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

/* 토글 버튼 */
.sidebar-toggle-btn {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 9999; /* 최상단에 표시 */
  background-color: #ffffff;
  color: #333;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 1.4rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: left 0.3s ease, background-color 0.2s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-btn.with-sidebar {
  left: 400px;
}

.sidebar-toggle-btn:hover {
  background-color: #f8f9fa;
}

/* 본문 영역 */
.main-content {
  padding: 1rem;
  transition: margin-left 0.3s ease;
}
</style>
