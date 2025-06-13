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
        e.stopPropagation()
        
        // 이벤트 좌표 계산
        const rect = mapRef.value.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        // 지도 좌표로 변환
        const latlng = map.value.containerPointToLatLng([x, y])
        
        // 컨텍스트 메뉴 표시
        contextMenu.value = {
            visible: true,
            position: { x: e.clientX, y: e.clientY },
            coords: latlng
        }
        
        // 지도 이벤트 방지
        map.value.dragging.disable()
        map.value.doubleClickZoom.disable()
        
        // 문서 클릭 이벤트 리스너 추가
        document.addEventListener('click', documentClickHandler, { once: true })
        
        console.log('컨텍스트 메뉴 표시:', contextMenu.value)
    }

    function documentClickHandler(e) {
        // 컨텍스트 메뉴 외부 클릭 시 닫기
        hideContextMenu()
        
        // 지도 이벤트 다시 활성화
        if (map.value) {
            map.value.dragging.enable()
            map.value.doubleClickZoom.enable()
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
                
                // 지도 이벤트 방지
                map.value.dragging.disable()
                map.value.doubleClickZoom.disable()
                
                console.log('터치 길게 눌러 컨텍스트 메뉴 표시:', contextMenu.value)
            }, 800)
        }
    }

    function handleTouchEnd() {
        clearTimeout(longPressTimer)
    }

    function hideContextMenu() {
        contextMenu.value.visible = false
        
        // 지도 이벤트 다시 활성화
        if (map.value) {
            map.value.dragging.enable()
            map.value.doubleClickZoom.enable()
        }
    }

    return {
        contextMenu,
        handleRightClick,
        handleTouchStart,
        handleTouchEnd,
        hideContextMenu
    }
}
