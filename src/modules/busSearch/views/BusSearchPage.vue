<template>
  <div class="sidebar-content">
    <SearchBoxWrapper/>

    <RouteResultList
        v-if="store.routeResults.length"
        :routes="store.routeResults"
        @selectRoute="selectRouteFromPath"
        @drawRoutePath="drawOrsPolyline"
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
      <BusRouteList :routes="store.busRoutes" @select="selectRoute"/>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {tryFindRoute} from "@/utils/route-search.js";
import {drawBusRouteMapORS, clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'
import {renderPopupComponent} from '@/utils/popup-mount'

import BusStopList from '../components/BusStopList.vue'
import BusRouteList from '../components/BusRouteList.vue'
import RouteResultList from '../components/RouteResultList.vue'
import SearchBoxWrapper from "@/modules/busSearch/components/SearchBoxWrapper.vue";

const store = useSearchStore()

const arrivalDataMap = ref({})
const openedStopId = ref(null)
let lastStartMarker = null
let lastEndMarker = null
let lastTransferMarker = null

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

function isSamePoint(p1, p2, epsilon = 0.00015) {
  const dx = Math.abs(parseFloat(p1.xPos ?? p1.xpos) - parseFloat(p2.xPos ?? p2.xpos))
  const dy = Math.abs(parseFloat(p1.yPos ?? p1.ypos) - parseFloat(p2.yPos ?? p2.ypos))
  return dx < epsilon && dy < epsilon
}

function drawOrsPolyline({polyline, start, end, transferStation}) {
  const map = window.leafletMap
  if (!map || !polyline?.length) return

  clearMapElements(map)

  // ❌ 이전 마커 제거
  if (lastStartMarker) {
    map.removeLayer(lastStartMarker)
    lastStartMarker = null
  }
  if (lastEndMarker) {
    map.removeLayer(lastEndMarker)
    lastEndMarker = null
  }
  if (lastTransferMarker) {
    map.removeLayer(lastTransferMarker)
    lastTransferMarker = null
  }

  const transferX = parseFloat(transferStation?.xPos ?? transferStation?.xpos)
  const transferY = parseFloat(transferStation?.yPos ?? transferStation?.ypos)

  if (transferStation && !isNaN(transferX) && !isNaN(transferY)) {
    // 🔍 환승 기준으로 경로 나누기
    let splitIndex = polyline.findIndex(p => isSamePoint(p, transferStation))

    if (splitIndex === -1) {
      let minDist = Infinity
      polyline.forEach((p, i) => {
        const dx = parseFloat(p.xPos ?? p.xpos) - parseFloat(transferStation.xPos ?? transferStation.xpos)
        const dy = parseFloat(p.yPos ?? p.ypos) - parseFloat(transferStation.yPos ?? transferStation.ypos)
        const dist = dx * dx + dy * dy
        if (dist < minDist) {
          minDist = dist
          splitIndex = i
        }
      })
    }

    if (splitIndex > 0) {
      const beforeTransfer = polyline.slice(0, splitIndex + 1)
      const afterTransfer = polyline.slice(splitIndex)

      drawBusRouteMapORS(map, beforeTransfer, 'yellowgreen')
      drawBusRouteMapORS(map, afterTransfer, 'orange')
    } else {
      console.warn('❌ splitIndex 찾기 실패 → fallback 처리됨', splitIndex)
      drawBusRouteMapORS(map, polyline, 'gray')
    }

    // 🔁 환승 마커
    const marker = L.marker([transferY, transferX], {
      icon: L.icon({
        iconUrl: '/images/transfer_icon.png',
        iconSize: [36, 36],
        iconAnchor: [15, 30]
      }),
      title: `환승지점: ${transferStation.bsNm}`
    }).addTo(map)

    marker.on('click', () => {
      bindArrivalPopup(marker, transferStation.bsId, transferStation.bsNm)
    })

    lastTransferMarker = marker
  } else {
    // 환승 없을 경우 단일 경로
    drawBusRouteMapORS(map, polyline, 'yellowgreen')
  }

  // 출발 마커
  if (start?.yPos && start?.xPos) {
    lastStartMarker = L.marker([start.yPos, start.xPos], {
      icon: L.icon({
        iconUrl: '/images/start_icon.png',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      })
    }).addTo(map).bindPopup(`출발: ${start.bsNm}`)
  }

  // 도착 마커
  if (end?.yPos && end?.xPos) {
    lastEndMarker = L.marker([end.yPos, end.xPos], {
      icon: L.icon({
        iconUrl: '/images/arrival_icon.png',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      })
    }).addTo(map).bindPopup(`도착: ${end.bsNm}`)
  }

  map.flyTo([start.yPos, start.xPos], 16)
}

function selectRouteFromPath(route) {
  const map = window.leafletMap
  if (!map) return

  if (window.customStartMarker) {
    map.removeLayer(window.customStartMarker)
    window.customStartMarker = null
  }
  if (window.customEndMarker) {
    map.removeLayer(window.customEndMarker)
    window.customEndMarker = null
  }

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


async function bindArrivalPopup(marker, bsId, bsNm) {
  try {
    const res = await axios.get('/api/bus/bus-arrival', {
      params: {bsId}
    })
    const body = res.data.body
    const items = Array.isArray(body?.items) ? body.items : body?.items ? [body.items] : []

    const arrivals = []

    items.forEach(item => {
      const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList]
      arrList.forEach(arr => {
        arrivals.push({
          routeNo: item.routeNo,
          arrState: arr.arrState,
          updn: arr.updn
        })
      })
    })

    const container = renderPopupComponent(marker, {bsId, bsNm}, arrivals)
    marker.bindPopup(container).openPopup()
  } catch (err) {
    console.error('도착 정보 조회 실패:', err)
    marker.bindPopup(`<b>${bsNm}</b><br>도착 정보 조회 실패`).openPopup()
  }
}
</script>
