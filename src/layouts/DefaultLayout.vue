<template>
  <div class="container-fluid p-0">
    <HeaderComponent v-if="route.path !== '/bus/map'" />

    <!--사이드바 맵 주소가 바뀐다면 수정필요-->
    <div v-if="route.path === '/bus/map'">
      <div
          class="sidebar-wrapper d-flex flex-column border-end searchBox"
          :class="{ 'sidebar-hidden': !store.sidebarOpen }"
      >
        <BusSearchPage/>
      </div>

      <!-- 토글 버튼 -->
      <button
          class="sidebar-toggle-btn searchBox"
          :class="{ 'with-sidebar': store.sidebarOpen }"
          @click="store.toggleSidebar(!store.sidebarOpen)"
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
import HeaderComponent from '/src/layouts/components/Header/HeaderComponent.vue'
import BusSearchPage from '/src/modules/busSearch/views/BusSearchPage.vue'

const route = useRoute()
const store = useSearchStore()
</script>

<style>
.searchBox {
  position: fixed;
  z-index: 2050;
}

/*시이드 바 하단부*/
.sidebar-wrapper {
  width: 400px;
  background-color: #fafaff;
  color: black;
  overflow-y: auto;
  height: calc(100vh); /* 헤더 높이만큼 제한 */
  scrollbar-width: none;
  transition: transform 0.3s ease;
}

.sidebar-wrapper::-webkit-scrollbar {
  display: none;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

/* 토글 버튼: 위치가 사이드바에 따라 같이 이동 */
.sidebar-toggle-btn {
  position: fixed;
  top: 50%;
  left: 0;
  transform: none;
  z-index: 1050;
  background-color: #4889cd; /*토큰버튼 색상*/
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 1.4rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: left 0.3s ease;
}

/* 사이드바 열려 있을 때 버튼 위치 오른쪽으로 이동 */
.sidebar-toggle-btn.with-sidebar {
  left: 400px;
}

.main-content {
  margin-left: 0;
  padding: 1rem;
}

</style>