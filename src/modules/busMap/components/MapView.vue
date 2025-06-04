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

<script>
import L from 'leaflet'
import axios from 'axios'
import ContextMenu from './ContextMenu.vue'
import { useSearchStore } from '@/stores/searchStore'
import { drawBusRouteMapORS } from '@/composables/map-utils'

export default {
  name: 'MapView',
  components: { ContextMenu },
  props: { routeId: String },
  data() {
    return {
      startCoord: null,
      endCoord: null,
      startMarker: null,
      endMarker: null,
      routePolyline: null,
      map: null,
      contextMenu: {
        visible: false,
        position: { x: 0, y: 0 },
        coords: { lat: 0, lng: 0 }
      },
      busMarkers: [],
      intervalId: null,
      store: useSearchStore()
    }
  },
  mounted() {
    const mapContainer = this.$refs.mapRef
    this.map = L.map(mapContainer, {
      zoomControl: false,
      zoomAnimation: false   // ← 이 줄 추가
    }).setView([35.865, 128.593], 16)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map)

    L.control.zoom({ position: 'bottomright' }).addTo(this.map)
    window.leafletMap = this.map

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (this.map && this.map._loaded) {
          this.map.flyTo([lat, lng], 16)
        }

        const icon = L.divIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" viewBox="0 0 24 36"><path d="M12 0C 5.4 0 0 5.4 0 12c0 8.4 12 24 12 24s12-15.6 12-24c0-6.6-5.4-12-12-12z" fill="#2ecc71"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`
        })
        L.marker([lat, lng], { icon }).addTo(this.map).openPopup()
      })
    }

    this.$nextTick(() => {
      setTimeout(() => {
        this.map.invalidateSize()
      }, 300)
    })

    const el = this.$refs.mapRef
    el.addEventListener('contextmenu', this.handleRightClick)
    el.addEventListener('touchstart', this.handleTouchStart)
    el.addEventListener('touchend', this.handleTouchEnd)
    el.addEventListener('click', () => { this.contextMenu.visible = false })

    this.$watch(
        () => this.store.selectedRoute,
        this.handleSelectedRoute,
        { deep: true }
    )

    this.$watch(
        () => this.routeId,
        () => this.fetchBusLocations()
    )
  },
  methods: {
    async fetchBusLocations() {
      if (!this.routeId) return
      try {
        const res = await axios.get(`/api/bus/bus-route-Bus?routeId=${this.routeId}`)
        this.clearBusMarkers()
        ;(res.data.busLocationList || []).forEach(loc => {
          const marker = L.circleMarker([loc.yPos, loc.xPos], {
            radius: 8,
            color: loc.moveDir === 0 ? 'skyblue' : 'yellow',
            fillOpacity: 0.9
          }).addTo(this.map)
          this.busMarkers.push(marker)
        })
      } catch (err) {
        console.error('실시간 위치 호출 실패:', err)
      }
    },
    clearBusMarkers() {
      this.busMarkers.forEach(m => this.map.removeLayer(m))
      this.busMarkers = []
    },
    handleRightClick(e) {
      e.preventDefault()

      const mapRect = this.$refs.mapRef.getBoundingClientRect()
      const x = e.clientX - mapRect.left
      const y = e.clientY - mapRect.top

      const latlng = this.map.containerPointToLatLng([x, y])

      console.log('🖱️ 우클릭 좌표 보정:', {
        clientX: e.clientX,
        offsetX: x,
        latlng
      })

      this.contextMenu = {
        visible: true,
        position: { x: e.clientX, y: e.clientY }, // 여기는 화면 기준 좌표 (팝업 위치용)
        coords: latlng                            // 이건 지도 좌표
      }
    },
    handleTouchStart(e) {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const mapRect = this.$refs.mapRef.getBoundingClientRect()
        const x = touch.clientX - mapRect.left
        const y = touch.clientY - mapRect.top

        this._longPressTimer = setTimeout(() => {
          const latlng = this.map.containerPointToLatLng([x, y])
          this.contextMenu = {
            visible: true,
            position: { x: touch.clientX, y: touch.clientY },
            coords: latlng
          }
        }, 800)
      }
    },
    handleTouchEnd() {
      clearTimeout(this._longPressTimer)
    },
    selectAsStart(coords) {
      if (this.startMarker) {
        this.map.removeLayer(this.startMarker)
      }

      this.startCoord = coords
      this.startMarker = L.marker(coords, {
        icon: L.icon({
          iconUrl: '/images/start_icon.png',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        })
      }).addTo(this.map)

      this.contextMenu.visible = false
      this.tryAutoRouteFromCoords()
    },
    selectAsEnd(coords) {
      if (this.endMarker) {
        this.map.removeLayer(this.endMarker)
      }

      this.endCoord = coords
      this.endMarker = L.marker(coords, {
        icon: L.icon({
          iconUrl: '/images/arrival_icon.png',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        })
      }).addTo(this.map)

      this.contextMenu.visible = false
      this.tryAutoRouteFromCoords()
    },
    async tryAutoRouteFromCoords() {
      if (!this.startCoord || !this.endCoord) return

      try {
        // 1. 좌표 기반 인근 정류장 탐색
        const nearbyRes = await axios.get('/api/bus/nearby-stops', {
          params: {
            startX: this.startCoord.lng,
            startY: this.startCoord.lat,
            endX: this.endCoord.lng,
            endY: this.endCoord.lat,
            radius: 150
          }
        })

        const { startCandidates, endCandidates } = nearbyRes.data
        if (!startCandidates.length || !endCandidates.length) {
          console.warn('❌ 인근 정류장 없음')
          return
        }

        const startStop = startCandidates[0]
        const endStop = endCandidates[0]

        // 2. 실제 경로 탐색 (직통/환승 경로 포함)
        const routeRes = await axios.get('/api/bus/findRoutes', {
          params: {
            startBsId: startStop.bsId,
            endBsId: endStop.bsId
          }
        })

        useSearchStore().routeResults = routeRes.data

      } catch (err) {
        console.error('🚨 경로 탐색 실패:', err)
      }
    },
    handleSelectedRoute(route) {
      if (!route || route.type !== '환승' || !route.transferStationName || !route.stationIds?.length) return

      const transferStop = route.stationIds.find(s =>
          s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, '')
      )
      if (!transferStop) return

      const lat = parseFloat(transferStop.yPos ?? transferStop.ypos)
      const lng = parseFloat(transferStop.xPos ?? transferStop.xpos)
      if (isNaN(lat) || isNaN(lng)) return

      if (window.transferMarker) {
        this.map.removeLayer(window.transferMarker)
        window.transferMarker = null
      }
      if (window.routePolylines) {
        window.routePolylines.forEach(l => this.map.removeLayer(l))
        window.routePolylines = []
      }

      const marker = L.marker([lat, lng], {
        icon: L.icon({ iconUrl: '/images/transfer_icon.png', iconSize: [36, 36], iconAnchor: [15, 30] }),
        title: '환승지점: ' + transferStop.bsNm
      }).addTo(this.map)

      const allStations = route.stationIds
      const transferIdx = allStations.findIndex(s => s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, ''))

      if (transferIdx > 0) {
        drawBusRouteMapORS(this.map, allStations.slice(0, transferIdx + 1), 'yellowgreen')
        drawBusRouteMapORS(this.map, allStations.slice(transferIdx), 'orange')
      } else {
        drawBusRouteMapORS(this.map, allStations, 'gray')
      }

      marker.on('click', async () => {
        try {
          const res = await axios.get(`/api/bus/bus-arrival`, { params: { bsId: transferStop.bsId } })
          const body = res.data.body
          let content = `<div class=\"popup-wrapper\"><div class=\"popup-title\"><b>${transferStop.bsNm}</b> (🔁 환승지점)</div>`

          if (!body.totalCount || !body.items) {
            content += `<div class=\"no-info\">도착 정보 없음</div></div>`
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
          content += `<div class=\"popup-scroll-area\">`
          sortedArrivals.forEach(arr => {
            content += `<div class=\"bus-info\"><div class=\"route-no\">🚌 ${arr.routeNo}</div><div class=\"arr-time\">${arr.arrState}</div><div class=\"direction\">${arr.updn ?? ''}</div></div>`
          })
          content += `</div></div>`
          marker.bindPopup(content).openPopup()
        } catch (err) {
          marker.bindPopup(`<b>${transferStop.bsNm}</b><br>도착 정보 조회 실패`).openPopup()
          console.error('도착 정보 실패:', err)
        }
      })

      window.transferMarker = marker
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
    if (window.transferMarker) {
      this.map.removeLayer(window.transferMarker)
      window.transferMarker = null
    }
  }
}
</script>
<style scoped>
.leaflet-map {
  width: 100%;
  height: 100vh;
  border: 1px solid #ccc;
  position: relative; /* 추가 */
}
</style>
