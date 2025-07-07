import api from '@/api/axiosInstance.js'

export const fetchUserInfo = () => api.get('/api/user/info')
export const fetchFavorites = () => api.get('/api/mypage/favorites')
export const updatePassword = (payload) => api.post('/api/mypage/password', payload)

