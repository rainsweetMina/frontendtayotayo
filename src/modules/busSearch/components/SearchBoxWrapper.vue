<template>
  <div class="search-wrapper p-2">
    <!-- ✅ 상단: 로고 + 토글 버튼 -->
    <div class="d-flex align-items-center justify-content-between mx-2 mt-1">
      <router-link to="/" class="logo-link">
        <Logo />
      </router-link>
      <button
          @click="toggleMode"
          class="mode-toggle-btn"
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
  </div>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue'
import {useSearchStore} from "@/stores/searchStore.js";
import BasicSearchBox from './SearchBox.vue'
import RouteSearchBox from './RouteSearchBox.vue'
import Logo from "@/modules/adminpage/dashboard/components/Header/Logo.vue";

const emit = defineEmits(['search'])
const store = useSearchStore()
const isRouteMode = ref(false)

function handleSearch(keyword) {
  store.forceRouteMode = false

  emit('search', keyword) // ❗그대로 상위로 전달만
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
</style>