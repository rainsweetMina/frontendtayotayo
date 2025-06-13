import { createApp } from 'vue'
import { useSearchStore } from "@/stores/searchStore.js";
import { tryFindRoute } from '@/utils/route-search'
import BusStopPopup from '@/modules/busMap/components/BusStopPopup.vue'
import { useFavoriteBusStop } from '@/modules/busSearch/composables/useFavoriteBusStop.js'

export function renderPopupComponent(marker, stop, arrivals) {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const store = useSearchStore()
    const { isFavorited, toggleFavorite } = useFavoriteBusStop()

    const app = createApp(BusStopPopup, {
        stopName: stop.bsNm,
        arrivals,
        onSetStart: () => {
            if (store.startStop?.bsId === stop.bsId) {
                // ✅ 이미 선택된 출발지 → 해제
                store.setStartStop(null)
                store.departure = ''
                store.busStops = []
                store.busRoutes = []
            } else {
                // ✅ 새로 선택된 출발지
                store.setStartStop(stop)
                store.departure = stop.bsNm
                store.selectingField = 'start'
                if (store.endStop) {
                    store.busStops = []
                    store.busRoutes = []
                }
                tryFindRoute(store)
            }
        },
        onSetEnd: () => {
            if (store.endStop?.bsId === stop.bsId) {
                store.setEndStop(null)
                store.arrival = ''
                store.busStops = []
                store.busRoutes = []
            } else {
                store.setEndStop(stop)
                store.arrival = stop.bsNm
                store.selectingField = 'end'
                if (store.startStop) {
                    store.busStops = []
                    store.busRoutes = []
                }
                tryFindRoute(store)
            }
        }
    })

    app.mount(container)

    return container
}