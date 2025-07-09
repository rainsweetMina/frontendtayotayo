<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import {computed, onErrorCaptured} from 'vue'
import {useRoute} from 'vue-router'

// 레이아웃 컴포넌트 불러오기
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/components/EmptyLayout.vue' // 로그인 등 헤더 없는 레이아웃

const route = useRoute()

// ✅ meta.layout이 'none'이면 빈 레이아웃, 그 외는 기본 레이아웃
const layout = computed(() => {
  return route.meta?.layout === 'none' ? EmptyLayout : DefaultLayout
})

// 에러 캐치 핸들러
onErrorCaptured((err, instance, info) => {
  console.warn('App.vue 에러 캐치:', err.message)

  // 라우터 주입 에러는 무시
  if (err.message && err.message.includes('injection "Symbol(router)" not found')) {
    return false // 에러 전파 중단
  }

  // withDirectives 에러는 무시
  if (err.message && err.message.includes('withDirectives can only be used inside render functions')) {
    return false // 에러 전파 중단
  }

  return true // 다른 에러는 전파
})
</script>

<style>
/* Tailwind CSS 우선 적용을 위한 설정 */
</style>
