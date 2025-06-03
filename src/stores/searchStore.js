import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        keyword: '',
        lastSearchedKeyword: '',
        sidebarOpen: false,

        // 🔽 길찾기 관련 상태
        startStop: null,         // 출발 정류장 객체 (bsId, bsNm 등)
        endStop: null,           // 도착 정류장 객체
        routeResults: [],
        selectedRoute: null,
        forceRouteMode: false,

        // ✅ 자동완성 및 목록 관련 상태 추가
        busStops: [],
        busRoutes: [],

        // ✅ 현재 선택 중인 필드: 'start' | 'end' | null
        selectingField: null
    }),
    actions: {
        setKeyword(value) {
            this.keyword = value
        },
        commitSearch() {
            this.lastSearchedKeyword = this.keyword
        },
        toggleSidebar(open = true) {
            this.sidebarOpen = open
        },
        setStartStop(stop) {
            this.startStop = stop
            this.routeResults = []
            this.selectedRoute = null
            this.forceRouteMode = true
        },
        setEndStop(stop) {
            this.endStop = stop
            this.routeResults = []
            this.selectedRoute = null
            this.forceRouteMode = true
        },
        resetStops() {
            this.startStop = null
            this.endStop = null
            this.routeResults = []
            this.selectedRoute = null
        },
        setRouteResults(routes) {
            this.routeResults = routes
        },
        setSelectedRoute(route) {
            this.selectedRoute = route
        },

        // ✅ selectingField에 따라 자동 할당
        setSelectedStop(stop) {
            if (this.selectingField === 'start') {
                this.setStartStop(stop)
            } else if (this.selectingField === 'end') {
                this.setEndStop(stop)
            }
            this.selectingField = null // 선택 이후 초기화
        }
    }
})
