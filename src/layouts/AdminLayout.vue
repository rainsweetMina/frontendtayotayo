<template>
  <div class="min-h-screen bg-gray-100 ">

    <div class="flex overflow-hidden">
      <!-- 사이드바 -->
      <AdminSidebar />

      <!-- 메인 콘텐츠 -->
      <main class="flex-1 p-8 overflow-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from './components/AdminSidebar.vue'
// import AdminUserMenu from '../components/AdminUserMenu.vue'
</script>

<style src="@/assets/tailwind.css"></style>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style> 