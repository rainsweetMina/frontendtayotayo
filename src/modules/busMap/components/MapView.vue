<template>
  <div id="map" ref="mapRef" class="leaflet-map p-0"></div>
</template>

<script>
import { ref, watch, onBeforeUnmount } from 'vue'
import { drawBusRouteMapORS } from '@/composables/map-utils'
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
              html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="45" viewBox="0 0 24 36" fill="none">
                        <path d="M12 0C   5.4 0 0 5.4 0 12c0 8.4 12 24 12 24s12-15.6 12-24c0-6.6-5.4-12-12-12z" fill="#2ecc71"/>
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

    // 여기 지금 비활성화
    const startLocationPolling = () => {
      fetchBusLocations()
      intervalId = setInterval(fetchBusLocations, 10000) // 10초마다 갱신
    }

    const stopLocationPolling = () => {
      clearInterval(intervalId)
      intervalId = null
      clearBusMarkers()
    }

    watch(() => store.selectedRoute, (route) => {
      if (!route || route.type !== '환승' || !route.transferStationName) return;
      if (!route || !route.stationIds?.length) return;

      const allStations = route.stationIds;

      const transferStop = route.stationIds.find(s =>
          s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, '')
      );

      if (!transferStop) {
        console.warn('❌ 환승 정류장을 못 찾았습니다:', route.transferStationName);
        return;
      }

      const lat = parseFloat(transferStop.yPos ?? transferStop.ypos);
      const lng = parseFloat(transferStop.xPos ?? transferStop.xpos);

      if (isNaN(lat) || isNaN(lng)) {
        console.warn('❌ 환승 정류장의 좌표가 유효하지 않습니다:', transferStop);
        return;
      }

      // 기존 환승 마커 제거
      if (window.transferMarker) {
        window.leafletMap.removeLayer(window.transferMarker);
        window.transferMarker = null;
      }

      // ✅ 기존 라인 제거
      if (window.routePolylines) {
        window.routePolylines.forEach(line => window.leafletMap.removeLayer(line));
        window.routePolylines = [];
      }

      // 환승 마커 생성
      const marker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: '/images/transfer_icon.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        }),
        title: '환승지점: ' + transferStop.bsNm
      }).addTo(window.leafletMap);

      if (route.type === '환승' && route.transferStationName) {
        const transferIdx = allStations.findIndex(s =>
            s.bsNm.replace(/\s/g, '') === route.transferStationName.replace(/\s/g, '')
        );

        if (transferIdx > 0) {
          const section1 = allStations.slice(0, transferIdx + 1);
          const section2 = allStations.slice(transferIdx);

          drawBusRouteMapORS(window.leafletMap, section1, 'yellowgreen');  // 환승 전
          drawBusRouteMapORS(window.leafletMap, section2, 'orange');   // 환승 후
        } else {
          console.warn('❌ 환승 인덱스가 유효하지 않음:', route.transferStationName);
          drawBusRouteMapORS(window.leafletMap, allStations, 'gray');
        }
      } else {
        // 직통이면 한 번만
        drawBusRouteMapORS(window.leafletMap, allStations, 'yellowgreen');
      }

      marker.on('click', async () => {
        try {
          const res = await axios.get(`/api/bus/bus-arrival`, {
            params: { bsId: transferStop.bsId }
          });

          const body = res.data.body;

          let content = `
            <div class="popup-wrapper">
              <div class="popup-title"><b>${transferStop.bsNm}</b> (🔁 환승지점)</div>
          `;

          if (!body.totalCount || !body.items) {
            content += `<div class="no-info">도착 정보 없음</div></div>`;
            marker.bindPopup(content).openPopup();
            return;
          }

          const items = Array.isArray(body.items) ? body.items : [body.items];
          const routeMap = new Map();

          items.forEach(item => {
            const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList];
            arrList.forEach(arr => {
              const existing = routeMap.get(item.routeNo);
              if (!existing || arr.arrTime < existing.arrTime) {
                routeMap.set(item.routeNo, { ...arr, routeNo: item.routeNo, updn: item.updn });
              }
            });
          });

          const sortedArrivals = [...routeMap.values()];
          content += `<div class="popup-scroll-area">`;

          sortedArrivals.forEach(arr => {
            content += `
              <div class="bus-info">
                <div class="route-no">🚌 ${arr.routeNo}</div>
                <div class="arr-time">${arr.arrState}</div>
                <div class="direction">${arr.updn ?? ''}</div>
              </div>
            `;
          });

          content += `</div></div>`;
          marker.bindPopup(content).openPopup();

        } catch (err) {
          marker.bindPopup(`<b>${transferStop.bsNm}</b><br>도착 정보 조회 실패`).openPopup();
          console.error('❌ 도착 정보 요청 실패:', err);
        }
      });
      window.transferMarker = marker;
    });

    onBeforeUnmount(() => {
      stopLocationPolling();

      if (window.transferMarker) {
        window.leafletMap.removeLayer(window.transferMarker);
        window.transferMarker = null;
      }
    });

    return {}
  }
}
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100vh;
  border: 1px solid #ccc;
}
</style>