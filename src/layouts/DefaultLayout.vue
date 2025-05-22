<template>
  <div class="container-fluid p-0">
    <HeaderComponent />

    <!-- 사이드바 -->
    <div
        class="sidebar-wrapper d-flex flex-column border-end"
        :class="{ 'sidebar-hidden': !isSidebarOpen }"
    >
      <SidebarComponent />
    </div>

    <!-- 토글 버튼 -->
    <button
        class="sidebar-toggle-btn"
        :class="{ 'with-sidebar': isSidebarOpen }"
        @click="toggleSidebar"
    >
      {{ isSidebarOpen ? '<' : '>' }}
    </button>

    <!-- 본문 -->
    <div class="main-content">
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '/src/layouts/components/Header/HeaderComponent.vue'
import SidebarComponent from '/src/layouts/components/Sidebar/SidebarComponent.vue'

export default {
  name: 'DefaultLayout',
  components: {
    HeaderComponent,
    SidebarComponent
  },
  data() {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
}
</script>

<style>
.sidebar-wrapper {
  width: 250px;
  background-color: #212529;
  color: white;
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
  background-color: #333;
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
  left: 250px;
}

.main-content {
  margin-left: 0;
  padding: 1rem;
}

</style>