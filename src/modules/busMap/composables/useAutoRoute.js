import axios from 'axios'
import { nextTick } from 'vue'

export function useAutoRoute(store) {
    async function tryAutoRouteFromCoords(startCoord, endCoord) {
        if (!startCoord && !endCoord) return

        try {
            let startStop = null
            let endStop = null

            // 출발지 → 근처 정류장
            if (startCoord) {
                const res = await api.get('/api/bus/nearby-stops', {
                    params: {
                        startX: startCoord.lng,
                        startY: startCoord.lat,
                        endX: startCoord.lng,
                        endY: startCoord.lat,
                        radius: 300
                    }
                })
                startStop = res.data.startCandidates?.[0]
                if (startStop) store.setStartStop(startStop)
            }

            // 도착지 → 근처 정류장
            if (endCoord) {
                const res = await api.get('/api/bus/nearby-stops', {
                    params: {
                        startX: endCoord.lng,
                        startY: endCoord.lat,
                        endX: endCoord.lng,
                        endY: endCoord.lat,
                        radius: 300
                    }
                })
                endStop = res.data.endCandidates?.[0]
                if (endStop) store.setEndStop(endStop)
            }

            if (startStop && endStop) {
                const dist = Math.sqrt(
                    Math.pow(startStop.xPos - endStop.xPos, 2) +
                    Math.pow(startStop.yPos - endStop.yPos, 2)
                )

                if (dist < 0.001) {
                    store.setRouteResults([{
                        type: '직통',
                        routeNo: null,
                        estimatedMinutes: 0,
                        stationIds: [startStop.bsId],
                        transferCount: 0,
                        startBsId: startStop.bsId,
                        endBsId: endStop.bsId,
                        busStops: [startStop, endStop]
                    }])
                } else {
                    const { data: routeData } = await api.get('/api/bus/findRoutes', {
                        params: {
                            startBsId: startStop.bsId,
                            endBsId: endStop.bsId
                        }
                    })

                    const deduplicated = []
                    routeData.forEach(route => {
                        const exists = deduplicated.some(r =>
                            r.routeNo === route.routeNo && r.startBsId === route.startBsId
                        )
                        if (!exists) deduplicated.push(route)
                    })

                    const sorted = deduplicated
                        .sort((a, b) => {
                            const lenA = a.stationIds?.length || 0
                            const lenB = b.stationIds?.length || 0
                            if (lenA !== lenB) return lenA - lenB
                            if (a.type === '직통' && b.type !== '직통') return -1
                            if (a.type !== '직통' && b.type === '직통') return 1
                            return 0
                        })
                        .slice(0, 5)

                    store.setRouteResults(sorted)
                }
            }

            // 하나라도 있으면 사이드바 열기
            if (startStop || endStop) {
                store.toggleSidebar(true)
                await nextTick()
                store.forceRouteMode = true
            }

        } catch (err) {
            console.error('🚨 경로 탐색 실패:', err)
        }
    }

    return {
        tryAutoRouteFromCoords
    }
}
