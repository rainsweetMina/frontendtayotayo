<template>
  <component :is="layoutComponent" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axiosInstance'

const route = useRoute()
const authStore = useAuthStore()

// ✅ setup() 실행 즉시 로그인 상태 확인
;(async () => {
  try {
    const res = await api.get('/api/user/info', { withCredentials: true })

    if (res.data?.userId) {
      authStore.login(res.data)
    } else {
      authStore.logout()
    }
  } catch (err) {
    console.error('❌ 유저 정보 가져오기 실패:', err)
    authStore.logout()
  }
})()

const layoutComponent = computed(() =>
    route.meta.layout === 'none' ? 'router-view' : DefaultLayout
)
</script>
