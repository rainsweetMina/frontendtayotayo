export function drawBusStopMarkers(map, stops) {
    if (!map || !Array.isArray(stops)) return;

    stops.forEach(stop => {
        const lat = parseFloat(stop.ypos);
        const lng = parseFloat(stop.xpos);
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng]).bindPopup(`${stop.bsNm} (ID: ${stop.bsId})`);
        marker.addTo(map);
    });
}