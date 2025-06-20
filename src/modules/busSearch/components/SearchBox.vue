<template>
  <div class="search-box">
    <div class="flex p-2 bg-white rounded-lg shadow-md">
      <input
          type="text"
          v-model="store.keyword"
          @keydown.enter="onSearch"
          class="flex-[5] h-10 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="버스 번호/정류장 검색"
      />
      <button type="button" @click="onSearch" class="flex-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors">검색</button>
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
