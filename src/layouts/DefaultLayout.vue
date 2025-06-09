<template>
  <div class="container-fluid p-0">
    <HeaderComponent v-if="route.path !== '/bus/map'" />

    <div v-if="route.path === '/bus/map'">
      <div class="sidebar-wrapper d-flex flex-column border-end searchBox"
           :class="{ 'sidebar-hidden': !store.sidebarOpen }">
        <BusSearchPage />
      </div>

      <button class="sidebar-toggle-btn searchBox"
              :class="{ 'with-sidebar': store.sidebarOpen }"
              @click="store.toggleSidebar(!store.sidebarOpen)">
        {{ store.sidebarOpen ? '<' : '>' }}
      </button>
    </div>

    <div class="main-content p-0"
         :style="{ marginLeft: route.path === '/bus/map' && store.sidebarOpen ? '400px' : '0' }">
      <main>
        <router-view /> <!-- ✅ 여기에 반드시 router-view -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/searchStore'
import HeaderComponent from '/src/modules/adminpage/dashboard/components/Header/HeaderComponent.vue'
import BusSearchPage from '/src/modules/busSearch/views/BusSearchPage.vue'

const route = useRoute()
const store = useSearchStore()
</script>
