import axios from 'axios'

export const fetchUserInfo = () => api.get('/api/user/info')
export const fetchFavorites = () => api.get('/api/mypage/favorites')
export const updatePassword = (payload) => api.post('/api/mypage/password', payload)

