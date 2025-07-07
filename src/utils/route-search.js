import api from '@/api/axiosInstance'
import { useSearchStore } from '@/stores/searchStore'

export async function tryFindRoute() {
    const store = useSearchStore()
    if (!store.startStop || !store.endStop) return

    const { startStop, endStop } = store

    // 동일 경로 요청 방지
    if (
        store.routeResults.length > 0 &&
        store.lastStartId === startStop.bsId &&
        store.lastEndId === endStop.bsId
    ) return

    store.setRouteResults([])

    try {
        const { data } = await api.get('/api/bus/findRoutes', {
            params: {
                startBsId: startStop.bsId,
                endBsId: endStop.bsId
            }
        })
        store.setRouteResults(data)
        store.lastStartId = startStop.bsId
        store.lastEndId = endStop.bsId
    } catch (err) {
        console.error('❌ 길찾기 실패:', err)
        alert('길찾기 요청 중 오류가 발생했습니다.')
    }
}