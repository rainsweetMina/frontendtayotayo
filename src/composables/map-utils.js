import api from '@/api/axiosInstance.js'
import { renderPopupComponent } from '@/utils/popup-mount';
import { getSortedArrivalsFromApi } from '@/composables/arrival-utils.js';

// 버스 노선 경로 폴리라인 그리기
export function drawBusRouteMapORS(map, coordinates, color = 'skyblue') {
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

    map.fitBounds(polyline.getBounds());

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

// 정류장 마커 + 도착 정보 팝업
export function drawBusStopMarkersWithArrival(map, stops) {
    if (!map || !Array.isArray(stops)) return;

    window.busStopMarkers?.forEach(m => m.remove());
    window.busStopMarkers = [];

    stops.forEach(stop => {
        const lat = parseFloat(stop.yPos ?? stop.ypos);
        const lng = parseFloat(stop.xPos ?? stop.xpos);
        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng], {
            title: stop.bsNm
        }).addTo(map);

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
}
