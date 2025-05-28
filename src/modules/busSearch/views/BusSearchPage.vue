<template>
  <div class="sidebar-content">
    <SearchBox/>
    <div>
      <BusStopList
          :stops="busStops"
          :openedStopId="openedStopId"
          :arrivalDataMap="arrivalDataMap"
          @selectStop="handleStopClick"
      />
    </div>
    <BusRouteList :routes="busRoutes" @select="selectRoute"/>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {drawBusRouteMapORS, clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'

import SearchBox from '../components/SearchBox.vue'
import BusStopList from '../components/BusStopList.vue'
import BusRouteList from '../components/BusRouteList.vue'

const store = useSearchStore()

const busStops = ref([])
const busRoutes = ref([])
const arrivalDataMap = ref({})
const openedStopId = ref(null)

watch(() => store.lastSearchedKeyword, async (keyword) => {
  if (!keyword.trim()) return
  try {
    const map = window.leafletMap
    if (map) clearMapElements(map)

    const {data} = await axios.get('/api/bus/searchBSorBN', {
      params: {keyword}
    })
    busStops.value = data.busStops || []
    busRoutes.value = data.busNumbers || []
    drawBusStopMarkersWithArrival(map, busStops.value)
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
    map.setView([lat, lng], 17)

    // ✅ 기존 정류장 마커에서 해당 위치 마커 찾기
    const marker = (window.busStopMarkers || []).find(m =>
        m.getLatLng().lat === lat && m.getLatLng().lng === lng
    )
    if (marker) {
      marker.openPopup()
    }
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
            map.setView([lat, lng], 16)
          }
        }
      }))
      .catch((err) => {
        console.error('🛑 노선 데이터 조회 실패:', err)
        alert('노선 정보를 불러오는 데 실패했습니다.')
      })
}
</script>
