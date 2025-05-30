<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
    >
      <span class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        관리자 정보 ▾
      </span>
    </button>

    <!-- Dropdown menu -->
    <div v-if="isOpen" 
      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      @click.outside="isOpen = false"
    >
      <div class="py-1" role="none">
        <div class="px-4 py-2 text-sm text-gray-700 border-b">
          <div class="font-medium">로그인 정보</div>
          <div class="mt-1">{{ username }}</div>
        </div>
        <div class="px-4 py-2 text-sm text-gray-700 border-b">
          <div class="font-medium">권한</div>
          <div class="mt-1">관리자</div>
        </div>
        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
          role="menuitem"
        >
          로그아웃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)

const username = computed(() => authStore.username || '관리자')

const handleLogout = () => {
  authStore.logout()
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style> 