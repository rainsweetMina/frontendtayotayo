<template>
  <div id="map" ref="mapRef" class="leaflet-map p-0"></div>

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

const {
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
  // 모든 마커와 레이어 초기화
  clearManualMarkers()
  clearAutoMarkers()
  clearRoutePolylines()
  clearTransferMarker()
  
  // 버스 정류장 마커 초기화
  if (window.busStopMarkers) {
    window.busStopMarkers.forEach(marker => {
      if (map.value && map.value.hasLayer(marker)) {
        map.value.removeLayer(marker)
      }
    })
    window.busStopMarkers = []
  }
  
  // 버스 위치 마커 초기화
  clearBusMarkers()
  
  // 기타 모든 맵 요소 초기화
  if (map.value) {
    // 모든 레이어 초기화
    map.value.eachLayer(layer => {
      // 기본 타일 레이어는 제외
      if (layer instanceof L.TileLayer) return
      
      // 마커, 폴리라인 등 모든 커스텀 레이어 제거
      if (map.value.hasLayer(layer)) {
        map.value.removeLayer(layer)
      }
    })
  }
  
  // 전역 변수 초기화
  window.routeLineLayers = []
  window.routePointMarkers = []
  window.busStopMarkers = []
  window.realtimeBusMarkers = []
  window.busLocationMarkers = []
  window.routePolylines = []
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

  const marker = drawTransferMarker({ lat, lng }, '환승지점: ' + transferStop.bsNm)
  transferMarker.value = marker

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
  console.log('MapView mounted, initializing map');
  map.value = useMapInit(mapRef)
  window.leafletMap = map.value
  console.log('Map initialized:', map.value);

  const markerFns = useMapMarkers(map)
  drawTransferMarker = markerFns.drawTransferMarker

  console.log('Adding event listeners to mapRef:', mapRef.value);
  if (mapRef.value) {
    mapRef.value.addEventListener('contextmenu', (e) => {
      console.log('Context menu event triggered');
      if (map.value) {
        handleRightClick(e);
      } else {
        console.error('Map is not initialized for context menu');
      }
    });
    mapRef.value.addEventListener('touchstart', handleTouchStart);
    mapRef.value.addEventListener('touchend', handleTouchEnd);
    mapRef.value.addEventListener('click', hideContextMenu);
    console.log('Event listeners added successfully');
  } else {
    console.error('mapRef is not available');
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalId.value)
  clearAutoMarkers()
  clearManualMarkers()

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
  border: 1px solid #ccc;
  position: relative;
}
</style>