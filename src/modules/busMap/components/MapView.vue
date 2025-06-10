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
import startIcon from '@/assets/icons/start_icon.png'
import arrivalIcon from '@/assets/icons/arrival_icon.png'
import transferIcon from '@/assets/icons/transfer_icon.png'
import startMarkerIcon from '@/assets/icons/start_marker_icon.png'
import arrivalMarkerIcon from '@/assets/icons/arrival_marker_icon.png'

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

let manualStartMarker = null
let manualEndMarker = null

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
  removeAllMarkersAtCoord,
  clearAllStartMarkers
} = useMapMarkers(map)

const {
  contextMenu,
  handleRightClick,
  handleTouchStart,
  handleTouchEnd,
  hideContextMenu
} = useContextMenu(mapRef, map)

function selectAsStart(coords) {
  clearManualStartMarkers()
  clearStartMarker()
  clearTransferMarker()
  clearRoutePolylines()
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
  clearManualEndMarkers()
  clearEndMarker()
  clearTransferMarker()
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



function clearTransferMarker() {
  if (window.transferMarker) {
    map.value.removeLayer(window.transferMarker)
    window.transferMarker = null
  }
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
  clearStartMarker()
  clearEndMarker()
  clearTransferMarker()
  clearRoutePolylines()
  clearManualStartMarkers()
  clearManualEndMarkers()
}

defineExpose({
  clearStartMarker,
  clearEndMarker,
  clearTransferMarker,
  clearRoutePolylines,
  clearManualStartMarkers,
  clearManualEndMarkers,
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
  clearStartMarker()
  clearEndMarker()
  clearManualStartMarkers()
  clearManualEndMarkers()
  clearTransferMarker()
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
      const res = await axios.get(`/api/bus/bus-arrival`, {params: {bsId: transferStop.bsId}})
      const body = res.data.body
      let content = `<div class="popup-wrapper"><div class="popup-title"><b>${transferStop.bsNm}</b> (🔁 환승지점)</div>`

      if (!body.totalCount || !body.items) {
        content += `<div class="no-info">도착 정보 없음</div></div>`
        marker.bindPopup(content).openPopup()
        return
      }

      const items = Array.isArray(body.items) ? body.items : [body.items]
      const routeMap = new Map()

      items.forEach(item => {
        const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList]
        arrList.forEach(arr => {
          const existing = routeMap.get(item.routeNo)
          if (!existing || arr.arrTime < existing.arrTime) {
            routeMap.set(item.routeNo, {...arr, routeNo: item.routeNo, updn: item.updn})
          }
        })
      })

      const sortedArrivals = [...routeMap.values()]
      content += `<div class="popup-scroll-area">`
      sortedArrivals.forEach(arr => {
        content += `<div class="bus-info"><div class="route-no">🚌 ${arr.routeNo}</div><div class="arr-time">${arr.arrState}</div><div class="direction">${arr.updn ?? ''}</div></div>`
      })
      content += `</div></div>`
      marker.bindPopup(content).openPopup()
    } catch (err) {
      marker.bindPopup(`<b>${transferStop.bsNm}</b><br>도착 정보 조회 실패`).openPopup()
      console.error('도착 정보 실패:', err)
    }
  })
}

onMounted(() => {
  map.value = useMapInit(mapRef)

  mapRef.value.addEventListener('contextmenu', handleRightClick)
  mapRef.value.addEventListener('touchstart', handleTouchStart)
  mapRef.value.addEventListener('touchend', handleTouchEnd)
  mapRef.value.addEventListener('click', hideContextMenu)
})

onBeforeUnmount(() => {
  clearInterval(intervalId.value)

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

  clearStartMarker()
  clearEndMarker()
  clearManualStartMarkers()
  clearManualEndMarkers()
})

watch(() => store.startCoord, (coord, _, onCleanup) => {
  if (!coord) return;

  // 👉 자동 탐색 상황인지 확인하는 플래그 추가
  if (store.autoTriggered) {
    clearManualStartMarkers()
    clearStartMarker()
    removeAllMarkersAtCoord(coord)
    drawStartMarker(coord)
  }

  onCleanup(() => {
    store.autoTriggered = false
  })
})

watch(() => store.endCoord, (coord, _, onCleanup) => {
  if (!coord) return;

  if (store.autoTriggered) {
    clearManualEndMarkers()
    clearEndMarker()
    drawEndMarker(coord)
  }

  onCleanup(() => {
    store.autoTriggered = false
  })
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