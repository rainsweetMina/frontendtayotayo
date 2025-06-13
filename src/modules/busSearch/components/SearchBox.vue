<template>
  <div class="search-box">
    <div class="flex p-3">
      <input
          type="text"
          v-model="store.keyword"
          @keydown.enter="onSearch"
          class="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="버스 번호/정류장 검색"
      />
      <button 
          @click="onSearch" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors duration-200"
      >검색</button>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/searchStore'
const store = useSearchStore()
const emit = defineEmits(['search'])

function onSearch() {
  if (!store.keyword.trim()) return

  store.forceRouteMode = false

  emit('search', {
    keyword: store.keyword,
    newStart: store.startCoord,
    newEnd: store.endCoord
  })
  store.commitSearch()
  store.toggleSidebar(true)
}
</script>

<style scoped>
/* Tailwind CSS 클래스로 대체 */
</style>
