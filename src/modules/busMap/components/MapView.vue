<template>
  <div id="map" ref="mapRef" class="leaflet-map p-0"></div>
</template>

<script>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import axios from 'axios'
import L from 'leaflet'

export default {
  name: 'MapView',
  mounted() {
    const mapContainer = this.$refs.mapRef;

    const map = L.map(mapContainer, {
      zoomControl: false
    }).setView([35.865496405, 128.593444283], 16);

    /*https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png*/
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 확대 축소 버튼
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    window.leafletMap = map;

    // ✅ 위치 권한 요청 및 현재 위치로 이동
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.flyTo([lat, lng], 16);

            // 현재 위치 표시
            const greenSvgIcon = L.divIcon({
              html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" viewBox="0 0 24 36" fill="none">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 24 12 24s12-15.6 12-24c0-6.6-5.4-12-12-12z" fill="#2ecc71"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `,
              className: '', // 기본 스타일 제거
              iconSize: [30, 45],
              iconAnchor: [15, 45]
            });

            L.marker([lat, lng], { icon: greenSvgIcon })
                .addTo(map)
                .openPopup();
          },
          error => {
            console.warn('위치 접근 실패:', error.message);
          }
      );
    }

    // ✅ 렌더링 이후 사이즈 강제 재계산
    this.$nextTick(() => {
      map.invalidateSize();
    });
  },
  props: {
    routeId: String
  },
  setup(props) {
    const store = useSearchStore()
    const busMarkers = ref([])
    let intervalId = null

    const drawBusMarkers = (locations) => {
      clearBusMarkers()
      locations.forEach(loc => {
        const marker = L.circleMarker([loc.yPos, loc.xPos], {
          radius: 8,
          color: loc.moveDir === 0 ? 'skyblue' : 'yellow',
          fillOpacity: 0.9
        }).addTo(window.leafletMap)
        busMarkers.value.push(marker)
      })
    }

    const clearBusMarkers = () => {
      busMarkers.value.forEach(m => window.leafletMap.removeLayer(m))
      busMarkers.value = []
    }

    const fetchBusLocations = async () => {
      if (!props.routeId) return
      try {
        const res = await axios.get(`/api/bus/bus-route-Bus?routeId=${props.routeId}`)
        drawBusMarkers(res.data.busLocationList || [])
      } catch (err) {
        console.error('실시간 위치 호출 실패:', err)
      }
    }

    const startLocationPolling = () => {
      fetchBusLocations()
      intervalId = setInterval(fetchBusLocations, 10000) // 10초마다 갱신
    }

    const stopLocationPolling = () => {
      clearInterval(intervalId)
      intervalId = null
      clearBusMarkers()
    }

    watch(() => props.routeId, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        stopLocationPolling()
        startLocationPolling()
      }
    })

    onMounted(() => {
      // startLocationPolling()
      const drawBusStopMarkers = () => {
        const stops = [
          { bsId: '101', bsNm: '경대북문', xPos: 128.5933, yPos: 35.8656 },
          { bsId: '102', bsNm: '서문시장입구', xPos: 128.5941, yPos: 35.8672 }
          // ... 또는 axios로 받아온 정류장 데이터
        ]

        stops.forEach(stop => {
          const marker = L.circleMarker([stop.yPos, stop.xPos], {
            radius: 6,
            color: '#007bff',
            fillColor: '#007bff',
            fillOpacity: 0.9
          }).addTo(window.leafletMap)

          marker.on('click', () => {
            store.setSelectedStop({
              bsId: stop.bsId,
              bsNm: stop.bsNm
            })
          })
        })
      }

    })

    onBeforeUnmount(() => {
      stopLocationPolling()
    })

    return {}
  }
}
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 92vh;
  border: 1px solid #ccc;
}
</style>
