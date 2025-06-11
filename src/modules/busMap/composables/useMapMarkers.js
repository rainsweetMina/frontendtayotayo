import L from 'leaflet'
import startIcon from '@/assets/icons/start_icon.png'
import arrivalIcon from '@/assets/icons/arrival_icon.png'
import transferIcon from '@/assets/icons/transfer_icon.png'
import startMarkerIcon from '@/assets/icons/start_marker_icon.png'
import arrivalMarkerIcon from '@/assets/icons/arrival_marker_icon.png'

export function useMapMarkers(map) {
    let manualStartMarker = null
    let manualEndMarker = null

    function clearAutoMarkers() {
        const keys = [
            'lastStartMarker',
            'lastEndMarker',
            'lastTransferMarker',
            'manualStartMarker',
            'manualEndMarker',
            'transferMarker'
        ];

        keys.forEach(key => {
            const marker = window[key];
            if (marker instanceof L.Marker && map.value.hasLayer(marker)) {
                try {
                    map.value.removeLayer(marker);
                } catch (e) {
                    console.warn(`⚠️ ${key} 제거 중 오류`, e);
                }
            }
            window[key] = null;
        });
    }

    function clearManualMarkers() {
        if (manualStartMarker && map.value.hasLayer(manualStartMarker)) {
            map.value.removeLayer(manualStartMarker)
            manualStartMarker = null
        }
        if (manualEndMarker && map.value.hasLayer(manualEndMarker)) {
            map.value.removeLayer(manualEndMarker)
            manualEndMarker = null
        }
    }

    const drawManualStartMarker = (coord) => {
        clearManualStartMarkers()
        clearAutoMarkers()

        manualStartMarker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({
                iconUrl: startMarkerIcon,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            })
        }).addTo(map.value)
    }

    const drawManualEndMarker = (coord) => {
        clearManualEndMarkers()
        clearAutoMarkers()

        manualEndMarker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({
                iconUrl: arrivalMarkerIcon,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            })
        }).addTo(map.value)
    }

    const clearManualStartMarkers = () => {
        if (manualStartMarker && map.value.hasLayer(manualStartMarker)) {
            map.value.removeLayer(manualStartMarker)
            manualStartMarker = null
        }
    }

    const clearManualEndMarkers = () => {
        if (manualEndMarker && map.value.hasLayer(manualEndMarker)) {
            map.value.removeLayer(manualEndMarker)
            manualEndMarker = null
        }
    }

    function drawStartMarker(coord) {
        clearStartMarker()
        clearManualMarkers() // ✅ 수동 마커까지 함께 제거
        removeAllMarkersAtCoord(coord)

        const marker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({
                iconUrl: startIcon,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            })
        }).addTo(map.value)

        window.lastStartMarker = marker
    }

    const drawEndMarker = (coord) => {
        clearEndMarker()
        clearManualMarkers()
        removeAllMarkersAtCoord(coord)

        const marker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({ iconUrl: arrivalIcon, iconSize: [36, 36], iconAnchor: [18, 36] })
        }).addTo(map.value)

        window.lastEndMarker = marker
        console.log('✅ drawEndMarker - 마커 생성됨:', marker.getLatLng(), 'ID:', marker._leaflet_id)
    }

    const clearStartMarker = () => {
        if (window.lastStartMarker && map.value.hasLayer(window.lastStartMarker)) {
            map.value.removeLayer(window.lastStartMarker)
            window.lastStartMarker = null
        }
        if (window.routePointMarkers?.length) {
            window.routePointMarkers.forEach(m => {
                if (map.value.hasLayer(m)) map.value.removeLayer(m)
            })
            window.routePointMarkers = []
        }
    }

    const clearEndMarker = () => {
        if (window.lastEndMarker && map.value.hasLayer(window.lastEndMarker)) {
            map.value.removeLayer(window.lastEndMarker)
            window.lastEndMarker = null
        }
    }

    function drawTransferMarker(coord, title = '환승지점') {
        if (window.transferMarker && map.value.hasLayer(window.transferMarker)) {
            map.value.removeLayer(window.transferMarker)
        }

        const marker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({
                iconUrl: transferIcon,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            }),
            title
        }).addTo(map.value)

        window.transferMarker = marker
        return marker
    }

    function clearTransferMarker() {
        if (window.lastTransferMarker && map.value.hasLayer(window.lastTransferMarker)) {
            map.value.removeLayer(window.lastTransferMarker)
            console.log('🧹 lastTransferMarker 제거됨')
            window.lastTransferMarker = null
        }
    }

    const removeAllMarkersAtCoord = (coord) => {
        console.log('🗑️ removeAllMarkersAtCoord 실행:', coord)

        map.value.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                const pos = layer.getLatLng()
                if (pos.lat === coord.lat && pos.lng === coord.lng) {
                    console.warn('⚠️ 마커 제거됨 (같은 좌표):', pos)
                    map.value.removeLayer(layer)
                }
            }
        })
    }

    const clearAllStartMarkers = () => {
        const candidates = [
            window.lastStartMarker,
            ...(window.routePointMarkers || [])
        ]
        candidates.forEach(m => {
            if (m && map.value.hasLayer(m)) map.value.removeLayer(m)
        })
        window.lastStartMarker = null
        window.routePointMarkers = []
    }

    return {
        drawManualStartMarker,
        drawManualEndMarker,
        drawStartMarker,
        drawEndMarker,
        clearManualStartMarkers,
        clearManualEndMarkers,
        clearStartMarker,
        clearEndMarker,
        drawTransferMarker,
        clearTransferMarker,
        removeAllMarkersAtCoord,
        clearAllStartMarkers,
        clearManualMarkers,
        clearAutoMarkers
    }
}
