import axios from 'axios';
import { renderPopupComponent } from '@/utils/popup-mount'
import {getSortedArrivalsFromApi} from "@/composables/arrival-utils.js";

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

export function clearMapElements(map) {
    if (!map) return;

    if (window.routePolylines) {
        window.routePolylines.forEach(l => map.removeLayer(l))
        window.routePolylines = []
    }

    if (window.routePointMarkers) {
        window.routePointMarkers.forEach(m => map.removeLayer(m))
        window.routePointMarkers = []
    }

    // ✅ 수동 출발지 마커 제거
    if (window.manualStartMarker && map.hasLayer(window.manualStartMarker)) {
        map.removeLayer(window.manualStartMarker);
        window.manualStartMarker = null;
    }

// ✅ 수동 도착지 마커 제거
    if (window.manualEndMarker && map.hasLayer(window.manualEndMarker)) {
        map.removeLayer(window.manualEndMarker);
        window.manualEndMarker = null;
    }

    // ✅ 정류장 마커 제거
    if (window.busStopMarkers) {
        window.busStopMarkers.forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        window.busStopMarkers = [];
    }

    // ✅ 실시간 버스 마커 제거
    if (window.realtimeBusMarkers) {
        window.realtimeBusMarkers.forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        window.realtimeBusMarkers = [];
    }

    // ✅ 버스 위치 마커 제거
    if (window.busLocationMarkers) {
        window.busLocationMarkers.forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        window.busLocationMarkers = [];
    }

    // ✅ 기타 라인 제거
    if (window.routeLineLayers) {
        window.routeLineLayers.forEach(layer => {
            if (map.hasLayer(layer)) map.removeLayer(layer);
        });
        window.routeLineLayers = [];
    }

    // ✅ 경유지 마커 제거
    if (window.routePointMarkers) {
        window.routePointMarkers.forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        window.routePointMarkers = [];
    }

    // ✅ 출발지 마커 제거
    if (window.lastStartMarker && map.hasLayer(window.lastStartMarker)) {
        map.removeLayer(window.lastStartMarker);
        window.lastStartMarker = null;
    }

    // ✅ 도착지 마커 제거
    if (window.lastEndMarker && map.hasLayer(window.lastEndMarker)) {
        map.removeLayer(window.lastEndMarker);
        window.lastEndMarker = null;
    }

    // ✅ 환승 마커 제거 (경로용)
    if (window.lastTransferMarker && map.hasLayer(window.lastTransferMarker)) {
        map.removeLayer(window.lastTransferMarker);
        window.lastTransferMarker = null;
    }

    // ✅ 환승 마커 제거 (일반용)
    if (window.transferMarker && map.hasLayer(window.transferMarker)) {
        map.removeLayer(window.transferMarker);
        window.transferMarker = null;
    }

    ['lastStartMarker', 'lastEndMarker', 'lastTransferMarker', 'transferMarker'].forEach(key => {
        if (window[key] && map.hasLayer(window[key])) {
            map.removeLayer(window[key])
            window[key] = null
        }
    })
}

// 실시간 버스 정보
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
                marker.bindPopup(`<b>${stop.bsNm}</b><br>도착 정보 조회 실패`).openPopup();
                console.error('❌ 도착 정보 요청 실패:', err);
            }
        });

        window.busStopMarkers.push(marker);
    });
}
