import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', {
    state: () => ({
        keyword: '',                // ✅ input 연동용
        lastSearchedKeyword: '',    // ✅ 검색 실행 감지용
        sidebarOpen: false
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
        }
    }
})
