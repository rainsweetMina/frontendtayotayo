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

    // 위치 이동 - 현재 위치로 이동해도 UI 요소에 영향을 주지 않도록 수정
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude: lat, longitude: lng } = pos.coords
            if (map && map._loaded) {
                // flyTo 대신 setView 사용하여 애니메이션 효과 없이 이동
                map.setView([lat, lng], 16, {
                    animate: false,
                    duration: 0
                })
            }
        })
    }

    // 크기 초기화
    setTimeout(() => {
        map.invalidateSize()
    }, 300)

    return map
}
