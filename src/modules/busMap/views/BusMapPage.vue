<template>
  <div class="bus-map-page d-flex">
    <div class="searchBox">
      <!-- ✅ 항상 보이는 검색창 -->
      <SearchBox v-model="searchKeyword" @search="handleSearch" />

      <!-- ✅ 검색 결과 있을 때만 리스트 출력 -->
      <div v-if="busStops.length || busRoutes.length">
        <BusStopList :busStops="busStops" @selectStop="moveToStop" />
        <BusRouteList :routes="busRoutes" @select="selectRoute" />
      </div>
    </div>

    <!-- ✅ 지도 -->
    <div class="map-container" :class="{ 'shifted': store.sidebarOpen }">
      <MapView />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useSearchStore } from '@/stores/searchStore'
import {clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'

import MapView from '../components/MapView.vue'
import SearchBox from '../../busSearch/components/SearchBox.vue'
import BusStopList from '../../busSearch/components/BusStopList.vue'
import BusRouteList from '../../busSearch/components/BusRouteList.vue'

// 상태 및 스토어
const store = useSearchStore()
const searchKeyword = ref('')
const busStops = ref([])
const busRoutes = ref([])
window.routeLineLayers = []
window.routePointMarkers = []

// 검색 실행
function handleSearch(keyword) {
  if (!keyword.trim()) return;

  store.setKeyword(keyword);
  store.toggleSidebar(true);

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

const startIcon = L.icon({
  iconUrl: '/images/start_icon.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

const endIcon = L.icon({
  iconUrl: '/images/arrival_icon.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

const transferIcon = L.icon({
  iconUrl: '/images/transfer_icon.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
})

// 경로 선택 시 지도 반영
watch(() => store.selectedRoute, (route) => {
  if (!route || !Array.isArray(route.stationIds)) return
  const map = window.leafletMap
  if (!map) return

  clearMapElements(map)

  // ❗ 누적 제거
  window.routeLineLayers?.forEach(l => l.remove())
  window.routeLineLayers = []

  window.routePointMarkers?.forEach(m => m.remove())
  window.routePointMarkers = []

  const coords = route.stationIds
      .map(s => ({
        lat: parseFloat(s.ypos),
        lng: parseFloat(s.xpos),
        bsNm: s.bsNm,
        bsId: s.bsId
      }))
      .filter(p => !isNaN(p.lat) && !isNaN(p.lng))

  if (coords.length < 2) return

  // 🔻 선
  if (route.type === '환승' && typeof route.transferIndex === 'number') {
    const firstLeg = coords.slice(0, route.transferIndex + 1)
    const secondLeg = coords.slice(route.transferIndex)

    const firstLine = L.polyline(firstLeg.map(p => [p.lat, p.lng]), { color: 'green', weight: 4 })
    const secondLine = L.polyline(secondLeg.map(p => [p.lat, p.lng]), { color: 'orange', weight: 4, dashArray: '6, 6' })

    firstLine.addTo(map)
    secondLine.addTo(map)

    window.routeLineLayers.push(firstLine, secondLine)

    const tp = coords[route.transferIndex]
    const transferMarker = L.marker([tp.lat, tp.lng], { icon: transferIcon })
        .addTo(map).bindPopup(`🔁 환승지점: ${tp.bsNm}`)
    window.routePointMarkers.push(transferMarker)
  } else {
    const line = L.polyline(coords.map(p => [p.lat, p.lng]), { color: 'green', weight: 4 })
    line.addTo(map)
    window.routeLineLayers.push(line)
  }

  // 🔘 출발 마커
  const start = coords[0]
  const startMarker = L.marker([start.lat, start.lng], { icon: startIcon })
      .addTo(map).bindPopup(`출발: ${start.bsNm}`)
  window.routePointMarkers.push(startMarker)

  // 🔘 도착 마커
  const end = coords[coords.length - 1]
  const endMarker = L.marker([end.lat, end.lng], { icon: endIcon })
      .addTo(map).bindPopup(`도착: ${end.bsNm}`)
  window.routePointMarkers.push(endMarker)

  // 지도 중심 이동
  map.flyTo([start.lat, start.lng], 16)
})

</script>

<style scoped>
.searchBox {
  width: 350px;
  z-index: 1080;
}

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
</style>
