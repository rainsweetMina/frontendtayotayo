import axios from 'axios'

export const fetchUserInfo = () => axios.get('/api/user/info')
export const fetchFavorites = () => axios.get('/api/mypage/favorites')
export const updatePassword = (payload) => axios.post('/api/mypage/password', payload)

