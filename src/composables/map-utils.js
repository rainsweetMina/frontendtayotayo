export function drawBusStopMarkers(map, stops) {
    if (!map || !Array.isArray(stops)) return;

    if (window.busStopMarkers) {
        window.busStopMarkers.forEach(marker => marker.remove());
    }
    window.busStopMarkers = [];

    stops.forEach(stop => {
        const lat = parseFloat(stop.yPos ?? stop.ypos);
        const lng = parseFloat(stop.xPos ?? stop.xpos);

        if (isNaN(lat) || isNaN(lng)) {
            console.warn('❌ 유효하지 않은 좌표:', stop);
            return;
        }

        const marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${stop.bsNm}</strong><br>ID: ${stop.bsId}`);

        window.busStopMarkers.push(marker);
    });
}

export function drawBusRouteMapORS(map, coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
        console.warn('❌ 경로 데이터 없음');
        return;
    }

    // 정방향 / 역방향 구분
    const forward = coordinates.filter(s => s.moveDir === 0);
    const reverse = coordinates.filter(s => s.moveDir === 1);

    // 기존 선 제거
    if (window.routePolylines) {
        window.routePolylines.forEach(line => map.removeLayer(line));
    }
    window.routePolylines = [];

    const drawLine = (points, color) => {
        const latlngs = points.map(p => [parseFloat(p.yPos), parseFloat(p.xPos)]);
        if (latlngs.length === 0 || latlngs.some(([lat, lng]) => isNaN(lat) || isNaN(lng))) {
            console.warn('❌ 유효하지 않은 좌표 있음:', latlngs);
            return;
        }

        const polyline = L.polyline(latlngs, {
            color,
            weight: 5,
            opacity: 0.7,
            smoothFactor: 3.5,
            lineJoin: 'round'
        }).addTo(map);

        map.fitBounds(polyline.getBounds()); // ✅ 이거 추가: 지도 중심 자동 이동

        window.routePolylines.push(polyline);
    }
    drawLine(forward, 'skyblue');
    drawLine(reverse, 'gold');
    console.log('📦 전체 경로 데이터:', coordinates);
    console.log('➡ 정방향:', forward);
    console.log('⬅ 역방향:', reverse);
}

export function clearMapElements(map) {
    if (!map) {
        console.warn('❗ map 객체 없음 (clearMapElements)');
        return;
    }

    // 마커 제거
    if (window.busStopMarkers) {
        window.busStopMarkers.forEach(marker => {
            if (map.hasLayer(marker)) map.removeLayer(marker);
        });
        window.busStopMarkers = [];
    }

    // 노선 선 제거
    if (window.routePolyline) {
        if (map.hasLayer(window.routePolyline)) {
            map.removeLayer(window.routePolyline);
        }
        window.routePolyline = null;
    }
}

export function drawBusStopMarkersWithArrival(map, stops) {
    if (!map || !Array.isArray(stops)) return;

    window.busStopMarkers?.forEach(m => m.remove());
    window.busStopMarkers = [];

    stops.forEach(stop => {
        const lat = parseFloat(stop.yPos ?? stop.ypos);
        const lng = parseFloat(stop.xPos ?? stop.xpos);
        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng], {
            icon: L.divIcon({html: '🚌', className: 'bus-marker'}),
            title: stop.bsNm
        }).addTo(map);

        marker.on('click', () => {
            fetch(`/api/bus/bus-arrival?bsId=${stop.bsId}`)
                .then(res => res.json())
                .then(data => {
                    const body = data.body;
                    if (body.totalCount === 0 || !body.items) {
                        marker.bindPopup(`<b>${stop.bsNm}</b><br>도착 정보 없음`).openPopup();
                        return;
                    }

                    let content = `<b>${stop.bsNm}</b><br><br>`;
                    const items = Array.isArray(body.items) ? body.items : [body.items];

                    items.forEach(item => {
                        const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList];
                        arrList.forEach(arr => {
                            content += `🚌 <b>${item.routeNo}</b>: ${arr.arrState}<br>`;
                        });
                    });

                    marker.bindPopup(content).openPopup();
                })
                .catch(() => {
                    marker.bindPopup(`<b>${stop.bsNm}</b><br>도착 정보 조회 실패`).openPopup();
                });
        });

        window.busStopMarkers.push(marker);
    });
}
