import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        keyword: '',
        lastSearchedKeyword: '',
        sidebarOpen: false,
        // 최근 검색어 저장을 위한 상태 추가
        recentSearches: [],
        maxRecentSearches: 5,

        // 🔽 길찾기 관련 상태
        startCoord: null,
        endCoord: null,
        autoTriggered: {
            startMarker: false,
            endMarker: false
        },
        startBsId: null,
        endBsId: null,
        startStop: null,         // 출발 정류장 객체 (bsId, bsNm 등)
        endStop: null,           // 도착 정류장 객체
        routeResults: [],
        selectedRoute: null,
        forceRouteMode: false,
        isRouteSearchMode: false,

        // ✅ 자동완성 및 목록 관련 상태 추가
        busStops: [],
        busRoutes: [],

        // ✅ 텍스트 입력값
        departure: '',
        arrival: '',

        // ✅ 좌표 텍스트용 필드 추가
        startCoordText: '',
        endCoordText: '',

        // ✅ 현재 선택 중인 필드: 'start' | 'end' | null
        selectingField: null
    }),
    actions: {
        setKeyword(value) {
            // 검색어가 변경되면 검색 결과 초기화
            if (this.keyword !== value) {
                this.busStops = []
                this.busRoutes = []
                this.routeResults = []
            }
            this.keyword = value
        },
        commitSearch() {
            this.lastSearchedKeyword = this.keyword
            this.addToRecentSearches(this.keyword)
        },
        // 최근 검색어에 추가하는 액션
        addToRecentSearches(keyword) {
            if (!keyword || !keyword.trim()) return
            
            // 중복 검색어 제거
            this.recentSearches = this.recentSearches.filter(item => item !== keyword)
            
            // 최신 검색어를 배열 앞에 추가
            this.recentSearches.unshift(keyword)
            
            // 최대 개수 유지
            if (this.recentSearches.length > this.maxRecentSearches) {
                this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches)
            }
            
            // 로컬 스토리지에 저장
            this.saveRecentSearchesToCache()
        },
        // 로컬 스토리지에 저장
        saveRecentSearchesToCache() {
            localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
        },
        // 로컬 스토리지에서 불러오기
        loadRecentSearchesFromCache() {
            const saved = localStorage.getItem('recentSearches')
            if (saved) {
                try {
                    this.recentSearches = JSON.parse(saved)
                } catch (e) {
                    console.error('최근 검색어 로드 실패:', e)
                    this.recentSearches = []
                }
            }
        },
        // 특정 검색어 삭제
        removeFromRecentSearches(keyword) {
            this.recentSearches = this.recentSearches.filter(item => item !== keyword)
            this.saveRecentSearchesToCache()
        },
        // 모든 검색어 삭제
        clearRecentSearches() {
            this.recentSearches = []
            this.saveRecentSearchesToCache()
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
        setStartCoordText(text) {
            this.startCoordText = text
            this.departure = text //
        },
        setEndCoordText(text) {
            this.endCoordText = text
            this.arrival = text
        },
        setStartCoord(coord) {
            this.startCoord = coord
        },
        setEndCoord(coord) {
            this.endCoord = coord
        },
        setStartBsId(bsId) {
            this.startBsId = bsId
        },
        setEndBsId(bsId) {
            this.endBsId = bsId
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
