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
import { onMounted, watch } from 'vue'

const store = useSearchStore()
const emit = defineEmits(['search'])

// 컴포넌트 마운트 시 캐시에서 최근 검색어 로드
onMounted(() => {
  store.loadRecentSearchesFromCache()
  
  // 마운트 시 검색어가 이미 있다면 자동 검색 실행
  if (store.keyword.trim()) {
    onSearch()
  }
})

// store.keyword가 변경될 때 자동 검색 실행 (URL 쿼리 파라미터로부터 설정된 경우)
watch(() => store.keyword, (newKeyword, oldKeyword) => {
  // URL 쿼리 파라미터로부터 설정된 경우에만 자동 검색 실행
  // (oldKeyword가 없고 newKeyword가 있는 경우)
  if (!oldKeyword && newKeyword && newKeyword.trim()) {
    // 검색 실행
    console.log('자동 검색 실행:', newKeyword);
    onSearch();
  }
}, { immediate: true });

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
