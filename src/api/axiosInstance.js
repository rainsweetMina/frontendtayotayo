// src/api/axiosInstance.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:8081',
    withCredentials: true // ✅ 세션 인증 유지에 필요
})

export default api
