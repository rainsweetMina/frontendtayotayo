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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import axios from 'axios'
import ContextMenu from './ContextMenu.vue'
import { useSearchStore } from '@/stores/searchStore'
import { drawBusRouteMapORS } from '@/composables/map-utils'

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
let longPressTimer = null

const contextMenu = ref({
  visible: false,
  position: { x: 0, y: 0 },
  coords: { lat: 0, lng: 0 }
})

function selectAsStart(coords) {
  clearStartMarker()
  clearTransferMarker()
  clearRoutePolylines()

  startCoord.value = coords
  startMarker.value = L.marker(coords, {
    icon: L.icon({
      iconUrl: '/images/start_icon.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    })
  }).addTo(map.value)

  if (store.setStartCoordText) {
    store.setStartCoordText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
    store.startCoord = coords
  }

  contextMenu.value.visible = false
  tryAutoRouteFromCoords();
}

function selectAsEnd(coords) {
  clearEndMarker()
  clearTransferMarker()
  clearRoutePolylines()

  endCoord.value = coords
  endMarker.value = L.marker(coords, {
    icon: L.icon({
      iconUrl: '/images/arrival_icon.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    })
  }).addTo(map.value)

  if (store.setEndCoordText) {
    store.setEndCoordText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
    store.endCoord = coords
  }

  contextMenu.value.visible = false
  tryAutoRouteFromCoords();
}

function clearStartMarker() {
  if (startMarker.value) {
    console.log('🧹 clearStartMarker - startMarker:', startMarker.value)
    if (map.value.hasLayer(startMarker.value)) {
      map.value.removeLayer(startMarker.value)
      console.log('🧹 removed startMarker')
    }
  }

  if (window.lastStartMarker) {
    console.log('🧹 clearStartMarker - lastStartMarker:', window.lastStartMarker)
    if (map.value.hasLayer(window.lastStartMarker)) {
      map.value.removeLayer(window.lastStartMarker)
      console.log('🧹 removed lastStartMarker')
    }
  }

  startMarker.value = null
  window.lastStartMarker = null
}

function clearEndMarker() {
  if (endMarker.value && map.value.hasLayer(endMarker.value)) {
    map.value.removeLayer(endMarker.value)
  }
  if (window.lastEndMarker && map.value.hasLayer(window.lastEndMarker)) {
    map.value.removeLayer(window.lastEndMarker)
    window.lastEndMarker = null
  }
  endMarker.value = null
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
}

defineExpose({
  clearStartMarker,
  clearEndMarker,
  clearTransferMarker,
  clearRoutePolylines,
  clearMapElementsForSearch
})

function handleRightClick(e) {
  e.preventDefault()
  const rect = mapRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const latlng = map.value.containerPointToLatLng([x, y])

  contextMenu.value = {
    visible: true,
    position: { x: e.clientX, y: e.clientY },
    coords: latlng
  }
}

function handleTouchStart(e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0]
    const rect = mapRef.value.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    longPressTimer = setTimeout(() => {
      const latlng = map.value.containerPointToLatLng([x, y])
      contextMenu.value = {
        visible: true,
        position: { x: touch.clientX, y: touch.clientY },
        coords: latlng
      }
    }, 800)
  }
}

function handleTouchEnd() {
  clearTimeout(longPressTimer)
}

async function tryAutoRouteFromCoords() {
  if (!startCoord.value || !endCoord.value) return;

  try {
    const { data: nearbyData } = await axios.get('/api/bus/nearby-stops', {
      params: {
        startX: startCoord.value.lng,
        startY: startCoord.value.lat,
        endX: endCoord.value.lng,
        endY: endCoord.value.lat,
        radius: 300
      }
    });

    const { startCandidates, endCandidates } = nearbyData;
    if (!startCandidates.length || !endCandidates.length) {
      console.warn('❌ 인근 정류장 없음');
      return;
    }

    const startStop = startCandidates[0];
    const endStop = endCandidates[0];

    // 너무 가까운 경우 직통으로 가정
    const dist = Math.sqrt(
        Math.pow(startStop.xPos - endStop.xPos, 2) +
        Math.pow(startStop.yPos - endStop.yPos, 2)
    );
    if (dist < 0.001) {
      console.warn('🛑 출발지와 도착지가 너무 가까워 경로 탐색 생략');
      store.routeResults = [{
        type: '직통',
        routeNo: null,
        estimatedMinutes: 0,
        stationIds: [startStop.bsId],
        transferCount: 0,
        startBsId: startStop.bsId,
        endBsId: endStop.bsId,
        busStops: [startStop, endStop]
      }];
      return;
    }

    const { data: routeData } = await axios.get('/api/bus/findRoutes', {
      params: {
        startBsId: startStop.bsId,
        endBsId: endStop.bsId
      }
    });

    const deduplicated = [];
    routeData.forEach(route => {
      const exists = deduplicated.some(r =>
          r.routeNo === route.routeNo && r.startBsId === route.startBsId
      );
      if (!exists) deduplicated.push(route);
    });

    store.routeResults = deduplicated
        .sort((a, b) => {
          const lenA = a.stationIds?.length || 0;
          const lenB = b.stationIds?.length || 0;
          if (lenA !== lenB) return lenA - lenB;
          if (a.type === '직통' && b.type !== '직통') return -1;
          if (a.type !== '직통' && b.type === '직통') return 1;
          return 0;
        })
        .slice(0, 5);
  } catch (err) {
    console.error('🚨 경로 탐색 실패:', err);
  }
}

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

function drawStartMarker(coord) {
  clearAllStartMarkers()

  const marker = L.marker([coord.lat, coord.lng], {
    icon: L.icon({ iconUrl: '/images/start_icon.png', iconSize: [36, 36], iconAnchor: [18, 36] })
  }).addTo(map.value)

  console.log('📍 새로 추가된 marker 객체:', marker)
  console.log('💾 기존 startMarker.value:', startMarker.value)
  console.log('💾 기존 window.lastStartMarker:', window.lastStartMarker)

  startMarker.value = marker
  window.lastStartMarker = marker
}

function drawEndMarker(coord) {
  console.log('🖊️ drawStartMarker 실행:', coord)
  clearStartMarker()

  // ✅ 동일 위치 마커 전부 제거
  removeAllMarkersAtCoord(coord)

  const marker = L.marker([coord.lat, coord.lng], {
    icon: L.icon({ iconUrl: '/images/start_icon.png', iconSize: [36, 36], iconAnchor: [18, 36] })
  }).addTo(map.value)

  startMarker.value = marker
  window.lastStartMarker = marker
}

function removeAllMarkersAtCoord(coord) {
  const lat = coord.lat
  const lng = coord.lng

  map.value.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      const pos = layer.getLatLng()
      if (pos.lat === lat && pos.lng === lng) {
        map.value.removeLayer(layer)
      }
    }
  })
}

function clearAllStartMarkers() {
  const candidates = [
    startMarker.value,
    window.lastStartMarker,
    ...(window.routePointMarkers || [])
  ]

  candidates.forEach(m => {
    if (m && map.value.hasLayer(m)) {
      map.value.removeLayer(m)
    }
  })

  startMarker.value = null
  window.lastStartMarker = null
  window.routePointMarkers = []
}

function handleSelectedRoute(route) {
  clearStartMarker()
  clearEndMarker()
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
      iconUrl: '/images/transfer_icon.png',
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
      const res = await axios.get(`/api/bus/bus-arrival`, { params: { bsId: transferStop.bsId } })
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
            routeMap.set(item.routeNo, { ...arr, routeNo: item.routeNo, updn: item.updn })
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
  map.value = L.map(mapRef.value, {
    zoomControl: false,
    zoomAnimation: false
  }).setView([35.865, 128.593], 16)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)

  L.control.zoom({ position: 'bottomright' }).addTo(map.value)
  window.leafletMap = map.value

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      if (map.value && map.value._loaded) {
        map.value.flyTo([lat, lng], 16)
      }
    })
  }

  setTimeout(() => {
    map.value.invalidateSize()
  }, 300)

  mapRef.value.addEventListener('contextmenu', handleRightClick)
  mapRef.value.addEventListener('touchstart', handleTouchStart)
  mapRef.value.addEventListener('touchend', handleTouchEnd)
  mapRef.value.addEventListener('click', () => {
    contextMenu.value.visible = false
  })
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
})

watch(() => store.startCoord, (coord) => {
  console.log('🎯 startCoord 변경됨:', coord)
  clearStartMarker()
  if (window.routePointMarkers?.length) {
    window.routePointMarkers.forEach(m => {
      if (map.value.hasLayer(m)) map.value.removeLayer(m)
    })
    window.routePointMarkers = []
  }
  if (coord) drawStartMarker(coord)
})

watch(() => store.endCoord, (coord) => {
  console.log('🎯 endCoord 변경됨:', coord)
  clearEndMarker()
  if (coord) drawEndMarker(coord)
})

watch(
    () => [store.startCoord, store.endCoord],
    async ([start, end]) => {
      if (!start || !end) return
      await tryAutoRouteFromCoords(start, end)  // ORS 경로 조회
    },
    { deep: true }
)

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