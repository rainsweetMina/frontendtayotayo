<template>
  <div class="bus-map-page">
    <!-- 로고 + 검색창 맵 위에 띄우기 (네비게이션 바가 열리지 않았을 때만 표시) -->
    <div v-show="!store.sidebarOpen" 
         class="fixed top-4 left-4 z-[9999] flex items-center flex-nowrap gap-2.5">
      <router-link to="/" class="flex items-center">
        <Logo />
      </router-link>
      <div class="flex-1 w-[300px] max-w-none">
        <SearchBox v-model="searchKeyword" @search="handleSearch" />
      </div>
    </div>

    <div class="flex-grow w-full transition-[margin-left] duration-300 ease-in-out" 
         :class="{ 'ml-[200px]': store.sidebarOpen }">
      <MapView
          ref="mapRef"
          :onUpdateStart="coord => startCoordText = coord"
          :onUpdateEnd="coord => endCoordText = coord"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'
import {useRoute} from 'vue-router'

import MapView from '../components/MapView.vue'
import SearchBox from '../../busSearch/components/SearchBox.vue'
import Logo from "@/modules/adminpage/dashboard/components/Header/Logo.vue"

// 상태 및 스토어
const store = useSearchStore()
const route = useRoute()
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
  store.forceRouteMode = false
  if (!keyword.trim()) return

  clearMapElements(window.leafletMap)

  mapRef.value?.clearMapElementsForSearch?.()
  mapRef.value?.clearStartMarker?.()
  mapRef.value?.clearManualStartMarkers?.()
  mapRef.value?.clearManualEndMarkers?.()
  mapRef.value?.clearEndMarker?.()
  mapRef.value?.clearTransferMarker?.()
  mapRef.value?.clearRoutePolylines?.()

  if (newStart) store.setStartCoord(newStart)
  if (newEnd) store.setEndCoord(newEnd)

  store.setKeyword(keyword)
  store.toggleSidebar(true)

  axios.get('/api/bus/searchBSorBN', { params: { keyword } })
      .then(({ data }) => {
        busStops.value = data.busStops || []
        busRoutes.value = data.busNumbers || []

        drawBusStopMarkersWithArrival(window.leafletMap, busStops.value)

        const first = busStops.value[0]
        if (first?.ypos && first?.xpos) {
          const latlng = L.latLng(parseFloat(first.ypos), parseFloat(first.xpos))
          window.leafletMap.setView(latlng, 16)
        }
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

function showTransferMarker(stop) {
  const lat = parseFloat(stop.yPos ?? stop.ypos)
  const lng = parseFloat(stop.xPos ?? stop.xpos)
  if (isNaN(lat) || isNaN(lng)) return

  mapRef.value?.drawTransferMarker?.(
      { lat, lng },
      `환승지점: ${stop.bsNm}`
  )
}

// 경로 선택 시 지도 반영
watch(() => store.selectedRoute, (route) => {
  if (!route?.stationIds?.length) return

  const transferStop = route.stationIds.find(
      s => s.bsNm.replace(/\s/g, '') === route.transferStationName?.replace(/\s/g, '')
  )

  if (transferStop) {
    showTransferMarker(transferStop)
  }

  const start = route.stationIds[0]
  const end = route.stationIds.at(-1)

  const startLat = parseFloat(start.ypos)
  const startLng = parseFloat(start.xpos)
  const endLat = parseFloat(end.ypos)
  const endLng = parseFloat(end.xpos)

  const newStart = { lat: startLat, lng: startLng }
  const newEnd = { lat: endLat, lng: endLng }

  // 현재 값과 비교해서 다를 때만 세팅
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

// URL 쿼리 파라미터에서 검색어를 가져와 자동으로 검색 실행
onMounted(() => {
  const bsNmParam = route.query.bsNm
  if (bsNmParam) {
    const keyword = decodeURIComponent(bsNmParam)

    // 1. Pinia 상태 세팅
    store.setKeyword(keyword)
    searchKeyword.value = keyword

    // 2. 지도 로딩 이후 검색 실행
    setTimeout(() => {
      handleSearch({ keyword })

      if (busStops.value.length > 0) {
        const first = busStops.value[0]
        if (first?.ypos && first?.xpos) {
          const latlng = L.latLng(parseFloat(first.ypos), parseFloat(first.xpos))
          window.leafletMap.setView(latlng, 16)
        }
      }
    }, 300)
  }
})
</script>

<style scoped>
.bus-map-page {
  @apply flex h-screen overflow-hidden relative;
}
</style>