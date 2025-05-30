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

    <div class="map-container flex-grow-1">
      <MapView />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useSearchStore } from '@/stores/searchStore'
import { drawBusStopMarkersWithArrival } from '@/composables/map-utils'

import MapView from '../components/MapView.vue'
import SearchBox from '../../busSearch/components/SearchBox.vue'
import BusStopList from '../../busSearch/components/BusStopList.vue'
import BusRouteList from '../../busSearch/components/BusRouteList.vue'

// 상태 및 스토어
const store = useSearchStore()
const searchKeyword = ref('')
const busStops = ref([])
const busRoutes = ref([])

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
  window.leafletMap.setView(latlng, 16)
}

// (선택 기능: 노선 선택 시 처리 추가 가능)
const selectRoute = (route) => {
  console.log('선택된 노선:', route)
}
</script>

<style scoped>
.searchBox {
  width: 350px;
  z-index: 1080;
}
</style>
