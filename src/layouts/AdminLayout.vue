<template>
  <div class="min-h-screen bg-gray-100 ">
    <!-- 상단 네비게이션 바 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">관리자 대시보드</h1>
            </div>
          </div>
          <div class="flex items-center">
            <AdminUserMenu />
          </div>
        </div>
      </div>
    </nav>

    <div class="flex">
      <!-- 사이드바 -->
      <AdminSidebar />

      <!-- 메인 콘텐츠 -->
      <main class="flex-1 p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from './components/AdminSidebar.vue'
import AdminUserMenu from '../components/AdminUserMenu.vue'
</script>

<style src="@/assets/tailwind.css"></style>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style> 