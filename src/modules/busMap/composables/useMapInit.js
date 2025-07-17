import L from 'leaflet'

export function useMapInit(mapRef) {
    const map = L.map(mapRef.value, {
        zoomControl: false,
        zoomAnimation: false,
        wheelPxPerZoomLevel: 60, // 줌 휠 감도 조정 (기본값 60)
        wheelDebounceTime: 40    // 줌 휠 디바운스 시간
    }).setView([35.865, 128.593], 16)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // 줌 휠 이벤트를 0.25씩 변경하도록 설정 (더 세밀한 조정)
    map.on('wheel', function(e) {
        e.originalEvent.preventDefault()
        const delta = e.originalEvent.deltaY
        const currentZoom = map.getZoom()
        
        if (delta > 0) {
            // 줌 아웃 (0.25씩)
            map.setZoom(Math.max(currentZoom - 0.25, map.getMinZoom()))
        } else {
            // 줌 인 (0.25씩)
            map.setZoom(Math.min(currentZoom + 0.25, map.getMaxZoom()))
        }
    })

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
