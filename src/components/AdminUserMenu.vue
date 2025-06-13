<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
      <span class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        관리자 정보 ▾
      </span>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems 
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100"
      >
        <div class="px-4 py-2 text-sm text-gray-700">
          <div class="font-medium">로그인 정보</div>
          <div class="mt-1">{{ username }}</div>
        </div>
        <div class="px-4 py-2 text-sm text-gray-700">
          <div class="font-medium">권한</div>
          <div class="mt-1">관리자</div>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
        <button
          @click="handleLogout"
              :class="[
                active ? 'bg-gray-100 text-red-700' : 'text-red-700',
                'w-full text-left px-4 py-2 text-sm'
              ]"
        >
          로그아웃
        </button>
          </MenuItem>
      </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username || '관리자')

const handleLogout = () => {
  authStore.logout()
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}
</script>