<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 레이아웃 컴포넌트 불러오기
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/components/EmptyLayout.vue' // 로그인 등 헤더 없는 레이아웃

const route = useRoute()

// ✅ meta.layout이 'none'이면 빈 레이아웃, 그 외는 기본 레이아웃
const layout = computed(() => {
  return route.meta?.layout === 'none' ? EmptyLayout : DefaultLayout
})
</script>

<style>
/* Tailwind CSS 우선 적용을 위한 설정 */
</style>
