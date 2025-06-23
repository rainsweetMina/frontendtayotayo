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
        console.log('Right click event triggered', e);
        e.preventDefault()
        
        if (!mapRef.value) {
            console.error('mapRef.value is null or undefined');
            return;
        }
        
        const rect = mapRef.value.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        console.log('Map reference:', mapRef.value, 'Map value:', map.value);
        
        if (!map.value) {
            console.error('Map value is null or undefined');
            return;
        }
        
        try {
            const latlng = map.value.containerPointToLatLng([x, y])
            console.log('Calculated latlng:', latlng);

            contextMenu.value = {
                visible: true,
                position: { x: e.clientX, y: e.clientY },
                coords: latlng
            }
            console.log('Context menu updated:', contextMenu.value);
        } catch (error) {
            console.error('Error calculating latlng:', error);
        }
    }

    function handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0]
            
            if (!mapRef.value) {
                console.error('mapRef.value is null in touch handler');
                return;
            }
            
            const rect = mapRef.value.getBoundingClientRect()
            const x = touch.clientX - rect.left
            const y = touch.clientY - rect.top

            longPressTimer = setTimeout(() => {
                if (!map.value) {
                    console.error('Map value is null in touch handler');
                    return;
                }
                
                try {
                    const latlng = map.value.containerPointToLatLng([x, y])
                    contextMenu.value = {
                        visible: true,
                        position: { x: touch.clientX, y: touch.clientY },
                        coords: latlng
                    }
                } catch (error) {
                    console.error('Error in touch handler:', error);
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
