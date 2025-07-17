import L from 'leaflet'
import api from '@/api/axiosInstance.js'
import { renderPopupComponent } from '@/utils/popup-mount';
import { getSortedArrivalsFromApi } from '@/composables/arrival-utils.js';

// 줌 레벨 설정 (네이버 지도 스타일)
const ZOOM_LEVELS = {
    SHOW_STOPS: 17, // 17 이상일 때 정류장 마커 표시 (더 세밀한 뷰)
    HIDE_STOPS: 16  // 16 이하일 때 정류장 마커 숨김 (전체 경로 뷰)
};

// 버스 노선 경로 폴리라인 그리기
export function drawBusRouteMapORS(map, coordinates, color = '#2563eb') {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
        console.warn('❌ 경로 데이터 없음');
        return;
    }

    const latlngs = coordinates.map(p => [parseFloat(p.yPos ?? p.ypos), parseFloat(p.xPos ?? p.xpos)]);
    if (latlngs.length === 0 || latlngs.some(([lat, lng]) => isNaN(lat) || isNaN(lng))) {
        console.warn('❌ 유효하지 않은 좌표 있음:', latlngs);
        return;
    }

    const polyline = L.polyline(latlngs, {
        color,
        weight: 6,
        opacity: 0.9,
        lineJoin: 'round',
        smoothFactor: 3.5
    }).addTo(map);

    window.routePolylines = window.routePolylines || [];
    window.routePolylines.push(polyline);

    // 개별 경로는 지도를 이동시키지 않음 (전체 경로를 한 번에 보여주기 위해)
    // map.fitBounds(polyline.getBounds());

    return polyline;
}

// 모든 맵 요소 제거
export function clearMapElements(map) {
    if (!map) return;

    const cleanup = (list) => {
        if (!list) return;
        list.forEach(layer => map.hasLayer(layer) && map.removeLayer(layer));
    };

    cleanup(window.routePolylines);
    window.routePolylines = [];

    cleanup(window.routePointMarkers);
    window.routePointMarkers = [];

    cleanup(window.busStopMarkers);
    window.busStopMarkers = [];

    cleanup(window.realtimeBusMarkers);
    window.realtimeBusMarkers = [];

    cleanup(window.busLocationMarkers);
    window.busLocationMarkers = [];

    cleanup(window.routeLineLayers);
    window.routeLineLayers = [];

    ['manualStartMarker', 'manualEndMarker', 'lastStartMarker', 'lastEndMarker', 'lastTransferMarker', 'transferMarker'].forEach(key => {
        if (window[key] && map.hasLayer(window[key])) {
            map.removeLayer(window[key]);
            window[key] = null;
        }
    });
}

// 정류장 마커 표시/숨김 처리
function toggleBusStopMarkers(map, show) {
    if (!window.busStopMarkers) return;
    
    window.busStopMarkers.forEach(marker => {
        if (show) {
            if (!map.hasLayer(marker)) {
                map.addLayer(marker);
            }
        } else {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        }
    });
    
    console.log(`��️ 정류장 마커 ${show ? '표시' : '숨김'} (줌 레벨: ${map.getZoom()})`);
}

// 줌 레벨에 따른 정류장 마커 제어
function handleZoomChange(map) {
    const currentZoom = map.getZoom();
    const shouldShowStops = currentZoom >= ZOOM_LEVELS.SHOW_STOPS;
    
    toggleBusStopMarkers(map, shouldShowStops);
    
    // 줌 레벨 정보 표시 (디버깅용)
    if (currentZoom >= ZOOM_LEVELS.SHOW_STOPS) {
        console.log(`🔍 줌 레벨: ${currentZoom} - 정류장 마커 표시 모드`);
    } else {
        console.log(`🔍 줌 레벨: ${currentZoom} - 전체 경로 뷰 모드`);
    }
}

// 정류장 마커 + 도착 정보 팝업 (줌 레벨 기반 표시)
export function drawBusStopMarkersWithArrival(map, stops) {
    if (!map || !Array.isArray(stops)) return;

    // 기존 마커 제거
    window.busStopMarkers?.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    window.busStopMarkers = [];

    // 새로운 마커 생성 (초기에는 지도에 추가하지 않음)
    stops.forEach(stop => {
        const lat = parseFloat(stop.yPos ?? stop.ypos);
        const lng = parseFloat(stop.xPos ?? stop.xpos);
        if (isNaN(lat) || isNaN(lng)) return;

        // 버스 모양 아이콘 생성
        const busIcon = L.divIcon({
            className: 'bus-stop-icon',
            html: `
                <div style="
                    width: 20px; 
                    height: 20px; 
                    background: #2563eb; 
                    border: 2px solid white; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    font-size: 10px;
                    color: white;
                    font-weight: bold;
                ">
                    🚌
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([lat, lng], {
            title: stop.bsNm,
            icon: busIcon
        });

        marker.on('click', async () => {
            try {
                const sortedArrivals = await getSortedArrivalsFromApi(stop.bsId);
                const popupContent = renderPopupComponent(marker, stop, sortedArrivals);
                marker.bindPopup(popupContent).openPopup();
            } catch (err) {
                marker.bindPopup(`
          <div class="w-52 font-sans text-sm p-2">
            <div class="font-semibold text-gray-800 mb-1">${stop.bsNm}</div>
            <div class="text-red-500">도착 정보 조회 실패</div>
          </div>
        `).openPopup();
                console.error('❌ 도착 정보 요청 실패:', err);
            }
        });

        window.busStopMarkers.push(marker);
    });

    // 줌 이벤트 리스너 등록 (한 번만 등록)
    if (!window.zoomListenerAdded) {
        map.on('zoomend', () => handleZoomChange(map));
        window.zoomListenerAdded = true;
        console.log('🔍 줌 이벤트 리스너 등록 완료');
    }

    // 현재 줌 레벨에 따라 마커 표시/숨김
    handleZoomChange(map);
}

// 정류장 마커 강제 표시 (길찾기 등에서 사용)
export function showBusStopMarkers(map) {
    toggleBusStopMarkers(map, true);
}

// 정류장 마커 강제 숨김
export function hideBusStopMarkers(map) {
    toggleBusStopMarkers(map, false);
}
