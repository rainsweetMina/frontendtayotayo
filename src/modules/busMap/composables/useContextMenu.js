import { ref } from 'vue'
import L from 'leaflet'

export function useContextMenu(mapRef, map) {
    const contextMenu = ref({
        visible: false,
        position: { x: 0, y: 0 },
        coords: { lat: 0, lng: 0 }
    })

    let longPressTimer = null

    function handleRightClick(e) {
        e.preventDefault()
        const rect = mapRef.value.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const latlng = map.value.containerPointToLatLng([x, y])

        contextMenu.value = {
            visible: true,
            position: { x: e.clientX, y: e.clientY },
            coords: latlng
        }
    }

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0]
            const rect = mapRef.value.getBoundingClientRect()
            const x = touch.clientX - rect.left
            const y = touch.clientY - rect.top

            longPressTimer = setTimeout(() => {
                const latlng = map.value.containerPointToLatLng([x, y])
                contextMenu.value = {
                    visible: true,
                    position: { x: touch.clientX, y: touch.clientY },
                    coords: latlng
                }
            }, 800)
        }
    }

    function handleTouchEnd() {
        clearTimeout(longPressTimer)
    }

    function hideContextMenu() {
        contextMenu.value.visible = false
    }

    return {
        contextMenu,
        handleRightClick,
        handleTouchStart,
        handleTouchEnd,
        hideContextMenu
    }
}
