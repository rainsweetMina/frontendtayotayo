import axios from 'axios'
import {ref} from 'vue'


export function useFavoriteBusStop() {
    const favoriteSet = ref(new Set())
    const favoriteList = ref([]) // 🕒 전체 객체 리스트 (bsId + createdAt 등)
    const favoriteStops = ref([])

    const fetchFavorites = async () => {
        try {
            const res = await axios.get('/api/mypage/favorite/bus-stop')
            favoriteStops.value = res.data
        } catch (e) {
            console.error(e)
        }
    }

    const addFavoriteStop = async (stop) => {
        try {
            await axios.post('/api/mypage/favorite/bus-stop',
                {bsId: stop.bsId},
                {withCredentials: true},)
            alert(`'${stop.bsNm}' 정류장이 즐겨찾기에 추가되었습니다.`)
            await fetchFavorites()
        } catch (e) {
            console.error('🔥 추가 실패 - 응답 상태:', e?.response?.status)
            console.error('🔥 추가 실패 - 응답 메시지:', e?.response?.data)
            handleAuthError(e, '정류장 즐겨찾기 추가에 실패했습니다.')
        }
    }

    const deleteFavoriteStop = async (bsId) => {
        const confirmed = confirm('정말 해당 정류장을 즐겨찾기에서 삭제하시겠습니까?')
        if (!confirmed) return

        try {
            await axios.delete(`/api/mypage/favorite/bus-stop/${bsId}`)
            favoriteStops.value = favoriteStops.value.filter(s => s.bsId !== bsId)
            alert('정류장 즐겨찾기가 삭제되었습니다.')
        } catch (e) {
            handleAuthError(e, '정류장 즐겨찾기 삭제에 실패했습니다.')
        }
    }

    const isFavorited = (bsId) => favoriteSet.value.has(bsId)

    const toggleFavorite = async (stop) => {
        if (isFavorited(stop.bsId)) {
            await deleteFavoriteStop(stop.bsId)
        } else {
            await addFavoriteStop(stop)
        }
    }

    const getRecentFavorites = (count = 3) => {
        return [...favoriteStops.value]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, count)
    }

    const handleAuthError = (e, customMessage = '에러가 발생했습니다.') => {
        const status = e?.response?.status
        const message = e?.response?.data

        if (status === 401 || (typeof message === 'string' && message.includes('Null'))) {
            alert('로그인이 필요합니다.')
            window.location.href = '/login'
        } else {
            console.error('❌ 오류 발생:', e)
            alert(customMessage)
        }
    }

    return {
        favoriteStops,
        fetchFavorites,
        addFavoriteStop,
        deleteFavoriteStop,
        toggleFavorite,
        isFavorited,
        getRecentFavorites
    }
}