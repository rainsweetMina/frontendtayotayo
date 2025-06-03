<template>
  <div class="sidebar-content">
    <SearchBoxWrapper/>

    <RouteResultList
        v-if="store.routeResults.length"
        :routes="store.routeResults"
        @selectRoute="selectRouteFromPath"
    />

    <!-- 길찾기 결과 없을 때만 정류장/노선 리스트 보여주기 -->
    <div v-else>
      <BusStopList
          :stops="store.busStops"
          :openedStopId="openedStopId"
          :arrivalDataMap="arrivalDataMap"
          @selectStop="handleStopClick"
          @selectAsStart="setStartStop"
          @selectAsEnd="setEndStop"
      />
      <BusRouteList :routes="store.busRoutes" @select="selectRoute" />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {tryFindRoute} from "@/utils/route-search.js";
import {drawBusRouteMapORS, clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'

import BusStopList from '../components/BusStopList.vue'
import BusRouteList from '../components/BusRouteList.vue'
import RouteResultList from '../components/RouteResultList.vue'
import SearchBoxWrapper from "@/modules/busSearch/components/SearchBoxWrapper.vue";

const store = useSearchStore()

const arrivalDataMap = ref({})
const openedStopId = ref(null)
let lastStartId = null
let lastEndId = null

watch(() => store.lastSearchedKeyword, async (keyword) => {
  if (!keyword.trim()) return
  try {
    const map = window.leafletMap
    if (map) clearMapElements(map)

    const {data} = await axios.get('/api/bus/searchBSorBN', {
      params: {keyword}
    })
    store.busStops = data.busStops || []
    store.busRoutes = data.busNumbers || []

    store.routeResults = []
    store.selectedRoute = null

    drawBusStopMarkersWithArrival(map, store.busStops)
  } catch (err) {
    console.error('❌ 자동 검색 실패:', err)
  }
}, {immediate: true})

async function handleStopClick(stop) {
  const bsId = stop.bsId
  openedStopId.value = bsId

  const map = window.leafletMap
  const lat = parseFloat(stop.ypos || stop.lat)
  const lng = parseFloat(stop.xpos || stop.lng)

  // ✅ 지도 이동
  if (!isNaN(lat) && !isNaN(lng)) {
    map.flyTo([lat, lng], 17)

    // ✅ 기존 정류장 마커에서 해당 위치 마커 찾기
    const marker = (window.busStopMarkers || []).find(m =>
        m.getLatLng().lat === lat && m.getLatLng().lng === lng
    )
    if (marker) marker.openPopup()
  }

  if (!arrivalDataMap.value[bsId]) {
    try {
      const {data} = await axios.get('/api/bus/bus-arrival', {
        params: {bsId}
      })
      arrivalDataMap.value[bsId] = data?.body?.items || []
    } catch (err) {
      console.error('도착 정보 조회 실패:', err)
      arrivalDataMap.value[bsId] = []
    }
  }
}

function selectRouteFromPath(route) {
  store.setSelectedRoute(route)  // 지도 반영은 mapPage.vue 쪽에서 watch로 처리
}

function setStartStop(stop) {
  store.setStartStop(stop)
  store.departure = stop.bsNm  // ✅ 인풋 연동
  store.selectingField = 'start'

  if (store.endStop) {
    store.busStops = []
    store.busRoutes = []
  }

  tryFindRoute()// 출+도착 다 선택되었을 경우 길찾기 호출
}
function setEndStop(stop) {
  store.setEndStop(stop)
  store.arrival = stop.bsNm  // ✅ 인풋 연동
  store.selectingField = 'end'

  if (store.startStop) {
    store.busStops = []
    store.busRoutes = []
  }

  tryFindRoute()
}

function selectRoute(route) {
  const routeId = route.routeId
  const map = window.leafletMap
  clearMapElements(map)

  axios.all([
    axios.get('/api/bus/bus-route', {params: {routeId}}),
    axios.get('/api/bus/bus-route-link', {params: {routeId}}),
    axios.get('/api/bus/bus-route-Bus', {params: {routeId}})
  ])
      .then(axios.spread((stopRes, linkRes, busRes) => {
        const stops = stopRes.data
        const forward = linkRes.data.forward || []
        const reverse = linkRes.data.reverse || []
        const buses = busRes.data || []

        drawBusStopMarkersWithArrival(map, stops)
        drawBusRouteMapORS(map, forward, 'pink')
        drawBusRouteMapORS(map, reverse, 'skyblue')

        // ✅ 실시간 버스 마커 찍기
        window.busLocationMarkers = []
        buses.forEach(bus => {
          const lat = parseFloat(bus.ypos || bus.lat)
          const lng = parseFloat(bus.xpos || bus.lng)

          if (!isNaN(lat) && !isNaN(lng)) {
            const isReverse = bus.moveDir === 0
            const iconUrl = isReverse
                ? '/images/bus-reverse.png'
                : '/images/bus-forward.png'

            const marker = L.marker([lat, lng], {
              icon: L.icon({
                iconUrl,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })
            }).addTo(map)

            marker.bindPopup(`🚌 ${bus.routeNo}<br>
                                방향: <strong>${isReverse ? '역방향' : '정방향'}</strong>
                              `)
            window.busLocationMarkers.push(marker)
          }
        })

        if (forward.length > 0) {
          const {yPos, xPos} = forward[0]
          const lat = parseFloat(yPos)
          const lng = parseFloat(xPos)
          if (!isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 16)
          }
        }
      }))
      .catch((err) => {
        console.error('🛑 노선 데이터 조회 실패:', err)
        alert('노선 정보를 불러오는 데 실패했습니다.')
      })
}
</script>
