<template>
  <div class="w-full p-2">
    <!-- ✅ 상단: 로고 + 토글 버튼 -->
    <div class="flex items-center justify-between mx-2 mt-1">
      <router-link to="/" class="flex items-center">
        <Logo />
      </router-link>
      <button
          @click="toggleMode"
          class="w-[42px] h-[42px] rounded-full border-none bg-gradient-to-br from-white to-gray-100 shadow-md text-xl text-blue-600 flex justify-center items-center transition-all hover:bg-gray-50 hover:scale-105"
          :title="isRouteMode ? '일반 검색' : '경로 검색'"
      >
        <i :class="isRouteMode ? 'fas fa-magnifying-glass' : 'fas fa-location-dot'"></i>
      </button>
    </div>

    <!-- ✅ 검색창: 인풋 한 줄만 아래에 배치 -->
    <div>
      <BasicSearchBox v-if="!isRouteMode" @search="handleSearch" />
      <RouteSearchBox v-else />
    </div>
    
    <!-- 최근 검색어 표시 영역 -->
    <div v-if="!isRouteMode && store.recentSearches.length > 0" class="recent-searches my-1 px-2">
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-sm font-medium text-gray-600">최근 검색</h3>
        <button @click="store.clearRecentSearches()" class="text-xs text-gray-500 hover:text-gray-700">전체 삭제</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(search, index) in store.recentSearches" 
          :key="index" 
          class="recent-search-item"
        >
          <span @click="useRecentSearch(search)" class="cursor-pointer">{{ search }}</span>
          <button @click="store.removeFromRecentSearches(search)" class="delete-btn ml-1">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, ref, watch, onMounted} from 'vue'
import {useSearchStore} from "@/stores/searchStore.js";
import BasicSearchBox from './SearchBox.vue'
import RouteSearchBox from './RouteSearchBox.vue'
import Logo from "@/modules/adminpage/dashboard/components/Header/Logo.vue";

const emit = defineEmits(['search'])
const store = useSearchStore()
const isRouteMode = ref(false)

// 컴포넌트 마운트 시 로컬 스토리지에서 최근 검색어 로드
onMounted(() => {
  store.loadRecentSearchesFromCache()
})

function handleSearch(keyword) {
  store.forceRouteMode = false
  emit('search', keyword) // ❗그대로 상위로 전달만
}

// 최근 검색어 클릭 시 검색 실행
function useRecentSearch(keyword) {
  store.keyword = keyword
  store.commitSearch()
}

function toggleMode() {
  isRouteMode.value = !isRouteMode.value

  store.isRouteSearchMode = isRouteMode.value

  // ✅ 모든 입력 필드 초기화
  store.keyword = ''
  store.departure = ''
  store.arrival = ''
  store.lastSearchedKeyword = ''
  store.routeResults = []
  store.busStops = []
  store.busRoutes = []
  store.startStop = null
  store.endStop = null
}

watch(() => store.forceRouteMode, async (val) => {
  if (val === true) {
    isRouteMode.value = true
    store.isRouteSearchMode = true
    await nextTick()
    store.forceRouteMode = null
  } else if (val === false) {
    isRouteMode.value = false
    store.isRouteSearchMode = false
    store.forceRouteMode = null
  }
})
</script>

<style scoped>
.search-wrapper {
  width: 100%;
}

.logo-link {
  display: flex;
  align-items: center;
}

.mode-toggle-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s, transform 0.2s;
}

.mode-toggle-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.mode-toggle-btn i {
  pointer-events: none;
}

.recent-searches {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
}

.recent-search-item {
  display: inline-flex;
  align-items: center;
  background-color: #e9ecef;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: #495057;
  transition: background-color 0.2s;
}

.recent-search-item:hover {
  background-color: #dee2e6;
}

.delete-btn {
  color: #adb5bd;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 2px;
}

.delete-btn:hover {
  color: #495057;
}

.recent-searches {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

</style>