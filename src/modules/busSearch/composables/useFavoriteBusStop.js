import axios from 'axios'
import {ref} from 'vue'
import {useUserInfo} from '@/modules/mypage/composables/useUserInfo'

export function useFavoriteBusStop() {
    const favoriteSet = ref(new Set())
    const favoriteList = ref([]) // 🕒 전체 객체 리스트 (bsId + createdAt 등)
    const favoriteStops = ref([])

    const fetchFavorites = async () => {
        try {
            const res = await axios.get('/api/mypage/favorite/bus-stop', {withCredentials: true})
            favoriteStops.value = res.data
            favoriteSet.value = new Set(res.data.map(f => f.bsId))
        } catch (e) {
            const status = e?.response?.status
            if (status !== 401) {
                console.error('❌ 즐겨찾기 불러오기 실패:', e)
            }
        }
    }

    const addFavoriteStop = async (stop) => {
        if (!stop?.bsId) {
            console.warn('❌ 유효하지 않은 stop 객체:', stop)
            alert('정류장 정보가 올바르지 않습니다.')
            return
        }

        try {
            console.log('🧪 즐겨찾기 추가 요청:', stop.bsId)
            await axios.post('/api/mypage/favorite/bus-stop',
                {bsId: stop.bsId},
                {withCredentials: true})
            await fetchFavorites()
        } catch (e) {
            handleAuthError(e, '로그인이 필요합니다')
        }
    }

    const deleteFavoriteStop = async (bsId) => {
        try {
            await axios.delete(`/api/mypage/favorite/bus-stop/${bsId}`, {withCredentials: true})
            favoriteStops.value = favoriteStops.value.filter(s => s.bsId !== bsId)
        } catch (e) {
            handleAuthError(e, '정류장 즐겨찾기 삭제에 실패했습니다.')
        }
    }

    const isFavorited = (bsId) =>
        favoriteStops.value.some(stop => stop.bsId === bsId)

    const toggleFavorite = async (stop) => {
        if (isFavorited(stop.bsId)) {
            await deleteFavoriteStop(stop.bsId)
        } else {
            await addFavoriteStop(stop)
        }
    }

    const getRecentFavorites = (count = 3) => {
        return [...(favoriteStops.value || [])]
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