<template>
  <div class="bus-map-page">
    <!-- ✅ 로고 + 검색창 맵 위에 띄우기 -->
    <div class="floating-search top-0 start-1">
      <router-link to="/" class="logo-link">
        <Logo />
      </router-link>
      <div class="search-box-wrapper">
        <SearchBox v-model="searchKeyword" @search="handleSearch" />
      </div>
    </div>

    <div class="map-container" :class="{ 'shifted': store.sidebarOpen }">
      <MapView
          ref="mapRef"
          :onUpdateStart="coord => startCoordText = coord"
          :onUpdateEnd="coord => endCoordText = coord"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'

import MapView from '../components/MapView.vue'
import SearchBox from '../../busSearch/components/SearchBox.vue'
import Logo from "@/modules/adminpage/dashboard/components/Header/Logo.vue";

// 상태 및 스토어
const store = useSearchStore()
const searchKeyword = ref('')
const busStops = ref([])
const busRoutes = ref([])
const startCoordText = ref('')
const endCoordText = ref('')
const mapRef = ref(null)

// 지도 요소 전역 초기화
window.routeLineLayers = []
window.routePointMarkers = []

// 검색 실행
function handleSearch(keyword) {
  if (!keyword.trim()) return

  // ✅ 지도 클리어
  mapRef.value?.clearMapElementsForSearch?.()
  mapRef.value?.clearStartMarker?.()
  mapRef.value?.clearEndMarker?.()
  mapRef.value?.clearTransferMarker?.()
  mapRef.value?.clearRoutePolylines?.()

  // ✅ 검색 수행
  store.setKeyword(keyword)
  store.toggleSidebar(true)

  axios.get('/api/bus/searchBSorBN', { params: { keyword } })
      .then(({ data }) => {
        busStops.value = data.busStops || []
        busRoutes.value = data.busNumbers || []
        drawBusStopMarkersWithArrival(window.leafletMap, busStops.value)
      })
      .catch(err => {
        console.error('❌ 검색 실패:', err)
        alert('검색 중 오류가 발생했습니다.')
      })
}

// 지도 이동
const moveToStop = (stop) => {
  const latlng = L.latLng(parseFloat(stop.ypos), parseFloat(stop.xpos))
  window.leafletMap.flyTo(latlng, 16)
}

// (선택 기능: 노선 선택 시 처리 추가 가능)
const selectRoute = (route) => {
  store.setSelectedRoute(route)
}

// 경로 선택 시 지도 반영
watch(() => store.selectedRoute, (route) => {
  if (!route?.stationIds?.length) return

  const start = route.__startCoord
  const end = route.__endCoord
  if (start) store.setStartCoord(start)
  if (end) store.setEndCoord(end)
})

</script>

<style scoped>
.bus-map-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.map-container {
  flex-grow: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
}

.map-container.shifted {
  margin-left: 200px;
}

.floating-search {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;         /* ✅ 줄바꿈 방지 */
  gap: 10px;                 /* ✅ 간격 부여 */
}

.logo-link {
  margin-right: -20px;  /* ❗ 인접 요소와 붙이기 위함 */
}

.search-box-wrapper {
  flex: 1;
  width: 300px;
  max-width: none;           /* ✅ 너비 제한 해제 */
}
</style>