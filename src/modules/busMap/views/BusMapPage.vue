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

    <div class="map-container">
      <MapView />
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
import Logo from "@/layouts/components/Header/Logo.vue";

// 상태 및 스토어
const store = useSearchStore()
const searchKeyword = ref('')
const busStops = ref([])
const busRoutes = ref([])

// 지도 요소 전역 초기화
window.routeLineLayers = []
window.routePointMarkers = []

// 검색 실행
function handleSearch(keyword) {
  if (!keyword.trim()) return;

  store.setKeyword(keyword);
  store.toggleSidebar(true);

  axios.get('/api/bus/searchBSorBN', {params: {keyword}})
      .then(({data}) => {
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

// 경로 선택 시 지도 반영
watch(() => store.selectedRoute, (route) => {
  if (!route || !Array.isArray(route.stationIds)) return
  const map = window.leafletMap
  if (!map) return

  clearMapElements(map)

  // ❗ 누적 제거
  window.routeLineLayers?.forEach(l => l.remove())
  window.routePointMarkers?.forEach(m => m.remove())
  window.routeLineLayers = []
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

  const line = L.polyline(coords.map(p => [p.lat, p.lng]), {color: 'yellowgreen', weight: 4})
  line.addTo(map)
  window.routeLineLayers.push(line)

  // 🔘 출발 마커
  const start = coords[0]
  const startMarker = L.marker([start.lat, start.lng], {icon: startIcon})
      .addTo(map).bindPopup(`출발: ${start.bsNm}`)
  window.routePointMarkers.push(startMarker)

  // 🔘 도착 마커
  const end = coords[coords.length - 1]
  const endMarker = L.marker([end.lat, end.lng], {icon: endIcon})
      .addTo(map).bindPopup(`도착: ${end.bsNm}`)
  window.routePointMarkers.push(endMarker)

  // 지도 중심 이동
  map.flyTo([start.lat, start.lng], 16)
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
}.floating-search {
   position: absolute;
   top: 20px;
   left: 20px;
   z-index: 1000;
   display: flex;
   align-items: center;

   /* ❌ 배경 제거 */
   background: none;
   padding: 0;
   border-radius: 0;
   box-shadow: none;
 }

.logo-link {
  display: flex;
  align-items: center;
}

.search-box-wrapper {
  max-width: 200px;
  flex: 1;
}
</style>