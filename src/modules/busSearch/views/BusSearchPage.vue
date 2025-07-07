<template>
  <div class="sidebar-content">
    <SearchBoxWrapper/>

    <RouteResultList
        v-if="store.routeResults.length && !isLoadingRoutes"
        :routes="store.routeResults"
        :selectedRouteId="store.selectedRoute?.routeId"
        @selectRoute="selectRouteFromPath"
        @drawRoutePath="drawOrsPolyline"
    />

    <!-- 길찾기 결과 없을 때만 정류장/노선 리스트 보여주기 -->
    <div v-else-if="!isLoadingRoutes">
      <RecentFavorites
          v-if="isLoggedIn && !store.routeResults.length && !store.isRouteSearchMode"
          :stops="recentStops"
          :openedStopId="openedStopId"
          :arrivalDataMap="arrivalDataMap"
          :isFavorited="isFavorited"
          :toggleFavorite="handleToggleFavorite"
          @selectStop="handleStopClick"
          @selectAsStart="setStartStop"
          @selectAsEnd="setEndStop"
      />

      <BusStopList
          :stops="store.busStops"
          :openedStopId="openedStopId"
          :arrivalDataMap="arrivalDataMap"
          :isFavorited="isFavorited"
          :toggleFavorite="toggleFavorite"
          @selectStop="handleStopClick"
          @selectAsStart="setStartStop"
          @selectAsEnd="setEndStop"
      />
      <BusRouteList :routes="store.busRoutes" @select="selectRoute"/>
    </div>
    <div v-else>
      <p class="text-center text-gray-500 mt-4">🔄 경로 탐색 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import startIcon from '@/assets/icons/start_icon.png'
import arrivalIcon from '@/assets/icons/arrival_icon.png'

import {ref, watch, onMounted, computed} from 'vue'
import { debounce } from 'lodash'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {useSearchStore} from '@/stores/searchStore'
import {tryFindRoute} from "@/utils/route-search.js";
import {drawBusRouteMapORS, clearMapElements, drawBusStopMarkersWithArrival} from '@/composables/map-utils'
import {renderPopupComponent} from '@/utils/popup-mount'
import {useMapMarkers} from "@/modules/busMap/composables/useMapMarkers.js";
import {useStopArrival} from '../composables/useStopArrival.js'
import {useFavoriteBusStop} from '../composables/useFavoriteBusStop.js'
import {useUserInfo} from '@/modules/mypage/composables/useUserInfo'
import {getSortedArrivalsFromApi} from "@/composables/arrival-utils.js";

import BusStopList from '../components/BusStopList.vue'
import BusRouteList from '../components/BusRouteList.vue'
import RouteResultList from '../components/RouteResultList.vue'
import SearchBoxWrapper from "../components/SearchBoxWrapper.vue";
import RecentFavorites from "../components/RecentFavorites.vue";

const router = useRouter()
const store = useSearchStore()

const isLoadingRoutes = ref(false)
const arrivalDataMap = ref({})
const openedStopId = ref(null)
const {handleStopClick} = useStopArrival(arrivalDataMap, openedStopId)
const {isLoggedIn, fetchUserInfo, isLoading} = useUserInfo()

const map = ref(window.leafletMap)
const markerFns = useMapMarkers(map)
let lastStartMarker = null
let lastEndMarker = null
let lastTransferMarker = null

const {
  toggleFavorite,
  isFavorited,
  fetchFavorites,
  getRecentFavorites,
  favoriteStops
} = useFavoriteBusStop()

onMounted(async () => {
  await fetchUserInfo()
  await waitUntilUserLoaded()

  if (isLoggedIn.value) {
    await fetchFavorites()
  }
})

const waitUntilUserLoaded = async () => {
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return true
}

const handleToggleFavorite = async (stop) => {
  if (!isLoggedIn.value) {
    if (confirm('로그인이 필요한 기능입니다. 로그인하시겠습니까?')) {
      window.location.href = '/login'
    }
    return
  }
  await toggleFavorite(stop)
}

const recentStops = ref([])

watch(favoriteStops, (newVal) => {
  recentStops.value = [...(newVal || [])]
      .sort((b, a) => new Date(b.createdAt) - new Date(a.createdAt))
      .reverse()
      .slice(0, 3)
})
/*-----여기까지 즐겨찾기------*/
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
  if (!markerFns.value) {
    markerFns.value = useMapMarkers(ref(map))
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
    const marker = markerFns.value?.drawTransferMarker?.(
        {lat: transferY, lng: transferX},
        `환승지점: ${transferStation.bsNm}`
    )

    if (marker) {
      marker.on('click', () => {
        bindArrivalPopup(marker, transferStation.bsId, transferStation.bsNm)
      })
    }
  } else {
    // 환승 없을 경우 단일 경로
    drawBusRouteMapORS(map, polyline, 'yellowgreen')
  }

  // 출발 마커
  if (start?.yPos && start?.xPos) {
    lastStartMarker = L.marker([start.yPos, start.xPos], {
      icon: L.icon({
        iconUrl: startIcon,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      })
    }).addTo(map).bindPopup(`출발: ${start.bsNm}`)
  }

  // 도착 마커
  if (end?.yPos && end?.xPos) {
    lastEndMarker = L.marker([end.yPos, end.xPos], {
      icon: L.icon({
        iconUrl: arrivalIcon,
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

  api.all([
    api.get('/api/bus/bus-route', {params: {routeId}}),
    api.get('/api/bus/bus-route-link', {params: {routeId}}),
    api.get('/api/bus/bus-route-Bus', {params: {routeId}})
  ])
      .then(api.spread((stopRes, linkRes, busRes) => {
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
                ? '/images/bus-reverse-solid.svg'
                : '/images/bus-forward-solid.svg'

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
    const arrivals = await getSortedArrivalsFromApi(bsId)
    const stop = store.busStops.find(s => s.bsId === bsId) || { bsId, bsNm }
    const container = renderPopupComponent(marker, stop, arrivals)
    marker.bindPopup(container).openPopup()
  } catch (err) {
    console.error('도착 정보 조회 실패:', err)
    marker.bindPopup(`<b>${bsNm}</b><br>도착 정보 조회 실패`).openPopup()
  }
}

watch(() => store.lastSearchedKeyword, debounce(async (keyword) => {
  if (!keyword.trim()) return
  try {
    const map = window.leafletMap
    if (map) clearMapElements(map)

    const {data} = await api.get('/api/bus/searchBSorBN', {
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
}, 300), { immediate: true })
</script>
