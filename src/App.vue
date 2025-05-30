<template>
  <DefaultLayout v-if="layout !== 'none'">
    <router-view />
  </DefaultLayout>
  <router-view v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')

// ✅ 로그인 상태 복원
const auth = useAuthStore()

onMounted(async () => {
  try {
    const res = await axios.get('/api/user/info', { withCredentials: true })
    const user = res.data
    auth.login({
      role: user.role,
      username: user.username,
      userId: user.userId,
      email: user.email
    })
  } catch (err) {
    console.warn('❌ 로그인 상태 아님 또는 오류:', err)
    // 로그인 안 되어 있거나 세션 없음
  }
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
}
</style>
