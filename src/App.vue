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
