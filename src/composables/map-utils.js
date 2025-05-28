import axios from 'axios';

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
        smoothFactor: 1.5
    }).addTo(map);

    window.routePolylines = window.routePolylines || [];
    window.routePolylines.push(polyline);

    map.fitBounds(polyline.getBounds());
}


export function clearMapElements(map) {
    if (!map) {
        console.warn('❗ map 객체 없음 (clearMapElements)');
        return;
    }

    // ✅ 마커 제거
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

    // ✅ 노선 라인 제거 (복수개)
    if (window.routePolylines) {
        window.routePolylines.forEach(line => {
            if (map.hasLayer(line)) map.removeLayer(line);
        });
        window.routePolylines = [];
    }

    // ✅ 버스 아이콘 제거
    if (window.busLocationMarkers) {
        window.busLocationMarkers.forEach(marker => map.removeLayer(marker))
        window.busLocationMarkers = []
    }
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
                const res = await axios.get(`/api/bus/bus-arrival`, {
                    params: { bsId: stop.bsId }
                });

                const body = res.data.body;

                let content = `
      <div class="popup-wrapper">
        <div class="popup-title"><b>${stop.bsNm}</b></div>
    `;

                if (!body.totalCount || !body.items) {
                    content += `<div class="no-info">도착 정보 없음</div></div>`;
                    marker.bindPopup(content).openPopup();
                    return;
                }

                const items = Array.isArray(body.items) ? body.items : [body.items];

                // ✅ 노선번호별로 하나만 유지 (가장 빠른 arrState 기준)
                const routeMap = new Map();
                items.forEach(item => {
                    const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList];
                    arrList.forEach(arr => {
                        const existing = routeMap.get(item.routeNo);
                        if (!existing || (arr.arrTime < existing.arrTime)) {
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
                content += `</div></div>`; // scroll-area, wrapper

                marker.bindPopup(content).openPopup();
            } catch (err) {
                marker.bindPopup(`<b>${stop.bsNm}</b><br>도착 정보 조회 실패`).openPopup();
                console.error('❌ 도착 정보 요청 실패:', err);
            }
        });

        window.busStopMarkers.push(marker);
    });
}
