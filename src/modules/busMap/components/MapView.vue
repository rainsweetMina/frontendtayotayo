<template>
  <div id="map" ref="mapRef" class="leaflet-map"></div>

  <!-- 현재 위치 버튼 추가 -->
  <button
    @click="moveToCurrentLocation"
    class="absolute bottom-8 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
  >
    <i class="fas fa-location-dot"></i>
  </button>

  <ContextMenu
      v-if="contextMenu.visible"
      :position="contextMenu.position"
      :coords="contextMenu.coords"
      @selectAsStart="selectAsStart"
      @selectAsEnd="selectAsEnd"
  />
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch, nextTick} from 'vue'
import L from 'leaflet'
import axios from 'axios'
import ContextMenu from './ContextMenu.vue'
import {useSearchStore} from '@/stores/searchStore'
import {drawBusRouteMapORS} from '@/composables/map-utils'
import {useMapInit} from "@/modules/busMap/composables/useMapInit.js";
import {useContextMenu} from '@/modules/busMap/composables/useContextMenu'
import { useMapMarkers } from '@/modules/busMap/composables/useMapMarkers'
import { useAutoRoute } from '@/modules/busMap/composables/useAutoRoute'
import {getSortedArrivalsFromApi} from "@/composables/arrival-utils.js";
import {renderPopupComponent} from "@/utils/popup-mount.js";


const props = defineProps({
  routeId: String,
  onUpdateStart: Function,
  onUpdateEnd: Function
})

const mapRef = ref(null)
const map = ref(null)
const store = useSearchStore()

const startCoord = ref(null)
const endCoord = ref(null)
const startMarker = ref(null)
const endMarker = ref(null)
const transferMarker = ref(null)
const routePolyline = ref(null)
const busMarkers = ref([])
const intervalId = ref(null)
let drawTransferMarker = null

const { tryAutoRouteFromCoords } = useAutoRoute(store)

let {
  drawManualStartMarker,
  drawManualEndMarker,
  drawStartMarker,
  drawEndMarker,
  clearManualStartMarkers,
  clearManualEndMarkers,
  clearStartMarker,
  clearEndMarker,
  clearTransferMarker,
  removeAllMarkersAtCoord,
  clearAllStartMarkers,
  clearManualMarkers,
  clearAutoMarkers
} = useMapMarkers(map)

const {
  contextMenu,
  handleRightClick,
  handleTouchStart,
  handleTouchEnd,
  hideContextMenu
} = useContextMenu(mapRef, map)

// 현재 위치로 이동하는 함수 추가
function moveToCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      if (map.value && map.value._loaded) {
        map.value.flyTo([lat, lng], 16)
      }
    }, err => {
      console.error('위치 정보를 가져오는데 실패했습니다:', err)
      alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.')
    })
  } else {
    alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.')
  }
}

function selectAsStart(coords) {
  clearAutoMarkers()
  clearRoutePolylines()
  removeAllMarkersAtCoord(coords)
  store.routeResults = []

  startCoord.value = coords
  drawManualStartMarker(coords)

  if (store.setStartCoordText) {
    store.setStartCoordText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
    store.startCoord = coords
  }

  contextMenu.value.visible = false
  tryAutoRouteFromCoords(coords, endCoord.value)
}

function selectAsEnd(coords) {
  clearAutoMarkers()
  clearRoutePolylines()
  store.routeResults = []

  endCoord.value = coords
  drawManualEndMarker(coords)

  if (store.setEndCoordText) {
    store.setEndCoordText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
    store.endCoord = coords
  }

  contextMenu.value.visible = false
  tryAutoRouteFromCoords(startCoord.value, coords)
}

function clearBusMarkers() {
  busMarkers.value.forEach(marker => {
    if (map.value.hasLayer(marker)) {
      map.value.removeLayer(marker)
    }
  })
  busMarkers.value = []
}

function clearRoutePolylines() {
  if (window.routePolylines) {
    window.routePolylines.forEach(l => map.value.removeLayer(l))
    window.routePolylines = []
  }
}

function clearMapElementsForSearch() {
  clearManualMarkers()
  clearAutoMarkers()
  clearRoutePolylines()
  clearTransferMarker()
}

defineExpose({
  drawTransferMarker,
  clearTransferMarker,
  clearRoutePolylines,
  clearMapElementsForSearch
})

async function fetchBusLocations() {
  if (!props.routeId) return

  try {
    const res = await axios.get(`/api/bus/bus-route-Bus?routeId=${props.routeId}`)
    clearBusMarkers()

    const locations = res.data.busLocationList || []
    locations.forEach(loc => {
      const marker = L.circleMarker([loc.yPos, loc.xPos], {
        radius: 8,
        color: loc.moveDir === 0 ? 'skyblue' : 'yellow',
        fillOpacity: 0.9
      }).addTo(map.value)

      busMarkers.value.push(marker)
    })
  } catch (err) {
    console.error('🚨 실시간 위치 호출 실패:', err)
  }
}

function handleSelectedRoute(route) {
  clearManualMarkers()
  clearAutoMarkers()
  clearRoutePolylines()

  if (
      !route ||
      route.type !== '환승' ||
      !route.transferStationName ||
      !route.stationIds?.length
  ) return

  const transferStop = route.stationIds.find(s =>
      s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, '')
  )
  if (!transferStop) return

  const lat = parseFloat(transferStop.yPos ?? transferStop.ypos)
  const lng = parseFloat(transferStop.xPos ?? transferStop.xpos)
  if (isNaN(lat) || isNaN(lng)) return

  const marker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: transferIcon,
      iconSize: [36, 36],
      iconAnchor: [15, 30]
    }),
    title: '환승지점: ' + transferStop.bsNm
  }).addTo(map.value)

  transferMarker.value = marker
  window.transferMarker = marker // 외부 참조 위해 유지

  const allStations = route.stationIds
  const transferIdx = allStations.findIndex(s =>
      s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, '')
  )

  if (transferIdx > 0) {
    drawBusRouteMapORS(map.value, allStations.slice(0, transferIdx + 1), 'yellowgreen')
    drawBusRouteMapORS(map.value, allStations.slice(transferIdx), 'orange')
  } else {
    drawBusRouteMapORS(map.value, allStations, 'gray')
  }

  marker.on('click', async () => {
    try {
      const arrivals = await getSortedArrivalsFromApi(transferStop.bsId)
      const popup = renderPopupComponent(marker, transferStop, arrivals)
      marker.bindPopup(popup).openPopup()
    } catch (err) {
      marker.bindPopup(`<b>${transferStop.bsNm}</b><br>도착 정보 조회 실패`).openPopup()
      console.error('도착 정보 실패:', err)
    }
  })
}

onMounted(() => {
  // 지도 초기화
  map.value = useMapInit(mapRef)
  window.leafletMap = map.value

  // ✅ 마커 기능 로딩 (예: 환승 마커 등)
  const markerFns = useMapMarkers(map)
  drawTransferMarker = markerFns.drawTransferMarker

  // ✅ 컨텍스트 메뉴 및 터치 관련 DOM 이벤트 리스너 등록
  mapRef.value.addEventListener('contextmenu', handleRightClick)
  mapRef.value.addEventListener('touchstart', handleTouchStart)
  mapRef.value.addEventListener('touchend', handleTouchEnd)

  // ✅ 지도 클릭 시 컨텍스트 메뉴 숨기기 (Leaflet 방식 권장)
  map.value.on('click', hideContextMenu)
})

onBeforeUnmount(() => {
  clearInterval(intervalId.value)
  clearAutoMarkers()
  clearManualMarkers()

  // 이벤트 리스너 제거
  mapRef.value.removeEventListener('contextmenu', handleRightClick)
  mapRef.value.removeEventListener('touchstart', handleTouchStart)
  mapRef.value.removeEventListener('touchend', handleTouchEnd)

  if (map.value) {
    map.value.off('click', hideContextMenu)
  }

  if (window.transferMarker) {
    map.value.removeLayer(window.transferMarker)
    window.transferMarker = null
  }

  if (window.routePolylines) {
    window.routePolylines.forEach(l => map.value.removeLayer(l))
    window.routePolylines = []
  }

  busMarkers.value.forEach(m => map.value.removeLayer(m))
  busMarkers.value = []
})

watch(() => store.startCoord, (coord) => {
  if (store.autoTriggered?.startMarker) {
    drawStartMarker(coord)
    store.autoTriggered.startMarker = false
  }
})

watch(() => store.endCoord, (coord) => {
  if (store.autoTriggered?.endMarker) {
    drawEndMarker(coord)
    store.autoTriggered.endMarker = false
  }
})

watch(
    () => [store.startCoord, store.endCoord],
    async ([start, end]) => {
      if (!start || !end) return
      await tryAutoRouteFromCoords(start, end)
    },
    { deep: true }
)

watch(() => store.sidebarOpen, (val) => {
})

watch(
    () => props.routeId,
    () => {
      fetchBusLocations()
    }
)
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100vh;
  z-index: 0;
}

/* 리프렛 컨트롤 스타일 개선 */
:deep(.leaflet-control-container .leaflet-top) {
  z-index: 800;
}

:deep(.leaflet-control-container .leaflet-bottom) {
  z-index: 800;
}
</style>