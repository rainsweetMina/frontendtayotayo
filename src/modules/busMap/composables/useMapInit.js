import L from 'leaflet'

export function useMapInit(mapRef) {
    const map = L.map(mapRef.value, {
        zoomControl: false,
        zoomAnimation: false
    }).setView([35.865, 128.593], 16)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // 전역에 등록
    window.leafletMap = map

    // 위치 이동
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude: lat, longitude: lng } = pos.coords
            if (map && map._loaded) {
                map.flyTo([lat, lng], 16)
            }
        })
    }

    // 크기 초기화
    setTimeout(() => {
        map.invalidateSize()
    }, 300)

    return map
}
