<template>
  <div class="bus-map-page">
    <!-- 로고 + 검색창 맵 위에 띄우기 -->
    <div class="fixed top-4 left-4 z-10 flex items-center gap-2">
      <router-link to="/" class="logo-link">
        <Logo />
      </router-link>
      <div class="search-box-wrapper w-64">
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
function handleSearch({ keyword, newStart, newEnd }) {
  if (!keyword.trim()) return

  clearMapElements(window.leafletMap)

  // ✅ 지도 클리어
  mapRef.value?.clearMapElementsForSearch?.()
  mapRef.value?.clearStartMarker?.()
  mapRef.value?.clearManualStartMarkers?.()
  mapRef.value?.clearManualEndMarkers?.()
  mapRef.value?.clearEndMarker?.()
  mapRef.value?.clearTransferMarker?.()
  mapRef.value?.clearRoutePolylines?.()

  if (newStart) store.setStartCoord(newStart)
  if (newEnd) store.setEndCoord(newEnd)

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

  const start = route.stationIds[0]
  const end = route.stationIds.at(-1)

  const startLat = parseFloat(start.ypos)
  const startLng = parseFloat(start.xpos)
  const endLat = parseFloat(end.ypos)
  const endLng = parseFloat(end.xpos)

  const newStart = { lat: startLat, lng: startLng }
  const newEnd = { lat: endLat, lng: endLng }

  // ✅ 현재 값과 비교해서 다를 때만 세팅
  if (
      !store.startCoord ||
      store.startCoord.lat !== newStart.lat ||
      store.startCoord.lng !== newStart.lng
  ) {
    store.setStartCoord(newStart)
  }

  if (
      !store.endCoord ||
      store.endCoord.lat !== newEnd.lat ||
      store.endCoord.lng !== newEnd.lng
  ) {
    store.setEndCoord(newEnd)
  }
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

.logo-link {
  display: flex;
  align-items: center;
}
</style>