<template>
  <component :is="layout">
    <router-view />
  </component>
  
  <!-- 전역 로딩 오버레이 -->
  <LoadingOverlay 
    :show="globalLoading.show" 
    :message="globalLoading.message" 
  />
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

// 레이아웃 컴포넌트 불러오기
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/components/EmptyLayout.vue' // 로그인 등 헤더 없는 레이아웃

const route = useRoute()

// ✅ meta.layout이 'none'이면 빈 레이아웃, 그 외는 기본 레이아웃
const layout = computed(() => {
  return route.meta?.layout === 'none' ? EmptyLayout : DefaultLayout
})

// 전역 로딩 상태 관리
const globalLoading = reactive({
  show: false,
  message: ''
})

// 전역에서 사용할 수 있도록 window 객체에 등록
window.showGlobalLoading = (message = '데이터를 불러오는 중...') => {
  globalLoading.message = message
  globalLoading.show = true
}

window.hideGlobalLoading = () => {
  globalLoading.show = false
  globalLoading.message = ''
}
</script>

<style>
/* Tailwind CSS 우선 적용을 위한 설정 */
</style>
