import { ref } from 'vue'
import axios from 'axios'

export function useStopArrival(arrivalDataMap, openedStopId) {
    const handleStopClick = async (stop) => {
        const bsId = stop.bsId
        openedStopId.value = bsId

        const map = window.leafletMap
        const lat = parseFloat(stop.ypos || stop.lat)
        const lng = parseFloat(stop.xpos || stop.lng)

        if (!isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 17)

            const marker = (window.busStopMarkers || []).find(m =>
                m.getLatLng().lat === lat && m.getLatLng().lng === lng
            )
            if (marker) marker.openPopup()
        }

        if (!arrivalDataMap.value[bsId]) {
            try {
                const { data } = await axios.get('/api/bus/bus-arrival', {
                    params: { bsId }
                })
                arrivalDataMap.value[bsId] = data?.body?.items || []
            } catch (err) {
                console.error('도착 정보 조회 실패:', err)
                arrivalDataMap.value[bsId] = []
            }
        }
    }

    return { handleStopClick }
}
