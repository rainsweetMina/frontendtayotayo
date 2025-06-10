import L from 'leaflet'
import startIcon from '@/assets/icons/start_icon.png'
import arrivalIcon from '@/assets/icons/arrival_icon.png'
import startMarkerIcon from '@/assets/icons/start_marker_icon.png'
import arrivalMarkerIcon from '@/assets/icons/arrival_marker_icon.png'

export function useMapMarkers(map) {
    let manualStartMarker = null
    let manualEndMarker = null

    const drawManualStartMarker = (coord) => {
        if (manualStartMarker && map.value.hasLayer(manualStartMarker)) {
            map.value.removeLayer(manualStartMarker)
        }

        manualStartMarker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({
                iconUrl: startMarkerIcon,
                iconSize: [36, 36],
                iconAnchor: [18, 36]
            })
        }).addTo(map.value)
    }

    const drawManualEndMarker = (coord) => {
        if (manualEndMarker && map.value.hasLayer(manualEndMarker)) {
            map.value.removeLayer(manualEndMarker)
        }

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

    const drawStartMarker = (coord) => {
        clearStartMarker()
        clearManualStartMarkers()
        removeAllMarkersAtCoord(coord)

        const marker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({ iconUrl: startIcon, iconSize: [36, 36], iconAnchor: [18, 36] })
        }).addTo(map.value)

        window.lastStartMarker = marker
    }

    const drawEndMarker = (coord) => {
        clearEndMarker()
        clearManualEndMarkers()
        removeAllMarkersAtCoord(coord)

        const marker = L.marker([coord.lat, coord.lng], {
            icon: L.icon({ iconUrl: arrivalIcon, iconSize: [36, 36], iconAnchor: [18, 36] })
        }).addTo(map.value)

        window.lastEndMarker = marker
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

    const removeAllMarkersAtCoord = (coord) => {
        map.value.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                const pos = layer.getLatLng()
                if (pos.lat === coord.lat && pos.lng === coord.lng) {
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
        removeAllMarkersAtCoord,
        clearAllStartMarkers
    }
}
